const {formatOutput} = require('./formatResponse');
const {parseWhereIn} = require('./helper');

const butlerQuery = require('./sql/butlers.sql.js');
const auxDataQuery = require('./sql/auxData.sql.js');

function auxDataStruct(){
  return {
    services: new Map(),
    clients: new Map(),
    serviceAddresses: new Map(),
    serviceHandovers: new Map(),
    visitPlans: new Map(),
    butlers: new Map(),
  };
}

function nestAuxData(rows){
  const ret = auxDataStruct();
  for (const row of rows) {
    const type = row.record.type;
    const data = formatOutput(type, row.record.data);
    if (type === 'serviceHandovers'){
      if (ret[type].has(data.serviceId)){
        // key already exists
        continue;
      }

      // use serviceId for serviceHandovers
      ret[type].set(data.serviceId, data);
    }

    ret[type].set(data.id, data);
  }

  return ret;
}

async function queryAuxData(knex, serviceIds){
  if (serviceIds.length === 0){
    return auxDataStruct();
  }

  const query = auxDataQuery.replace('$serviceIds', parseWhereIn(serviceIds));
  const data = await knex.raw(query);
  return nestAuxData(data.rows);
}

async function queryButler(knex, serviceIds){
  if (serviceIds.length === 0){
    return new Map();
  }

  const query = butlerQuery.replace('$serviceIds', parseWhereIn(serviceIds));
  const butlers = await knex.raw(query);

  const ret = new Map();
  for (const butler of butlers.rows) {
    ret.set(butler.id, formatOutput('butlers', butler));
  }
  return ret;
}

module.exports = {
  queryButler,
  queryAuxData,
  nestAuxData
};
