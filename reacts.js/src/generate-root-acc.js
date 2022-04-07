module.exports = function(app) {
  const query = {
    email: process.env.ROOT_EMAIL
  };
  return app.service('operators').find({ query: query }).then(r => {

    if (r.length === 0) { // Only create if acc doesn't already exist
      return app.service('operators').create({
        firstName: 'Root',
        lastName: '-',
        email: process.env.ROOT_EMAIL,
        password: process.env.ROOT_PASSWORD,
        phoneNumber: '----------',
      });
    }
  });
};
