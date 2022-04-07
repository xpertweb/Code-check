const { queryWithCurrentUser } = require('feathers-authentication-hooks');
const errors = require('@feathersjs/errors');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function restrictOnForeignId (hook) {
    const { exemptRoles, foreignField, secondForeignField } = options;

    if (!hook.params.provider) {
      return hook;
    }

    if (!hook.params.user) {
      throw new errors.NotAuthenticated('The current user is missing. You must not be authenticated.');
    }

    // Exempt roles first
    if (hook.params.user.roles) {
      const exempt = (hook.params.user.roles.some((role) => {
        return exemptRoles.indexOf(role) !== -1;
      }));
      if (exempt) {
        return hook;
      }
    }

    if (hook.method === 'find' || hook.id === null) {
      let foreignFieldToQuery = foreignField;

      if (hook.params.user.roles && hook.params.user.roles.indexOf('client') > -1 && secondForeignField && secondForeignField.indexOf('client') > -1){
        foreignFieldToQuery = secondForeignField;
      } else if (hook.params.user.roles && hook.params.user.roles.indexOf('butler') > -1 && secondForeignField && secondForeignField.indexOf('butler') > -1){
        foreignFieldToQuery = secondForeignField;
      }
      return queryWithCurrentUser({
        idField: 'id',
        as: foreignFieldToQuery
      })(hook);
    }

    if (['create', 'update', 'patch'].indexOf(hook.method) !== -1) {
      if (hook.data[foreignField] && hook.params.user.id !== hook.data[foreignField]) {
        return Promise.reject(
          new errors.Forbidden(`You cannot set '${foreignField}' to a non-owned ref.`)
        ); 
      }
    }

    if (['get', 'update', 'patch', 'remove'].indexOf(hook.method) !== -1) {
      return hook.service.get(hook.id).then((result) => {
        if (result[foreignField] !== hook.params.user.id) {
          return Promise.reject(
            new errors.Forbidden(`You cannot set '${foreignField}' on a non-owned object.`)
          );
        } else {
          return Promise.resolve(hook);
        }
      });
    }
  };
};
