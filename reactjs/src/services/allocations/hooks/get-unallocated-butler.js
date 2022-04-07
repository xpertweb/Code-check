module.exports = function () {
  // eslint-disable-line no-unused-vars
  return async function getUnallocatedButler(hook) {
    const butlers = await hook.app
      .service('butlers')
      .find({
        query: {
          firstName: 'ALLOCATE'
        }
      });
    hook.params.butlerIds = butlers.map(b=>b.id);
    hook.params.filterVisitsBasedOnPreferences = true;
    return hook;
  };
};
