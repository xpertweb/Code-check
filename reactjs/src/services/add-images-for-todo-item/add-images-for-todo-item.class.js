class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }

  async create(data) {
    //const clientToDoItem = await this.app.service('clientToDoItems').get(data.clientToDoItemId);
    for(let uri of data.images) {
      
      //uri = 
      const blob = {
        uri: uri
      };
      const result = await this.app.service('fileUploader').create(blob);
      await this.app.service('clientToDoItemPictures').create({
        clientToDoItemId : data.clientToDoItemId,
        imageUrl: `${process.env.AWS_S3_URL}/${process.env.AWS_IMAGES_S3_BUCKET}/${result.id}`
      });
    }
    
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;


