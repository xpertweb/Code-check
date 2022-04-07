const { hashPassword } = require('@feathersjs/authentication-local').hooks;

// Wraps hash password to allow for override during integration tests (avoids slow bcrypt)

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  // if (process.env.NODE_ENV === 'development') {
  //   return hashPassword({ hash: (p) => Promise.resolve(p) }); // No hashing
  // }
  return hashPassword();
};
