
const { serialize, discard } = require('feathers-hooks-common');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function serializeGeopoint (hook) {
    const { geopointField, serializedField } = options;

    const doSerialize = serialize({
      computed: {
        [serializedField]: (item) => {
          const lat = item[geopointField].lat;
          const lng = item[geopointField].lng;
          return `(${lng},${lat})`;
        }
      },
      exclude: [geopointField]
    });

    return Promise.resolve(discard('_computed')(doSerialize(hook)));
  };
};
