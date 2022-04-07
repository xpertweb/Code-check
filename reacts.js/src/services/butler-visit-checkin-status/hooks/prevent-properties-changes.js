
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async function (hook) {


    if (hook.data.id){
      //these properties cannot and should not be updated via API requests
      delete hook.data.dateTimeCheckinCreated;
      delete hook.data.scheduleModifiedAndCheckinNeedsToBeDoneAgain;
      delete hook.data.checkinCancelledAfterHavingBeenConfirmed;

    }
    
    return hook;
  };
};
