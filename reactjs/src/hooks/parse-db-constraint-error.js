
const { BadRequest } = require('@feathersjs/errors');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function parseDbConstraintError (hook) {
    if (!hook.error || !hook.error.constraint) {
      return hook;
    }

    const errorParseRules = Array.isArray(options) ? options : [options];
    let errors = {};
    errorParseRules.forEach(parseRule => {
      if (hook.error.constraint === parseRule.constraint) {
        parseRule.fieldName
          ? errors[parseRule.fieldName] = parseRule.message
          : errors['error'] = parseRule.message;
      }
    });

    hook.error = new BadRequest('Constraint error', {
      errors: errors
    });
    return hook;
  };
};
