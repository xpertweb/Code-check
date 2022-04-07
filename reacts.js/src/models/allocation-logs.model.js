const { Schema } = require('feathers-schema');
const { rdate } = require('./validators/regex');

export const allocationLogsSchema = new Schema({
  allocatedButlersJsonData: { type: String },
  executionDate: { type: String,  format: [rdate, 'Execution date is invalid'] },
  dateTimeAllocationExecuted: {Type: Date}
}); 
