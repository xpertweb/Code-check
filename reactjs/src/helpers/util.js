const { BadRequest } = require('@feathersjs/errors');

function endpointError(obj) {
  return new BadRequest('Bad Request', {errors: obj});
}

function dateTime() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function currentDate() {
  return new Date().toISOString().split('T')[0];
}

function readEmailTemplate(fileName){
  return require('../mail-templates/'+fileName);
}

function isEmptyObj(obj){
  return Object.keys(Object(obj)).length === 0;
}

function castInt(val){
 return parseInt(val) || 0
}


module.exports = {
  endpointError,
  dateTime,
  currentDate,
  readEmailTemplate,
  isEmptyObj,
  castInt
}
