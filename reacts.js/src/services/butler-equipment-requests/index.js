const hooks = require('./butler-equipment-requests.hooks');
const createService = require('./butler-equipment-requests.class');




module.exports = function () {
  const app = this;
  const Model = app.get('knexClient');
  const paginate = app.get('paginate');
  const name = 'butlerEquipmentRequests';


  app.use('/'+name, createService({name, Model, paginate}));
  app.service(name).hooks(hooks);
};
