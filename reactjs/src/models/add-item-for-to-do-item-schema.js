
const { Schema } = require('feathers-schema');

export const addImagesForToDoItemSchema = new Schema({
  images: [String],
  clientToDoItemId: { type: String, required:true},
});
