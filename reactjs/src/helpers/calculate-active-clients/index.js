import notify from '../notify';
import _ from 'lodash';
import winston from 'winston';

const RECURRENCE_ENUM = require('../enum/recurrence-enum');

const {
  cleanButlerIds,
  requestRequiredData,
  getServiceButlers,
} = require('./services-query');

const {
  extractDataFromQuery,
  countClients,
  getNoActiveClientsDate,
  batchUpdateWithCustomQuery,
} = require('./helper');





async function main(knex, authorization, _butlerIds) {
  const butlerIds = cleanButlerIds(_butlerIds);
  const respPromise = requestRequiredData(knex, butlerIds);
  const allActiveButlers = await getServiceButlers(knex, butlerIds);
  const butlersMap = hashButlers(allActiveButlers);
  const resp = await respPromise;

  const {
    visitPlans,
    servicesWithLastAssignedButlers,
    clientsWithServices
  } = extractDataFromQuery(resp);


  const serviceClientsMap = hashClients(clientsWithServices);
  const validServicesMap = hashValidServices(visitPlans);
  const activeServices = validateServices(
    servicesWithLastAssignedButlers,
    validServicesMap
  );

  // do the calculation
  const computedActiveClients = computeActiveClients(activeServices, serviceClientsMap);

  // generate data to insert
  const records = generateRecordsToInsert(butlersMap, computedActiveClients);


  // optimize insert
  // no need to insert if old activeClient count is same as new one
  const recordsToInsert = records.filter(({butlerId, activeClients}) => {
    return _.get(butlersMap.get(butlerId), 'activeClients') !== activeClients;
  });

  winston.info({
    butlerProcessed: records.length,
    butlerUpdated: recordsToInsert.length,
  }, {tag: 'active-clients-calculation'});

  // sync data
  await batchUpdateWithCustomQuery(knex, recordsToInsert);
}



/**
 * Used to compute activeClients.
 * Then we will be stored activeClients database with related butler id
 *
 * @returns Map<butlerId: String, clientIds: Set>
 */
function generateRecordsToInsert(butlers, computedActiveClients){
  const ret = [];
  for (const butler of butlers.values()) {
    const activeClients = countClients(computedActiveClients.get(butler.id));

    const noActiveClientsDate = getNoActiveClientsDate(
      activeClients,
      _.get(butler, 'activeClients')
    );

    ret.push({
      butlerId: butler.id,
      activeClients,
      noActiveClientsDate,
    });
  }

  return ret;
}


function validateServices(services, validServices){
  return services.filter(({ serviceId }) => validServices.get(serviceId));
}


/**
 * Used to compute activeClients.
 * Then we will be stored activeClients database with related butler id
 *
 * @returns Map<butlerId: String, clientIds: Set>
 */
function computeActiveClients(activeServices, serviceClientsMap){
  const ret = new Map();
  for (const {butlerId, serviceId} of activeServices) {
    const coll = ret.get(butlerId) || new Set();
    const clientId = serviceClientsMap.get(serviceId);
    if (clientId){
      coll.add(clientId);
    }

    ret.set(butlerId, coll);
  }
  return ret;
}

/**
 * Used to store all active butlers with existing clients.
 *
 * @returns Map<butlerId: String, existingActiveClients: number>
 */
function hashButlers(butlers){
  const ret = new Map();
  for (const butler of butlers) {
    ret.set(butler.id, butler);
  }
  return ret;
}

/**
 * Used to store clients in butlers hash map.
 * Then we count clients using `countClients` method
 *
 * @returns Map<serviceId: String, clientId: String>
 */
function hashClients(clientsWithServices){
  const ret = new Map();
  for (const {id, clientId} of clientsWithServices) {
    ret.set(id, clientId);
  }
  return ret;
}

/**
 * Used to check if service has valid plan
 *
 * @returns Map<serviceId: String, status: Boolean>
 */
function hashValidServices(visitPlans) {
  const servicesStatus = new Map();
  const today = parseDate(todayDate());

  for (const visitPlan of visitPlans) {
    if (isActiveVisitPlan(visitPlan, today)){
      servicesStatus.set(visitPlan.serviceId, true);
    }
  }
  return servicesStatus;
}



/**
 * Check if visit plan is active
 * **/
function isActiveVisitPlan(visitPlan, today){
  if (visitPlan.recurrence == RECURRENCE_ENUM.OneOff){
    // one off plan has not ended
    return parseDate(visitPlan.startDate) > today;
  }

  // weekly and fortnightly plans
  if (!visitPlan.endDate){
    // plan has no end date, so its active
    return true;
  }
  return parseDate(visitPlan.endDate) > today;
}

function parseDate(date){
  return new Date(date + ' 00:00:00');
}


function todayDate(){
  const date = new Date().toISOString().split('T');
  return date[0];
}

module.exports = main;
