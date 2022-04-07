var qs = require('qs');

module.exports = function (str) {
  return qs.parse(str, {
    arrayLimit: 10000000 //1 millon limit on $in
  });
};
