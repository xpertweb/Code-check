const _ = require('lodash');
import axios from 'axios';
const winston = require('winston');
const addEquipmentConditions = require("../helpers/add-equipment-conditions");
const servicesRequirementText = require("../helpers/services-requirement-text");

const newJobNearbyButlerSmsTemplate = require('../mail-templates/new-job-nearby-butler-sms-template');
const newJobNearbyButlerEmailTemplate = require('../mail-templates/new-job-nearby-butler-email-template');

async function sendNotificationToButler(butler,authorization,address,service,emailOnly,messageCount){
  winston.info({
    event:'send-notification',
    butler: _.get(butler, 'id'),
    serviceId: _.get(service, 'id'),
  }, {tags: 'notify-near-by-butlers'});
  let locale = _.get(address,'locale');
  let postcode = _.get(address,'postcode');

  winston.info({event:'send-notification-function',emailOnly:emailOnly}, {tags: 'notify-near-by-butlers'});

  if(!emailOnly && messageCount <= 20){
  try{
    await axios({
      method: 'post',
      baseURL: process.env.COMMS_URL,
      url: '/send-sms',
      data: {
        email: _.get(butler,'email'),
        phoneNumber: _.get(butler,'phoneNumber'),
        requesterId: '114329911454', // admin id
        message: (newJobNearbyButlerSmsTemplate
          .replace('@locale@', locale)
          .replace('@postcode@', postcode)),
        requesterId: 'generic_email',
        ticketStatus:'pending',
        author:'Comms Platform'
      },
      headers: { authorization }
    });
  } catch(err){
    winston.info({event:'send-notification-sms-failed',error:err.message}, {tags: 'notify-near-by-butlers'});
  }
 }
 if(messageCount <= 50){
  try{
    await axios({
      method: 'post',
      baseURL: process.env.COMMS_URL,
      url: '/send-email',
      data:  {
        message: (newJobNearbyButlerEmailTemplate
          .replace('@butler_first_name@', butler.firstName)
          .replace('@locale@', locale)
          .replace('@postcode@', postcode)
          .replace('@equipment_required_list@', servicesRequirementText(service))),
        email: butler.email,
        phoneNumber: butler.phoneNumber,
        ticketStatus: 'pending',
        author: 'Comms Platform',
        subject: 'New Backend Job Available!',
        messageType:'generic_email'
      },
      headers: { authorization }
    });
  }catch(err){
    winston.info({event:'send-notification-email-failed',error:err.message}, {tags: 'notify-near-by-butlers'});
  }
}
}

module.exports = function () {
  return async function messageToNearByButlers (hook) {
    winston.info({event:'Butler Allocations Function Start'}, {tags: 'notify-near-by-butlers'});

    if (!_.get(hook, 'data.needsToBeAllocated') && !_.get(hook, 'params.needsToBeAllocated') && !_.get(hook, 'data.needsToBeAllocatedByEmail') && !_.get(hook, 'params.needsToBeAllocatedByEmail')){
      winston.info({event:'cannot-send-notification both needsToBeAllocated and needsToBeAllocatedByEmail are false'}, {tags: 'notify-near-by-butlers'});
      delete hook.data.needsToBeAllocated;
      delete hook.data.needsToBeAllocatedByEmail;
      return hook;
    }
    let emailOnly=false;
    if(_.get(hook, 'data.needsToBeAllocatedByEmail') || _.get(hook, 'params.needsToBeAllocatedByEmail')){
       emailOnly=true;
    }
    if(_.get(hook, 'data.needsToBeAllocated') || _.get(hook, 'params.needsToBeAllocated')){
       emailOnly=false;
    }

    winston.info({event:'check-email-only-option',emailOnly:emailOnly}, {tags: 'notify-near-by-butlers'});
    let serviceId = _.get(hook,'data.serviceId');
    let service = await hook.app.get('knexClient').select('*').from('services').where('services.id', serviceId);
    let addresses = await hook.app.get('knexClient').select('*').from('serviceAddresses')
        .leftJoin('services', 'serviceAddresses.serviceId', 'services.id').where('serviceAddresses.serviceId', serviceId);

    winston.info({
      event:'Address Length',
      address:addresses.length,
      service:service.length
    }, {tags: 'notify-near-by-butlers'});

    if(addresses.length > 0 && service.length > 0){
      let address = _.first(addresses);
      let latitude = _.get(address,'geopoint.x');
      let longitude = _.get(address,'geopoint.y');
      let equipmentConditions = addEquipmentConditions(service[0]);

      let query = `WITH localButlers AS (select "butlerId","gender","disinfectantProvided","furnitureAssemblyProvided","steamCleanerProvided",
      "carpetDryCleaningProvided","spraysWipesAndBasicsProvided","mopProvided","vacuumProvided","handlesPets","packingServiceProvided","gardeningServiceProvided",
      "geopoint","email","firstName","lastName","phoneNumber","doNotSendAllocationsNotifications", SQRT(POW(69.1 * (${latitude}::float -  geopoint[0]::float), 2) + POW(69.1 * (geopoint[1]::float - ${longitude}::float) * COS('-84.030830'::float / 57.3), 2)) as distance_in_km from "butlerAddresses" left join "butlers" on "butlerId"=butlers.id) SELECT *
                   FROM localButlers WHERE distance_in_km <= 10 AND NOT "doNotSendAllocationsNotifications"=true ${equipmentConditions} order by distance_in_km asc limit 50`;

      let records = await hook.app.get('knexClient').raw(query);

      let butlers = _.get(records, 'rows');

      winston.info({
        event:'Butler Allocations Automated Message',
        // queryRun:query,
        butlersReturnedFromDb: butlers.length,
        servicesFound : service.length,
        addressesFound: addresses.length
      }, {tags: 'notify-near-by-butlers'});


      if(butlers.length>0){
        try {
          let logText = `Nearby Notification Butler executed Where total ${butlers.length} butlers found on requested location at ${address.locale}, ${address.postcode}`;
          let logJson = { event:'Notification Near By Butler',
                        butlersReturnedFromDb: butlers.length,
                        address: address
                      };
          await hook.app.service('serviceLogs').create({serviceId,logJson:JSON.stringify(logJson),logText:logText},hook.params);
        } catch (ex){
          winston.error(ex);
        }
        butlers.forEach((butler,index) => {
          sendNotificationToButler(butler,_.get(hook,'params.headers.authorization'),address,service[0],emailOnly,index+1);
        });
      }
    }
    delete hook.data.needsToBeAllocated;
    delete hook.data.needsToBeAllocatedByEmail;
    return hook;
  };
};
