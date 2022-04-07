/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }

  find (params) {
    const knex = this.knex;

    const startDate = params.query.startDate || new Date();
    const endDate = params.query.endDate || new Date();


    let query = this.knex
      .with('unfilteredWorkDays', function() {
        this
          .distinct(knex.raw('on ("workBlocks"."id", "rc"."date") "rc"."date" as "date"'))
          .from('workBlocks')
          .select([
            'workBlocks.butlerId as butlerId',
            'workBlocks.id as workBlockId',
            'workBlocks.timeWindow as timeWindow',
            'butlerAddresses.id as butlerAddressId',
            'butlerAddresses.geopoint as butlerAddressGeopoint'
          ])
          .joinRaw(`cross join lateral (
              select * from generate_recurrences(
                'w',
                lower("workBlocks"."dateRange"),
                least(upper("workBlocks"."dateRange"), ?)
              ) as "date"
            ) as "rc"
            `, endDate)
          .leftJoin('butlerAddresses', 'butlerAddresses.butlerId', 'workBlocks.butlerId')
          .where('rc.date', '>=', startDate)
          .andWhere('butlerAddresses.activeFrom', '<=', knex.raw('rc.date'))
          .orderBy('workBlocks.id', 'asc')
          .orderBy('rc.date', 'asc')
          .orderBy('butlerAddresses.activeFrom', 'desc');
      })
      .select('*')
      .from('unfilteredWorkDays');

    if (params.query.butlerId) {
      if (params.query.butlerId.$in){
        query.whereIn('butlerId', params.query.butlerId.$in);
      }
      else {
        query.andWhere('butlerId', '=', params.query.butlerId);
      }
    }

    return query.then(result => {

      return Promise.resolve(result);
    });
  }

  get (id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    return Promise.resolve(data);
  }

  update (id, data, params) {
    return Promise.resolve(data);
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
    return Promise.resolve({ id });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
