
const { BadRequest } = require('@feathersjs/errors');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function geocodeAddress (hook) {
    const { addressFields, resultField } = options;

    const address = addressFields
      .map(field => hook.data[field])
      .filter(field => field && field !== '')
      .join(',');

    return hook.app.get('gmaps').geocode({
      address: address
    }).asPromise().then(response => {
      if (response.json.results.length === 0) {
        return Promise.reject(new BadRequest('Invalid address data', {
          errors: {
            error: 'Address supplied could not be geocoded.'
          }
        }));
      }
      const point = response.json.results[0].geometry.location;

      hook.data[resultField] = point;

      return Promise.resolve(hook);
    });
  };
};
