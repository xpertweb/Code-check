const { getItems, replaceItems } = require('feathers-hooks-common');
const DataObjectParser = require('dataobject-parser');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function parseFlatObjects (hook) {
    const objs = getItems(hook);
    const multiple = Array.isArray(objs);
    const parsedObjs = (multiple ? objs : [objs]).map(obj => {
      return DataObjectParser.transpose(obj).data();
    });

    replaceItems(hook, (multiple ? parsedObjs : parsedObjs[0]));

    return hook;
  };
};
