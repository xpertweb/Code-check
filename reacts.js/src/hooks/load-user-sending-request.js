

const ROLES_ENUM = require('../helpers/enum/roles-enum');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async function (hook) {
    if (hook.params.user) { // if user its not yet logged in this is undefined
      const { roles, id } = hook.params.user;
      let foundUser;
      switch (roles[0]) {
      case ROLES_ENUM.OPERATORS:
        foundUser = await hook.app.service('operators').get({ id });
        break;
      case ROLES_ENUM.CLIENTS:
        foundUser = await hook.app.service('clients').get({ id });
        break;
      case ROLES_ENUM.BUTLERS: { // required for lexical declaration in case block
        foundUser = await hook.app.service('butlers').get({ id });
        const foundAddress = await hook.app.service('butlerAddresses').find({ query: { butlerId: id } });
        foundUser.address = foundAddress[0];
        foundUser.isButler = true;
        break;
      }
      default:
        break;
      }
      if (foundUser) {
        hook.params.fullUserDetails = foundUser;
      }
    }
    return hook;
  };
};
