module.exports = function (context) { // eslint-disable-line no-unused-vars
  return async function (hook) {
    // let's not update null value for these fields
    const shouldNotNull = ['isVerified', 'verifyToken', 'verifyShortToken', 'verifyExpires', 'verifyChanges', 'resetToken', 'resetShortToken', 'resetExpires']
    // const isExternal = hook.params.provider === 'rest'
    for (const data of Object.entries(hook.data)) {
      if (data[1] === null && shouldNotNull.includes(data[0])) {
        delete hook.data[data[0]]
      }
    }

    if (hook.params.user && hook.params.user.roles[0] != "operator") {
      //these properties cannot and should not be updated by a user other than operator
      delete hook.data.vacuumSuppliedByJarvis;
      delete hook.data.vacuumReturnedToJarvis;
      if(hook.params.user && hook.params.user.roles[0] != "butler") delete hook.data.doNotSendAllocationsNotifications;
      delete hook.data.doNotSendNotifications;
    }

    return hook;
  };
};
