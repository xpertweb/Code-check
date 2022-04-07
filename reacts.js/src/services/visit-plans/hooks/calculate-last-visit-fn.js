const RECURRENCE_ENUM = require('../../../helpers/enum/recurrence-enum');
// import { LocalDate } from 'js-joda';
import _ from 'lodash';
const logger = require('winston');


module.exports = async function(app, serviceId){
  if (!serviceId){
    return;
  }

  try {
    const knex = app.get('knexClient');
    // const oneOffAfterToday = (visitPlan) => {
    //   if (visitPlan.recurrence == RECURRENCE_ENUM.OneOff) {
    //     return LocalDate.parse(visitPlan.startDate.toString()).isAfter(LocalDate.now());
    //   } else {
    //     return true;
    //   }
    // };

    const isServiceActive = async (serviceId) => {
      const allVisitPlansOfService = await app.service('visitPlans').find({
        query: {
          serviceId: serviceId
        }
      });

      const deadVisitPlans = allVisitPlansOfService.filter(x =>
        !!x.endDate || x.recurrence == RECURRENCE_ENUM.OneOff); // all services need to have an end date or be one off to declare the service dead
      const serviceIsDead = deadVisitPlans.length == allVisitPlansOfService.length;

      allVisitPlansOfService.forEach(x=>{
        if (x.recurrence == RECURRENCE_ENUM.OneOff){
          x.endDate = x.startDate;
        }
      })
      const sortedVisitPlans = (allVisitPlansOfService.sort((a, b) => new Date((b.endDate || null)) - new Date((a.endDate || null))));
      const lastVisitDate = sortedVisitPlans.map(x => x.endDate)[0];

      return {
        serviceIsDead,
        lastVisitDate
      };
    }

    const { serviceIsDead, lastVisitDate,  } = await isServiceActive(serviceId);
    const record = {
      lastVisitCreationDate: (!serviceIsDead ? null : (new Date().toISOString().slice(0, 19).replace('T', ' '))),
      active: !serviceIsDead,
      lastVisitDate: (!serviceIsDead ? null : lastVisitDate)
    };

    await knex('services').where('id', serviceId).update(record);
    return _.set(record, 'id', serviceId);
  }
  catch (ex){
    logger.error(`Error creating last visit date: ${ex.message || JSON.stringify(ex)}`);
    return {error: ex.message};
  }
}
