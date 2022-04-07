const { Schema } = require('feathers-schema');
const { userSchemaProps } = require('./users.model');

export const operatorSchema = new Schema({
  ...userSchemaProps
});
