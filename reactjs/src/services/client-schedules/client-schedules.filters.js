/* eslint no-console: 1 */

module.exports = function (data, connection, hook) { // eslint-disable-line no-unused-vars
  if (data.dateTimeRequestCreated) { //we expect isostring new Date().toISOString()
    data.dateTimeRequestCreated = data.slice(0, 19).replace('T', ' ');
  }
  if (data.dateTimeRequestProcessed) { //we expect isostring new Date().toISOString()
    data.dateTimeRequestProcessed = data.slice(0, 19).replace('T', ' ');
  }
  return data;
};
