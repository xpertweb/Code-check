const { BadRequest } = require('@feathersjs/errors');

module.exports = function (options = {}) {
    return async function (hook) {
        if (hook.params.user) {
            const { butlerId, feedbackId } = hook.data
            const knex = hook.app.get('knexClient')
            const appealCheck = await knex('butlerFeedbackAppeals').where({ 'feedbackId': feedbackId, 'butlerId': butlerId })
            if (appealCheck.length > 0) {
                return Promise.reject(new BadRequest('You cannot appeal the same  feedback more than once'))
            }
        }
        return Promise.resolve(hook)
    }
}