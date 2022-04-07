const { Schema } = require('feathers-schema');
const { ruuid } = require('./validators/regex');

export const clientToDoPicturesSchema = new Schema({
  imageUrl: { type: String, required: true, format: [ruuid, 'Image url must be a string'] },
  clientToDoItemId: { type: String, required: true, format: [ruuid, 'ClientTodoItem id must be uuid'] },
}); 
