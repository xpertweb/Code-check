
const butlerCancelledVisitTemplate = require('../../../mail-templates/butler-cancelled-visit-template');
const { sendEmail } = require('../../../helpers/send-email');
const moment = require('moment');
const axios = require('axios');
const _ = require('lodash');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async function (hook) {

    if (hook.data && hook.params.user.roles.indexOf('butler') > -1) {

      if (hook.data.butlerConfirmsCannotAttendVisit) {
        const butlerAffected = (await hook.app.service('butlers').find({
          query: {
            id: hook.data.butlerId
          }
        }))[0];

        const visitPlanAffected = await hook.app.service('visitPlans').get(hook.data.visitPlanId);

        const serviceAffected = (await hook.app.service('services').find({
          query: {
            id: visitPlanAffected.serviceId
          }
        }))[0];
        if(hook.data.visitDate == moment().format('YYYY-MM-DD')){
          await hook.app.service('servicePauses').create({
            serviceId: visitPlanAffected.serviceId,
            startDate: moment().format('YYYY-MM-DD'),
            endDate: moment().add(1,'day').format('YYYY-MM-DD'),
            lastModifiedBy: 'Backend-core (butler cancelled check-in)'
          });
        }

        const { line1, line2, locale, state, postcode, country } = serviceAffected.address;
        const { butlerPreviouslyVisitedClient, butlerRescheduledWithClient, butlerRescheduledDate, butlerWillVisitClientInTheFuture, butlerNextAvailabilityDate, comment,butlerNextAvailabilityDateLocale,butlerRescheduledDateLocale } = hook.data;
        
        
        let butlerNextAvailabilityDateText = (butlerNextAvailabilityDate && butlerNextAvailabilityDate.length > 0 && !!butlerNextAvailabilityDate[0]) ? `Yes - ${butlerNextAvailabilityDate[0]} ${butlerNextAvailabilityDate.length > 1 ? butlerNextAvailabilityDate[1] : 'NA'}. Please notify the client of these possible visit dates via phone or SMS if unreachable` : 'NA';
        if(butlerNextAvailabilityDateLocale){
          butlerNextAvailabilityDateText = (butlerNextAvailabilityDateLocale && butlerNextAvailabilityDateLocale.length > 0 && !!butlerNextAvailabilityDateLocale[0]) ? `Yes - ${moment(`${butlerNextAvailabilityDateLocale[0].date} ${butlerNextAvailabilityDateLocale[0].time}`).format("LLLL")} ${butlerNextAvailabilityDateLocale.length > 1 ? moment(`${butlerNextAvailabilityDateLocale[1].date} ${butlerNextAvailabilityDateLocale[1].time}`).format("LLLL") : 'NA'}. Please notify the client of these possible visit dates via phone or SMS if unreachable` : 'NA';
        }
        let rescheduleText = butlerRescheduledWithClient && butlerRescheduledDate ? `Yes - ${butlerRescheduledDate}. Please change the visit date to ${butlerRescheduledDate} in the schedule and notify the client` : 'NA';
        if(butlerRescheduledDateLocale){
          let rescheduledDateLocale= moment(`${hook.data.butlerRescheduledDateLocale.date} ${hook.data.butlerRescheduledDateLocale.time}`).format("LLLL");
          rescheduleText = butlerRescheduledWithClient && butlerRescheduledDateLocale ? `Yes - ${rescheduledDateLocale}. Please change the visit date to ${rescheduledDateLocale} in the schedule and notify the client` : 'NA';
        }

        const additionalTemplateTitle = !hook.data.butlerCancelledVisitBefore24hrs ? '' : ' within 18 hours of the visit';

        const subject = !hook.data.butlerCancelledVisitBefore24hrs ? 'Butler Cancelation is Admissible, No Penalty' : 'Late Butler Cancelation, Penalty to be applied';

        const notificationText = butlerCancelledVisitTemplate
          .replace(/@additional_template_title@/g, `${additionalTemplateTitle}`)
          .replace(/@butler_name@/g, `${butlerAffected.firstName} ${butlerAffected.lastName}`)
          .replace(/@client_address@/g, `${line1} ${line2 || ''} ${locale || ''} - ${state}, ${postcode}, ${country}`)
          .replace(/@butler_email@/g, butlerAffected.email)
          .replace(/@visit_date@/g, hook.data.visitDate)
          .replace(/@client_name@/g, `${serviceAffected.client.firstName} ${serviceAffected.client.lastName}`)
          .replace(/@reason_for_cancellation@/, `${comment ? comment : 'NA'}`)
          .replace(/@butler_visited_client_previously@/, butlerPreviouslyVisitedClient ? `Yes` : `No. Please move the visit to 'allocate'`)
          .replace(/@butler_intends_to_visit_in_the_future@/, butlerWillVisitClientInTheFuture ? `Yes` : `No. Please manually confirm this with ${butlerAffected.firstName} and churn the client from the cleaner if necessary and organise a new cleaner`)
          .replace(/@butler_agreed_with_client_to_reschedule@/, `${rescheduleText}`)
          .replace(/@butler_next_available_date@/, `${butlerNextAvailabilityDateText}`);
        console.log(notificationText);
        const email = {
          from: process.env.NO_REPLY_EMAIL_ADDRESS,
          to: process.env.HELP_NOTIFICATION_EMAIL_ADDRESS,
          subject: subject,
          html: notificationText,
        };
        sendEmail(hook.app, email);
      }
    }
    delete hook.data['butlerNextAvailabilityDate'];
    delete hook.data['butlerNextAvailabilityDateLocale'];
    delete hook.data['butlerRescheduledDateLocale'];
    return hook;
  };
};
