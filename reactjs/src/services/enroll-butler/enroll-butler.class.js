import axios from 'axios';

const butlerEnrolledSuccessTemplate = require('../../mail-templates/butler-enrolled-success-template');
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
      butlerId
    } = data;
    
    await this.knex('butlers').where('id', butlerId).update({
      verified: true,
      onFreeze: false
    }); 

    const fullButler = (await this.app.service('butlers').get(butlerId));
    

    await axios({
      method: 'post',
      baseURL: process.env.COMMS_URL,
      url: `/send-email`,
      data:{
        message: butlerEnrolledSuccessTemplate.replace('@butler_name@',fullButler.firstName),
        email: (process.env.NODE_ENV === 'development' ? 'test@getjarvis.com.au' : fullButler.email),
        phoneNumber: fullButler.phoneNumber,
        ticketStatus: 'pending',
        requesterId : '114329911454', // admin id
        author: 'Comms Platform',
        messageType: 'butler_enrollment_success'
      },
      headers: {
        authorization: params.headers.authorization
      }
    });

    return {result: 'Success'};
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;


