const RECURRENCE_ENUM = require('../../../helpers/enum/recurrence-enum');
import { LocalDate } from 'js-joda';
const logger = require('winston');
const calculateLastVisit = require('./calculate-last-visit-fn');
const _ = require('lodash');

module.exports = function () {
  return async function calculateLastVisitCreationDateForService(hook) {
    await calculateLastVisit(hook.app, _.get(hook, 'result.serviceId'));

    // if (hook.result && hook.result.serviceId) {

    //   try {

    //     const oneOffAfterToday = (visitPlan) => {
    //       if (visitPlan.recurrence == RECURRENCE_ENUM.OneOff) {
    //         return LocalDate.parse(visitPlan.startDate.toString()).isAfter(LocalDate.now());
    //       } else {
    //         return true;
    //       }
    //     };

    //     const isServiceActive = async (serviceId) => {
    //       let allVisitPlansOfService = await hook.app.service('visitPlans').find({
    //         query: {
    //           serviceId: hook.result.serviceId
    //         }
    //       });

    //       const deadVisitPlans = allVisitPlansOfService.filter(x =>
    //         !!x.endDate || x.recurrence == RECURRENCE_ENUM.OneOff); // all services need to have an end date or be one off to declare the service dead
    //       const serviceIsDead = deadVisitPlans.length == allVisitPlansOfService.length;

    //       allVisitPlansOfService.forEach(x=>{
    //         if (x.recurrence == RECURRENCE_ENUM.OneOff){
    //           x.endDate = x.startDate;
    //         }
    //       })
    //       const sortedVisitPlans = (allVisitPlansOfService.sort((a, b) => new Date((b.endDate || null)) - new Date((a.endDate || null))));
    //       const lastVisitDate = sortedVisitPlans.map(x => x.endDate)[0];

    //       return {
    //         serviceIsDead,
    //         lastVisitDate
    //       };
    //     }

    //     const { serviceIsDead, lastVisitDate,  } = await isServiceActive(hook.result.serviceId);

    //     await this.knex('services').where('id', hook.result.serviceId).update({
    //       lastVisitCreationDate: (!serviceIsDead ? null : (new Date().toISOString().slice(0, 19).replace('T', ' '))),
    //       active: !serviceIsDead,
    //       lastVisitDate: (!serviceIsDead ? null : lastVisitDate)
    //     });

    //   }
    //   catch (ex){
    //     logger.error(`Error creating last visit date: ${ex.message || JSON.stringify(ex)}`);
    //   }

    // }
    return hook;
  };
};

