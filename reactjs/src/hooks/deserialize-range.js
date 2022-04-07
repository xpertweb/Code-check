
const { serialize, discard } = require('feathers-hooks-common');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function deserializeRange (hook) {
    const { lowerBoundField, upperBoundField, serializedField } = options;

    const doSerialize = serialize({
      computed: {
        [lowerBoundField]: (item) => {
          if (!item[serializedField]) {
            return undefined;
          }
          const fst = item[serializedField].split(',')[0].substring(1);
          return fst === '' ? undefined : fst;
        },
        [upperBoundField]: (item) => {
          if (!item[serializedField]) {
            return undefined;
          }
          const snd = item[serializedField].split(',')[1].slice(0, -1);
          return snd === '' ? undefined : snd;
        }
      },
      exclude: [serializedField]
    });

    return Promise.resolve(discard('_computed')(doSerialize(hook)));
  };
};
