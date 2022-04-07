module.exports = function (context) { // eslint-disable-line no-unused-vars
  return async function (hook) {

    if (hook.params.user && hook.params.user.roles[0] != 'operator'){
      //these properties cannot and should not be updated by a user other than operator
      delete hook.data.priorityCommunications;
    }
    
    return hook;
  };
};

