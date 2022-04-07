module.exports = function () {
  return async function onlyPublicFeedbackForButler(hook) {
    if (hook.params && hook.params.query && hook.params.query.butlerId) {
      hook.params.query.doNotShareFeedbackWithButler = false;
    }
    return hook;
  };
};

