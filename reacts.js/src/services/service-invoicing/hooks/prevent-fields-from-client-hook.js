module.exports = function (options = {}) { 
  return function preventFieldsFromClient (hook) {
    if(hook.params.user.roles[0] == 'client'){
      delete hook.data.serviceId;
      delete hook.data.frequency;
      delete hook.data.paymentMethod;
      delete hook.data.requiresTaxInvoice;
      delete hook.data.description;
    }
    return hook;
  };
};
