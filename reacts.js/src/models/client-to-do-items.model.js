const { Schema } = require('feathers-schema');
const { ruuid } = require('./validators/regex');

export const clientToDoItemsSchema = new Schema({
  summary: { type: String, required: true, format: [ruuid, 'Summary must be a string'] },
  clientId: { type: String, required: true, format: [ruuid, 'Client id must be uuid'] },
}); 
