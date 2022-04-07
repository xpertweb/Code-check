const { Schema } = require('feathers-schema');
const { ruuid, rdate, rbutlerunchurnattempted } = require('./validators/regex');

export const butlerChurnsSchema = new Schema({
  butlerId: {
    type: String,
    required: true,
    format: [ruuid, 'Butler id must be uuid']
  },
  churnDate: {
    type: String,
    required: true,
    format: [rdate, 'Churn Date is invalid']
  },
  returnDate: {
    type: String,
    format: [rdate, 'Return Date is invalid']
  },
  reasonId: {
    type: String,
    required: true,
    format: [ruuid, 'Reason id must be uuid']
  },
  comment: {
    type: String,
    length: { min: 0, max: 250 }
  },
  unchurnAttempted: { type: String, format: [rbutlerunchurnattempted, 'Butler unchurn attempted state must be either of yes|no|notattempted']}
});
