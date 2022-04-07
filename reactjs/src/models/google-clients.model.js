const { Schema } = require('feathers-schema');

export const googleClientSchema = new Schema({
  googleId: {
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
