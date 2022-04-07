const { Schema } = require('feathers-schema');

export const facebookClientSchema = new Schema({
  facebookId: {
    type: String
  },
  email: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  }
});


