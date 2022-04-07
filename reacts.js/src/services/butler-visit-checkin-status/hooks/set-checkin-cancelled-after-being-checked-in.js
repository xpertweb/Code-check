


module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async function (hook) {

    if (hook.data.id){
      const dbData = await hook.app.service('butlerVisitCheckinStatus').get(hook.data.id);
      if (dbData.butlerConfirmsCannotAttendVisit && hook.data.butlerConfirmsCanAttendVisit) { // if user its not yet logged in this is undefined
        hook.data.checkinConfirmedAfterHavingBeenCancelled = true;
      } else if (dbData.butlerConfirmsCanAttendVisit && hook.data.butlerConfirmsCannotAttendVisit) { // if user its not yet logged in this is undefined
        hook.data.checkinCancelledAfterHavingBeenConfirmed = true;
      }
    }
    
    return hook;
  };
};
