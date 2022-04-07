const { combine, populate, serialize } = require('feathers-hooks-common');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function populateCurrentTemporalRef (hook) {

      console.log('populating query ')

    const populateOpts = {
      schema: {
        include: {
          service: options.refService,
          nameAs: options.nameAs,
          parentField: 'id',
          childField: options.refServiceIdField,
          provider: undefined,
          query: {
            $limit: 1,
            $sort: {[options.temporalField]: -1},
            activeFrom: {
              $lte: options.now()
            }
          },
          useInnerPopulate: true
        }
      }
    };

    const normalize = o => options.normalize ? options.normalize(o) : o;

    const serializeOpts = {
      computed: {
        [options.nameAs]: (o) => o[options.nameAs] ? normalize(o[options.nameAs]) : null
      }
    };

    const populateHook = populate(populateOpts);
    const serializeHook = serialize(serializeOpts);

    return combine(populateHook, serializeHook).call(this, hook);
  };
};
