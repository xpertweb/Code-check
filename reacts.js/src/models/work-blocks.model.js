const { ruuid, rdate, rtime } = require('./validators/regex');
const { Schema } = require('feathers-schema');

export const workBlockSchema = new Schema({
  butlerId: { type: String, required: true, format: [ruuid, 'Butler id must be uuid'] },
  startDate: { type: String, required: true, format: [rdate, 'Start date is invalid'] },
  endDate: { type: String, format: [rdate, 'End date is invalid'] },
  windowStartTime: { type: String, required: true, format: [rtime, 'Window start time is invalid'] },
  windowEndTime: { type: String, required: true, format: [rtime, 'Window end time is invalid'] }
});
