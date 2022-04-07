const { Schema } = require('feathers-schema');

export const userSchemaProps = {
  email: { type: String, required: true, email: true, unique: true },
  password: { type: String, required: true, length: { min: 2, max: 100 } },
  firstName: { type: String, required: true, length: { min: 1, max: 100 } },
  lastName: { type: String, required: true, length: { min: 1, max: 100 } },
  phoneNumber: { type: String, required: true, length: { min: 6, max: 15 } }
};

export const userSchema = new Schema(userSchemaProps);
