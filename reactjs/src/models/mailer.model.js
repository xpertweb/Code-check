const { Schema } = require('feathers-schema');

export const mailerSchema = new Schema({
  from: {
    type: String
  },
  to: {
    type: String
  },
  subject: {
    type: String
  },
  html: {
    type: String
  },
  attachments : {
    type: String
  }
});
