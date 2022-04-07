const _ = require('lodash');

function extractDataFromQuery(data){
  const ret = {
    visitPlans: [],
    servicesWithLastAssignedButlers: [],
    clientsWithServices: [],
  };

  for (const row of _.get(data, 'rows', [])) {
    const {type, data} = _.get(row, 'rows', {});
    ret[type] = Array.isArray(data) ? data : [];
  }
  return ret;
}

function batchUpdate(knex, records) {
  const pendingPromise = records.map(({butlerId, activeClients, noActiveClientsDate}) =>
    knex('butlers').where('id', butlerId).update({
      activeClients,
      noActiveClientsDate
    })
  );
  return Promise.all(pendingPromise);
}


function batchUpdateWithCustomQuery(knex, records) {
  return knex.raw(batchUpdateQuery(records));
}

function batchUpdateQuery(records){
  const jsonData = JSON.stringify(records);
  return `
    UPDATE butlers set
      "activeClients" = (record ->> 'activeClients')::int,
      "noActiveClientsDate" = (record ->> 'noActiveClientsDate')::timestamp
    from json_array_elements('${jsonData}') record
    where butlers.id = (record ->> 'butlerId')::uuid;
  `;
}

function countClients(clients) {
  if (!clients){
    return 0;
  }

  return Array.from(clients).filter(i => i).length;
}

function getNoActiveClientsDate(currentActiveClients, oldActiveClients){
  if (currentActiveClients == 0 && oldActiveClients > 0){
    return (new Date().toISOString()).slice(0, 19).replace('T', ' ');
  }
  return null;
}

function createEmailText(records, butlersMap){
  let ret = 'List of effected butlers (calculate activeClients): \n';
  for (const entry of records) {
    const { butlerId, activeClients } = entry;
    const email = _.get(butlersMap.get(butlerId), 'email') || butlerId;
    ret = ret + `${email}: ${activeClients}\n`;
  }
  return ret;
}

module.exports = {
  countClients,
  getNoActiveClientsDate,
  batchUpdate,
  extractDataFromQuery,
  createEmailText,
  batchUpdateWithCustomQuery,
};
