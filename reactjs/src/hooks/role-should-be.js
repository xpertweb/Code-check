const { BadRequest } = require('@feathersjs/errors')

const getRoles = hook => {
  if (hook.params && hook.params.user && hook.params.user.roles)
    return hook.params.user.roles;
  return []
};

const roleExists = (allowedRoles, currentUserRoles) => {
  let ret = false
  for (const role of allowedRoles){
    if (currentUserRoles.includes(role)) {
      ret = true;
      break;
    }
  }
  return ret;
}

module.exports = function() {
  const roles = arguments;
  return function(hook){
    if (roleExists(roles, getRoles(hook))) {
      return Promise.resolve(hook);
    }

    const error = 'You don\'t have the permission to make this request.'
    const errorObj = {errors: {error: error}}
    return Promise.reject(new BadRequest(error, errorObj))
  }
}
