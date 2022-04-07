const { ruuid, rdate } = require('./validators/regex');
const { Schema } = require('feathers-schema');


const statusRule = /^(new|resolved|rejected)$/;
const typeRule = /^(request|bought)$/;
const requestMadeByRule = /^(butler|operator)$/

export const butlerEquipmentRequestsSchema = new Schema({
  butlerId: {type: String},
  maskQuantity: {type: Number, default: 0},
  gloveQuantity: {type: Number, default: 0},
  disinfectantQuantity: {type: Number, default: 0},
  status: {type: String, required: true, format: [statusRule, 'status value is invalid']},
  type: {type: String, required: true, format: [typeRule, 'type value is invalid']},
  requestStatusChangedDate: {type: String, format: [rdate, 'requestStatusChangedDate is invalid']},
  receipt: {type: String, default: ''},
  butlerAddressId: {type: String},
  requestMadeBy: {type: String, required: true, format: [requestMadeByRule, 'requestMadeBy value is invalid']},
  note: {type: String, default: ''}
});
