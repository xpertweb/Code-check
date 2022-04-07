import { LocalDate } from 'js-joda';
import axios from 'axios';

const logger = require('winston');
const butlerScheduleChangedNotification = require('../../../mail-templates/butler-schedule-changed-notification');

const DAYS_AHEAD_BOOKING_CAN_BE_MADE = 1;
module.exports = function () {
  return async function calculateLastVisitCreationDateForService(hook) {
    
    if (hook.result && hook.result.id) {
      const visitPlan = hook.result;
      try {
        const nextVisitPlanVisitThatCouldHaveAffectedButlerCheckins = await hook.app.service('visits').find({
          query: {
            visitPlanId: visitPlan.id,
            startDate: LocalDate.now().toString(),
            endDate: LocalDate.now().plusDays(DAYS_AHEAD_BOOKING_CAN_BE_MADE + 1 //we do +1 to cover the right end of the visit
              ).toString()
          }
        });

        if (nextVisitPlanVisitThatCouldHaveAffectedButlerCheckins.length > 0){
          const {butlerId, date} = nextVisitPlanVisitThatCouldHaveAffectedButlerCheckins[0];
          const affectedCheckins = await hook.app.service('butlerVisitCheckinStatus').find({
            query: {
              butlerId: butlerId,
              visitDate: date.toString()
            }
          });

          for(const checkin of affectedCheckins){
            await this.knex('butlerVisitCheckinStatus').where('id', checkin.id).update({
              butlerScheduleWasModifiedAndNeedsToBeReconfirmed: true,
              butlerConfirmsCanAttendVisit: false,
              butlerConfirmsCannotAttendVisit: false,
              checkinCancelledAfterHavingBeenConfirmed: false,
              checkinConfirmedAfterHavingBeenCancelled:  false
            }); 
          }
          const affectedButler = await hook.app.service('butlers').get(butlerId);
          await axios({
            method: 'post',
            baseURL: process.env.COMMS_URL,
            url: `/send-email`,
            data:{
              message: butlerScheduleChangedNotification.replace('@butler_name@',affectedButler.firstName),
              email: (process.env.NODE_ENV === 'development' ? 'test@getjarvis.com.au' : affectedButler.email),
              phoneNumber: affectedButler.phoneNumber,
              ticketStatus: 'pending',
              requesterId : '114329911454', // admin id
              author: 'Comms Platform',
              messageType: 'butler_schedule_modified_notification'
            },
            headers: {
              authorization: hook.params.headers.authorization
            }
          });
        }
        
      }
      catch (ex){
        logger.error(`Error updating affected checkins : ${ex.message || JSON.stringify(ex)}`);
      }

    }
    return hook;
  };
};

