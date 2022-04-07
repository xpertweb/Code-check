
const { serialize, discard } = require('feathers-hooks-common');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function deserializeInterval (hook) {
    const { intervalField, serializedField } = options;

    const padOneLeading = (num) => {
      if (!num) return '00';
      if (num < 10) {
        return '0' + num;
      }
      return '' + num;
    };

    const doSerialize = serialize({
      computed: {
        [intervalField]: (item) => {
          return padOneLeading(item[serializedField].hours) + ':' +
            padOneLeading(item[serializedField].minutes) + ':' +
            padOneLeading(item[serializedField].seconds);
        }
      },
      exclude: [serializedField]
    });

    return discard('_computed')(doSerialize(hook));
  };
};
