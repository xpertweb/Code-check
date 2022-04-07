var errors = require('feathers-errors');
module.exports = function (options = {}) {
    return async function servicesEntityModifier(hook) {
        try {
            if (hook.params.user) {
                const result = (await hook.app.service('operators').find({ query: { id: hook.params.user.id } }))[0];
                if (result) { // check if the modifier details is available
                    let modifierOperator;
                    const { firstName, lastName, email } = result;
                    modifierOperator = `${firstName || ''} ${lastName || ''}`.trim()
                    modifierOperator = modifierOperator === '' && email ? modifierOperator = email : modifierOperator = email ? modifierOperator + ` (${email})` : modifierOperator;
                    hook.data.lastModifiedBy = modifierOperator;
                    return Promise.resolve(hook);
                } else {
                    throw new errors.BadRequest('No Matching Operator(Modifier) Found in Our Record!');
                }
            } else {
                if(!hook.data.lastModifiedBy){hook.data.lastModifiedBy = 'N/A'}
                return Promise.resolve(hook);
            }
        } catch (error) {
            console.log('error in servicesEntityModifier : ', error)
            return Promise.resolve(hook);
        }

    };
};