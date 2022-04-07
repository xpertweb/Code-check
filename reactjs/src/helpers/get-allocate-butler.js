import _ from 'lodash';

module.exports = async function (app,serviceAddresses) {

  const address = _.last(serviceAddresses);
  const state = _.get(address,'state');
  const query = app.get('knexClient').select('butlers.id').from('butlers').where('butlers.firstName','ALLOCATE');

  if (state){
    query.leftJoin('butlerAddresses', 'butlers.id', 'butlerAddresses.butlerId')
      .where('butlerAddresses.state',state);                        
  }
  return _.first(await query) || {};

};