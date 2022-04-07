
const logger = require('winston');

class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }

  // eslint-disable-next-line no-unused-vars
  async create( data, params) { // this is the logic to grant visits

    const {
      butlerId,
      butlerCurriculumFile
    } = data;
    let uploadButlerResumeUrl;
    if (butlerCurriculumFile){
      const blob = {
        uri: butlerCurriculumFile
      };
      // update butlerCurriculumFiles
      uploadButlerResumeUrl = await this.app.service('fileUploader').create(blob);
    }
    let butlerIdToUpdate;

    if (params.user.roles.indexOf('butler') > -1){
      butlerIdToUpdate = params.user.id;
    } else if (params.user.roles.indexOf('operator') > -1){
      butlerIdToUpdate = butlerId;
    }

    let updatedButler;
    if (butlerIdToUpdate && uploadButlerResumeUrl){
      updatedButler = await this.app.service('butlers').patch(butlerIdToUpdate,{
        curriculumUrl: `${process.env.AWS_S3_URL}/${process.env.AWS_IMAGES_S3_BUCKET}/${uploadButlerResumeUrl.id}`
      });
      updatedButler.curriculumUrl = `${process.env.AWS_S3_URL}/${process.env.AWS_IMAGES_S3_BUCKET}/${uploadButlerResumeUrl.id}`;
    }

    return {value: updatedButler}
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;


