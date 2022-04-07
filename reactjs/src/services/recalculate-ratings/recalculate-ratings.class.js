const calculateRatingForButler = require('../../helpers/calculate-scores-for-butler');
const _ = require('lodash');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }

  create() {
    return this.syncRatings();
  }

  patch(id) {
    return this.syncRatings([id]);
  }

  async syncRatings(butlerIds){
    const feedbackSettings = _.first(await this.app.service('feedbackSettings').find());
    const butlers = await this.getButlers(butlerIds);

    const records = butlers.map(record => ({
      id: _.get(record, 'row.id'),
      rating: this.getRating(feedbackSettings, _.get(record, 'row.scores'))
    }));

    // return records;

    await this.bulkUpdate(records);
    return {length: records.length};
  }

  async getButlers(butlerIds){
    const select = `
      json_build_object(
        'id', butlers.id,
        'scores', json_agg(json_build_object('score', "serviceFeedback".score))
      ) as row
    `;

    const query = this.knex.select(this.knex.raw(select))
      .from('butlers')
      .leftJoin('serviceFeedback', 'serviceFeedback.butlerId', this.knex.raw('butlers.id'))
      // .whereNot('serviceFeedback.score', null)
      .groupBy('butlers.id');

    if (Array.isArray(butlerIds)){
      query.whereIn('butlers.id', butlerIds);
    }

    return await query;
  }

  getRating(feedbackSettings, _scores){
    const scores = _scores.filter(s => s.score !== null);
    if (scores.length > 0){
      const rating = calculateRatingForButler(feedbackSettings, scores);
      if (!isNaN(rating)){
        return rating;
      }
    }

    return feedbackSettings.butlerDefaultRatingToSet;
  }

  async bulkUpdate(records){
    if (records.length === 0){
      return;
    }

    return await this.knex.raw(`
      UPDATE butlers set
        "rating" = (json_data ->> 'rating')::numeric
      from json_array_elements('${JSON.stringify(records)}') json_data
      where butlers.id = (json_data ->> 'id')::uuid;
    `);
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;


