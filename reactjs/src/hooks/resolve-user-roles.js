const { getItems } = require('feathers-hooks-common');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function resolveUserRoles (hook) {
    const users = getItems(hook);
    const ops = (Array.isArray(users) ? users : [users]).map(user => {
      return Promise.all([
        hook.app.service('clients').find({ query: { id: user.id } }),
        hook.app.service('butlers').find({ query: { id: user.id } }),
        hook.app.service('operators').find({ query: { id: user.id } }),
      ]).then((results) => {
        user.roles = ['client', 'butler', 'operator'].filter((role, idx) => {
          return results[idx].length > 0;
        });
      });
    });

    return Promise.all(ops).then(() => {
      return Promise.resolve(hook);
    });
  };
};
