const calculateScoresForButler = require('../../helpers/calculate-scores-for-butler');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }

  async find(params) {
    const { query } = params;

    const { fullUserDetails } = params;
    let result = {};

    if (fullUserDetails && fullUserDetails.isButler) {
      result.rating = fullUserDetails.rating;

      const feedbackSettings = (await this.app.service('feedbackSettings').find())[0];
      const allFeedback = await this.app.service('serviceFeedback').find({
        query: {
          butlerId: fullUserDetails.id,
          creationDate : {
            $gte : query.creationDate
          }
        }
      });
      if (allFeedback.length > 0) {
        result.rating = calculateScoresForButler(feedbackSettings, allFeedback);
      }
    }
    return Promise.resolve(result);
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;


