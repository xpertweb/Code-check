
const { serialize, discard } = require('feathers-hooks-common');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function deserializeGeopoint (hook) {
    const { geopointField, serializedField } = options;
    
    const doSerialize = serialize({
      computed: {
        [geopointField]: (item) => {
          return {
            lat: item[serializedField].y,
            lng: item[serializedField].x
          };
        }
      },
      exclude: [serializedField]
    });

    return Promise.resolve(discard('_computed')(doSerialize(hook)));
  };
};
