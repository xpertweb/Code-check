const { LocalDate, LocalTime } = require('js-joda');
import _ from 'lodash';
import { BadRequest } from '@feathersjs/errors';
const RECURRENCE_ENUM = require('../../helpers/enum/recurrence-enum');
import {
  notifyClientByEmail,
  notifyClientBySMS,
  sendButlerFarewellEmail,
  sendButlerFarewellSms,
} from '../../helpers/send-butler-churn-mails';
const calculateVisitEndDateTime = require('../../helpers/calculate-visit-end-date-time');
const getAllocateButler = require('../../helpers/get-allocate-butler');
const winston = require('winston');

class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }

  find(params) {
    return Promise.resolve([]);
  }

  get(id, params) {
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`,
    });
  }

  async create(data, params) {
    const {
      reasonId,
      churnDate,
      comment,
      unchurnAttempted,
      butlerId,
      returnDate = null,
    } = data;

    const tags = returnDate
      ? {tags:['butler-pause', 'trs-butler-' + butlerId]}
      : {tags:['butler-churn', 'trs-butler-' + butlerId]};

    winston.info({event:'Creating butler churn', butlerId, churnDate, unchurnAttempted, returnDate}, tags);
    const isReturnDateSet = !!returnDate;
    const activeFrom = LocalDate.parse(churnDate).plusDays(1).toString();

    const accumulatedErrors = [];
    const accumulatedMessages = [];
    const startChurnDate = LocalDate.parse(churnDate).toString();
    const endChurnDate = LocalDate.parse(churnDate).plusDays(30).toString();
    const allClientVisitsAfterChurnDate = await this.app
      .service('visits')
      .find({
        query: {
          butlerId: butlerId,
          startDate: startChurnDate, // only retrieve visits after churn date for determining affected services
          endDate: endChurnDate
        },
      });
      winston.info({event:'Visits churn date', butlerId, startChurnDate, endChurnDate}, tags);
    const [churnReasonText] = await this.app
      .service('butlerChurnCategories')
      .find({ query: { id: reasonId } });
    //  get the affected butler
    const [butlerToBeChurned] = await this.app.service('butlers').find({
      query: { id: butlerId },
    });

    if (!isReturnDateSet) {
      console.log('no return date');
      winston.info({event:'No returned date mentioned by butler', butlerId}, tags);
      const butlerChurnCheck = await this.app.service('butlerChurns').find({
        query: {
          butlerId: butlerId,
        },
      });

      if (butlerChurnCheck.length === 0) {
        await this.app.service('butlerChurns').create({
          reasonId,
          churnDate,
          comment,
          unchurnAttempted,
          butlerId,
          returnDate,
        });
      }
    } else {
      console.log('return date provided');
      winston.info({event:'Returned date mentioned by butler',butlerId}, tags);
      const existingPause = await this.app.service('butlerPauses').find({
        query: {
          butlerId,
        },
      });
      console.log(existingPause);
      if (existingPause.length === 0) {
        winston.info({event:'No existing pause', butlerId}, tags);
        await this.app.service('butlerPauses').create({
          butlerId,
          startDate: LocalDate.parse(churnDate).toString(),
          endDate: LocalDate.parse(returnDate).toString(),
          reason: churnReasonText.reason,
        });
        accumulatedMessages.push(
          `Created butler pause for butler ${butlerId} from ${LocalDate.parse(
            churnDate
          ).toString()} to ${LocalDate.parse(returnDate).toString()} `
        );
      } else {
        winston.info({event:'Butler pause exist', butlerId}, tags);
        accumulatedMessages.push(
          `Butler pause exists for butler${butlerId}. Skipping the addition of a new pause`
        );
      }
    }

    let affectedServices = await this.app.service('serviceButlers').find({
      query: {
        butlerId,
        serviceId: {
          $in: _.uniq(
            allClientVisitsAfterChurnDate.map((visit) => visit.serviceId)
          ),
        },
      },
    });
    affectedServices = _.uniqBy(affectedServices, 'serviceId');
    // No upcoming services were affected. Hence, no client affected. Process can stop here
    if (affectedServices.length < 1) {
      console.info('No affected service found');
      winston.info({event:'No affected service found'}, tags);
      return Promise.reject(
        new BadRequest(
          'No services will be affected by churning this butler, hence nothing was done by the Churn button'
        )
      );
    }


    // if (!isReturnDateSet) {
    //   await this.patchWorkBlocks(butlerId, churnDate);
    // }

    const frozenButler = await this.app
      .service('butlers')
      .patch(butlerId, { onFreeze: true });

    const messageQueue = [];

    for (const affectedService of affectedServices) {

      // Get all visit plans for this service
      const allClientVisitPlans = await this.app
        .service('visitPlans')
        .find({ query: { serviceId: affectedService.serviceId } });
      // get all visits from churn date over the next 30 days. This way we can get the next visit irrespective of if it's weekly or forthnightly
      



      let allVisitsAfterChurnDate = [];
      if (!isReturnDateSet){
        allVisitsAfterChurnDate = await this.app.service('visits').find({
          query: {
            butlerId: butlerId,
            serviceId: affectedService.serviceId,
            // only retrieve visits after churn date for determining affected services
            startDate: LocalDate.parse(churnDate).plusDays(1).toString(),
            endDate: LocalDate.parse(churnDate).plusDays(30).toString(),
          },
        });
      }else{
        const startDate = LocalDate.parse(returnDate).plusDays(1).toString();
        const endDate = LocalDate.parse(startDate).plusDays(30).toString();
        allVisitsAfterChurnDate = await this.app.service('visits').find({
          query: {
            butlerId: butlerId,
            serviceId: affectedService.serviceId,
            // only retrieve visits after churn date for determining affected services
            startDate: startDate,
            endDate: endDate,
          },
        });
      }

      
      const serviceAddresses= await this.app
           .service('serviceAddresses')
           .find({ query: { serviceId: affectedService.serviceId } });

      winston.info({event:'service Addresses Found',length:serviceAddresses.length}, tags);

      const allocateButler= await getAllocateButler(this.app,serviceAddresses);


      // check if this service activeFrom is after churn date and has a butler assigned, delete that butler
      const isAfterChurnDate = affectedService.activeFrom.isAfter(
        LocalDate.parse(churnDate)
      );
      if (affectedService.butlerId === allocateButler.id && isAfterChurnDate) {
        winston.info({event:'Service activeFrom is after churn date and has a butler assigned', butlerId}, tags);
        await this.app.service('serviceButlers').patch(affectedService.id, {
          butlerId: allocateButler.id,
          activeFrom,
          butlerAllocatedByMethod:"trs",
          lastModifiedBy:"trs"
        });
      } else {
        await this.app.service('serviceButlers').create({
          butlerId: allocateButler.id,
          serviceId: affectedService.serviceId,
          activeFrom,
          butlerAllocatedByMethod:"trs",
          lastModifiedBy:"trs"
        });
      }
      // if return date is set, add a new entry for serviceButlers using the return date as active from date
      if (isReturnDateSet) {
        winston.info({event:'Return date is set, new entry for serviceButlers using the return date as active from date', butlerId}, tags);
        await this.app.service('serviceButlers').create({
          butlerId,
          serviceId: affectedService.serviceId,
          activeFrom: LocalDate.parse(returnDate).toString(),
          butlerAllocatedByMethod:"trs",
          lastModifiedBy:"trs"
        });
      }
      // check if a service churn risk exist. If not create one. It yes, update th risk rating
      const scRisk = await this.app
        .service('serviceChurnRisks')
        .find({ query: { serviceId: affectedService.serviceId } });
      if (scRisk.length === 0) {
        await this.app.service('serviceChurnRisks').create({
          serviceId: affectedService.serviceId,
          riskRating: 70,
          note: `Butler churned: ${churnReasonText.reason}`,
          creationDate: LocalDate.now().toString(),
        });
        winston.info({event:'Service churn does not exist. Creating one.', butlerId}, tags);
      } else {
        await this.app.service('serviceChurnRisks').patch(scRisk[0].id, {
          riskRating: 70,
          note: `Butler churned: ${churnReasonText.reason}`,
        });
        winston.info({event:'Service churn exist. Updating risk rating.', butlerId}, tags);
      }
      // exclude this butler from the service going forward
      if (!isReturnDateSet) {
        const seButler = await this.app
          .service('serviceExcludedButlers')
          .find({ query: { serviceId: affectedService.serviceId, butlerId } });

        if (seButler.length === 0){
          await this.app.service('serviceExcludedButlers').create({
            serviceId: affectedService.serviceId,
            butlerId,
            reason: `Butler churned: ${churnReasonText.reason}`,
            lastModifiedBy:"trs"
          });
          winston.info({event:'Excluding this butler from the service going forward', butlerId}, tags);
        }
      }
      const [activeVisitPlans] = allClientVisitPlans.filter(
        (x) => !x.endDate && x.recurrence !== RECURRENCE_ENUM.OneOff
      );
      if (!activeVisitPlans) {
        winston.info({event:'No active visit plans found for client. Exiting loop', butlerId}, tags);
        console.log('No active visit plans found for client. Exiting loop');
        continue;
      }

      if (!allVisitsAfterChurnDate || allVisitsAfterChurnDate.length === 0) {
        winston.info({event:'Exiting this loop because there are no visits after churn date', butlerId}, tags);
        console.log(
          'Exiting this loop because there are no visits after churn date'
        );
        continue;
      }
      const [closestVisit] = allVisitsAfterChurnDate;

      if (
        !closestVisit ||
        closestVisit.visitPlanRecurrence === RECURRENCE_ENUM.OneOff
      ) {
        const closestErrorMessage = `No closest visits found for service: ${affectedService.serviceId}. Skipping iteration`;
        console.log(closestErrorMessage);
        winston.info({event: closestErrorMessage}, tags);
        accumulatedErrors.push(closestErrorMessage.toString());
        continue;
      }
      // get previous and future visits going back and forward 30 days
      const oneOffs = allClientVisitPlans.filter(
        (x) => x.recurrence === RECURRENCE_ENUM.OneOff
      );
     
      const [earliestOneOff] = oneOffs;
      if (!earliestOneOff) {
        winston.info({event: 'An error occurred while churning this butler', butlerId}, tags);
        accumulatedErrors.push(
          `An error occurred while churning this butler. The client ${affectedService.service.client.firstName} ${affectedService.service.client.lastName} - ${affectedService.service.client.email} has no one off visit. So we just changed the assigned butler  <br>`
        );
      } else {
        //if there is a one off visit, then proceed below with creating a tight schedule one-off and a wide schedule recurring plan
      
        //End all client visit plans, we do not end them if there is no one-off visit because then we just need to change butlers
        if (
          LocalDate.parse(activeVisitPlans.startDate).isBefore(
            LocalDate.parse(churnDate)
          )
        ) {
          winston.info({event: 'Patch applied for butler', butlerId, startDate: activeVisitPlans.startDate, churnDate, endDate: activeVisitPlans.endDate, activeFrom}, tags);
          await this.app.service('visitPlans').patch(activeVisitPlans.id, {
            endDate: activeFrom,
            lastModifiedBy:'trs'
          });
        /*}else{
          winston.info({event: 'Patch applied for butler in else block', butlerId, startDate: activeVisitPlans.startDate, churnDate, endDate: activeVisitPlans.endDate, activeFrom}, tags);
          await this.app.service('visitPlans').patch(activeVisitPlans.id, {
            endDate: LocalDate.parse(activeVisitPlans.startDate).plusDays(1).toString(),
            lastModifiedBy:'trs'
          });
        }*/
        winston.info([{serviceId: affectedService.serviceId,
            startDate: closestVisit.date.toString(),
            duration: closestVisit.duration,
            recurrence: RECURRENCE_ENUM.OneOff,
            windowStartTime: earliestOneOff.windowStartTime, // use earliest visit plan window
            windowEndTime: `${calculateVisitEndDateTime(LocalTime.parse(earliestOneOff.windowStartTime),closestVisit.duration).toString()}:00`},
            {
            serviceId: affectedService.serviceId,
            startDate: recurringVisitDate,
            duration: closestVisit.duration,
            recurrence: closestVisit.visitPlanRecurrence,
            windowStartTime: closestVisit.windowStartTime,
            windowEndTime: closestVisit.windowEndTime
          }], tags);

        
        await this.app.service('visitPlans').create({
          serviceId: affectedService.serviceId,
          startDate: closestVisit.date.toString(),
          duration: closestVisit.duration,
          recurrence: RECURRENCE_ENUM.OneOff,
          windowStartTime: earliestOneOff.windowStartTime, // use earliest visit plan window
          windowEndTime: `${calculateVisitEndDateTime(
            LocalTime.parse(earliestOneOff.windowStartTime),
            closestVisit.duration
          ).toString()}:00`,
          comment: `New visit plan with NARROW times after churning ${frozenButler.firstName} ${frozenButler.lastName} - ${frozenButler.email}`,
          lastModifiedBy:'trs'
        });
        winston.info({event: 'Created new visit plan with NARROW times after churning'}, tags);
        const recurringVisitDate = this.getRecurringVisitDate(closestVisit);
        //create a new visit plan using the same recurrence as the previous butler's plans
        await this.app.service('visitPlans').create({
          serviceId: affectedService.serviceId,
          startDate: recurringVisitDate,
          duration: closestVisit.duration,
          recurrence: closestVisit.visitPlanRecurrence,
          windowStartTime: closestVisit.windowStartTime,
          windowEndTime: closestVisit.windowEndTime,
          comment: `New visit plan with WIDE times after churning ${frozenButler.firstName} ${frozenButler.lastName} - ${frozenButler.email}`,
          lastModifiedBy:'trs'
        });
        winston.info({event: 'Created new visit plan with WIDE times after churning'}, tags);
        // NOTE: let's contact the client for this service who have had visits in the past and have future plans
        accumulatedMessages.push(
          `We have created a visit plan for ${
            affectedService.service.client.firstName
          } ${affectedService.service.client.lastName} - ${
            affectedService.service.client.email
          }, one off at ${closestVisit.date.toString()} @from ${
            earliestOneOff.windowStartTime
          } @to ${
            earliestOneOff.windowEndTime
          } and recurring at ${recurringVisitDate} @from ${
            closestVisit.windowStartTime
          } @to ${closestVisit.windowEndTime}`
        );
        // creating service logs on trs execution for the service

        try{ 
        
          let logText = `TRS: after churning ${frozenButler.email}, two visit plans have been created with wide date: ${recurringVisitDate} - Present (active date of the butler),  time: ${closestVisit.windowStartTime}  - ${closestVisit.windowEndTime}, recurrence: weekly and narrow times Date: ${closestVisit.date.toString()}, Time: ${earliestOneOff.windowStartTime} - ${calculateVisitEndDateTime(LocalTime.parse(earliestOneOff.windowStartTime),closestVisit.duration).toString()}:00, recurrence:One-off`;
          
          let logJson = {event:'Butler churn',churnDate:churnDate,activeVisitPlans:activeVisitPlans,churnedButler: butlerToBeChurned};
          
          await this.app.service('serviceLogs').create({serviceId:affectedService.serviceId,logJson:JSON.stringify(logJson),logText,createdBy:'trs'});
        }catch(err){
          winston.info({event: 'Creating service log error', message:err.message}, tags);
        }
      }
    }

      if (this.visitsBeforeOrAfterChurnDate(churnDate, activeVisitPlans)) {
        try {
          // remove client sms on butler churn
          // messageQueue.push(
          //   notifyClientBySMS(
          //     params,
          //     isReturnDateSet,
          //     affectedService,
          //     butlerToBeChurned,
          //     churnDate,
          //     returnDate,
          //     closestVisit,
          //     earliestOneOff,
          //     churnReasonText
          //   )
          // );
          winston.info({event: 'Creating notification for butler'}, tags);
          messageQueue.push(
            notifyClientByEmail(
              params,
              isReturnDateSet,
              affectedService,
              butlerToBeChurned,
              churnDate,
              returnDate,
              closestVisit,
              earliestOneOff,
              churnReasonText
            )
          );
        } catch (ex) {
          const errorMessageNotifs = `An error occurred while creating the notification messages for butler ${ex.message}`;
          console.error(errorMessageNotifs);
          winston.info({event: errorMessageNotifs}, tags);
          accumulatedErrors.push(errorMessageNotifs.toString());
        }
      }
    }
    try {
      await Promise.all(messageQueue);
      await sendButlerFarewellEmail(
        params,
        butlerToBeChurned,
        isReturnDateSet,
        churnDate,
        returnDate,
        churnReasonText
      );
      await sendButlerFarewellSms(
        params,
        butlerToBeChurned,
        isReturnDateSet,
        churnDate,
        returnDate,
        churnReasonText
      );
      winston.info({event: 'Sending butler farewell for email and sms'}, tags);
    } catch (error) {
      const errorMessageNotifs = `An error occurred while sending out messages. However the churn was successful ${error.message}`;
      console.error(errorMessageNotifs);
      winston.info({event: errorMessageNotifs}, tags);
      accumulatedErrors.push(errorMessageNotifs.toString());
    }

    console.log('accumulated message', accumulatedMessages, accumulatedErrors);
    winston.info({event: accumulatedMessages, accumulatedErrors}, tags);
    return Promise.resolve({
      message: `Butler Churn successful with these details:
    Unexpected situations:
    ${accumulatedErrors.join('<br>')}
    <br>
    Final results of churn:
    ${accumulatedMessages.join('<br>')}
      `,
    });
  }

  visitsBeforeOrAfterChurnDate(_churnDate, activeVisitPlans){
    const startDate = LocalDate.parse(activeVisitPlans.startDate);
    const churnDate = LocalDate.parse(_churnDate);

    return churnDate.isAfter(startDate) || churnDate.isBefore(startDate);
  }

  async createdButlerPause(butlerId, _churnDate, _returnDate, reason) {
    const butlerPauses = await this.app
      .service('butlerPauses')
      .find({ query: { butlerId } });
    const churnDate = LocalDate.parse(_churnDate).toString();
    const returnDate = LocalDate.parse(_returnDate).toString();

    if (butlerPauses.length === 0) {
      await this.app.service('butlerPauses').create({
        butlerId,
        startDate: churnDate,
        endDate: returnDate,
        reason: reason,
      });
      return `Created butler pause for butler ${butlerId} from ${churnDate} to ${returnDate}`;
    }

    return `Butler pause exists for butler ${butlerId}. Skipping the addition of a new pause`;
  }

  async createdButlerChurn(record) {
    const churn = await this.app.service('butlerChurns').find({
      query: { butlerId: record.butlerId },
    });

    if (churn.length !== 0) {
      return Promise.resolve(void 0);
    }

    await this.app.service('butlerChurns').create(record);
  }

  async getAffectedServices(butlerId, churnDate) {
    // only retrieve visits after churn date for determining affected services
    const visits = await this.app.service('visits').find({
      query: {
        butlerId: butlerId,
        startDate: LocalDate.parse(churnDate).toString(),
        endDate: LocalDate.parse(churnDate).plusDays(30).toString(),
      },
    });

    const query = {
      butlerId,
      serviceId: { $in: _.uniq(visits.map((visit) => visit.serviceId)) },
    };
    const services = await this.app.service('serviceButlers').find({ query });
    const uniqServices = _.uniqBy(services, 'serviceId');

    // No upcoming services were affected. Hence, no client affected. Process can stop here
    if (uniqServices.length < 1) {
      console.info('No affected service found');
      const err = new BadRequest(
        'No services will be affected by churning this butler, ' +
          'hence nothing was done by the Churn button.'
      );

      return [undefined, err];
    }

    return [uniqServices, undefined];
  }

  async patchWorkBlocks(butlerId, churnDate) {
    const activeFrom = LocalDate.parse(churnDate).plusDays(1);
    const workBlocks = await this.app.service('workBlocks').find({ query: { butlerId } });

    const tasks = workBlocks.map(block => {
      if (LocalDate.parse(block.startDate).isBefore(activeFrom)){
        return this.app.service('workBlocks').patch(block.id, {
          startDate: block.startDate,
          endDate: activeFrom.toString(),
        });
      }

      return Promise.resolve();
    });

    await Promise.all(tasks);
  }

  getRecurringVisitDate({visitPlanRecurrence, date}) {
    if (visitPlanRecurrence === RECURRENCE_ENUM.Weekly){
      return LocalDate.parse(date.toString()).plusDays(7).toString()
    }else{
      if (visitPlanRecurrence === RECURRENCE_ENUM.Fortnightly){
        return LocalDate.parse(date.toString()).plusDays(14).toString()
      }else{
        return LocalDate.parse(date.toString()).plusDays(28).toString();
      }
    }
  }

  update(id, data, params) {
    return Promise.resolve(data);
  }

  patch(id, data, params) {
    return Promise.resolve(data);
  }

  remove(id, params) {
    return Promise.resolve({ id });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
