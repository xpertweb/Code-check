const _ = require('lodash');
const winston = require('winston');

let mailgun = {};
try{
  mailgun = require("mailgun-js")({
    apiKey: process.env.MAILGUN_API_KEY || 'secret-key',
    domain: process.env.MAILGUN_DOMAIN || 'getjarvis.com.au',
  });
}catch(e){
  winston.error(e);
}

class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }

  async find(data, params) {
    // "generic_email"
    // "butler_enrollment_success"
    // "butler_schedule_modified_notification"


    const tags = [
      'allocations',
      'allocations_2',
      'allocations_4',
      'lead_welcome_email',
      'lead_allocation_email',
      'butler_notifications',
      'client_notifications',
      'not_enrolled_allocations',
      'not_enrolled_allocations_2',
      'not_enrolled_allocations_4',
      'fvconfirm',
      'feedback',
      'jarvis_feedback'
    ];


    const requests = tags.map(this.stats).map(p => p.catch(_.identity));
    const responses = await Promise.all(requests);

    return responses
      .filter(result => !(result instanceof Error))
      .map(this.normalizeStats);
  }


  stats(tag){
    return mailgun.get(`/${process.env.MAILGUN_DOMAIN}/tags/${tag}/stats`, {
      event: ['accepted']
    });
  }

  normalizeStats(response){
    return {
      tag: _.get(response, 'tag'),
      stats: _.reverse(_.get(response, 'stats'))
    };
  }


  async get(email, params){
    const events = ['delivered', 'rejected', 'failed'];
    const requests = events.map(event => {
      return mailgun.get(`/${process.env.MAILGUN_DOMAIN}/events`, {event, to: email});
    }).map(p => p.catch(_.identity));

    const responses = (await Promise.all(requests))
      .filter(result => !(result instanceof Error));

    const ret = {};
    for (const response of responses) {
      for (const item of _.get(response, 'items', [])) {
        const [ , date, tag] = item.tags;
        const message = _.get(item, 'user-variables.message');
        const status = _.get(item, 'event');
        if (date){
          if (ret[date]){
            ret[date].push({tag, message, status});
          }else{
            ret[date] = [{tag, message, status}];
          }
        }
      }
    }
    return ret;
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;



