const { BadRequest } = require('@feathersjs/errors')
const _ = require('lodash');

const stockLimit = 100;
const getNum = (data, index) => Math.abs(_.get(data, index, 0));


async function getButlerId(hook, method){
  const knex = hook.app.get('knexClient');
  if (method === 'patch'){
    const record = await knex('butlerEquipmentRequests').where('id', hook.id).first();
    if (!record){
      return Promise.reject(new BadRequest(
        'invalid Equipment Requests id', 
        {errors: {error: 'invalid Equipment Requests id'}}
      ));
    }
    return record.butlerId;
  }

  if (hook.data.requestMadeBy === 'operator'){
    return hook.data.butlerId;
  }

  return hook.params.user.id;
}


function errorMsg(stock, index){
  if (stock >= stockLimit){
    return `You cannot request more ${index}.`;
  }
  return `You cannot request more than ${stockLimit - stock} ${index}.`;
}

async function limitReached(data, stock){
  const items = {
    mask: {
      stock: _.get(stock, 'mask', 0), 
      requested: getNum(data, 'maskQuantity')
    },
    glove: {
      stock: _.get(stock, 'glove', 0), 
      requested: getNum(data, 'gloveQuantity')
    },
    disinfectant: {
      stock: _.get(stock, 'disinfectant', 0), 
      requested: getNum(data, 'disinfectantQuantity')
    },
  };

  const ret = {};
  for (const [index, {stock, requested}] of Object.entries(items)){
    if (requested > 0 && (requested + stock) > stockLimit){
      ret[index] = errorMsg(stock, index);
    }
  }
  return ret;
}



module.exports =  function(method = ''){
  return async function(hook){
    if (hook.data.type === 'bought'){
      return Promise.resolve(hook);
    }

    const knex = hook.app.get('knexClient');
    const butlerId = await getButlerId(hook, method);
    const stock = await knex('butlerEquipmentStock').where('butlerId', butlerId).first();
    const errors = await limitReached(hook.data, stock);
    if (!_.isEmpty(errors)){
      return Promise.reject(new BadRequest('stock limit reached', {errors: errors}));
    }
    return Promise.resolve(hook);
  };
};
