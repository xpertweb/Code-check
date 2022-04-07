const blobService = require('feathers-blob');
const hooks = require('./file-uploader.hooks');
import {docs} from './file-uploader.docs';
const AWS = require('aws-sdk');
const S3BlobStore = require('s3-blob-store');

module.exports = function () {
  const app = this;

  const s3 = new AWS.S3({
    endpoint: process.env.AWS_S3_URL,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  
  const blobStore = S3BlobStore({
    client: s3,
    bucket: process.env.AWS_IMAGES_S3_BUCKET
  });

  let service = blobService({Model: blobStore});
  service.docs = docs;
  app.use('/fileUploader',service);

  // Get our initialized service so that we can register hooks and filters
  const processedService = app.service('fileUploader');

  processedService.hooks(hooks);
};
