const axios = require('axios');
const { BadRequest } = require('@feathersjs/errors')
const util = require('../../helpers/util')
const logger = require('winston');


class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }

  async find(data, params) {
    const {roles, id} = data.user;
    const query = await this.knex
      .select(
        'ber.*',
        'butlers.firstName as butlerFirstName',
        'butlers.lastName as butlerLastName',
        'butlers.email as butlerEmail',
        'butlers.phoneNumber as butlerPhoneNumber',
        'butlers.dateTimeCreated as butlerDateTimeCreated',
        'butlers.rating as rating',
        'butlers.activeClients as activeClients',
        'butlers.onFreeze as onFreeze',
        'butlers.verified as verified',
        'addr.line1 as line1',
        'addr.line2 as line2',
        'addr.postcode as postcode',
        'addr.country as country',
        'addr.geopoint as geopoint',
        'addr.activeFrom as activeFrom',
        'addr.locale as locale',
        'addr.state as state',
        'bes.mask as maskInStock',
        'bes.glove as gloveInStock',
        'bes.disinfectant as disinfectantInStock',
        'firstServiceButlers.activeFrom as tenure'
      )
      .from('butlerEquipmentRequests as ber')
      .leftJoin('butlerEquipmentStock as bes', 'bes.butlerId', 'ber.butlerId')
      .leftJoin('butlers', 'butlers.id', 'ber.butlerId')
      .leftJoin('butlerAddresses as addr', 'addr.id', 'ber.butlerAddressId')
      .leftJoin(this.firstServiceButlers(), 'ber.butlerId', 'firstServiceButlers.butlerId');


    if (roles.includes('butler')){
      query.where('butlerId', id);
    }

    const results = await query;
    return {results};
  }

  firstServiceButlers(){
    const query = this.knex('serviceButlers')
      .select('butlerId', this.knex.raw('min("activeFrom") as "activeFrom"'))
      .groupBy('butlerId')
      .toString();

    return this.knex.raw(`(${query}) as "firstServiceButlers"`);
  }

  async countButler(butlerId){
    const butler = await this.knex('butlers')
      .where('id', butlerId)
      .count();
    return util.castInt(butler[0].count);
  }

  async _operatorCreateRequest(data, params, entry){
    const { butlerAddressId, butlerId, type} = data;
    if (type === 'bought'){
      const err = 'operator cannot create bought request.';
      return Promise.reject(new BadRequest(err, {errors: {error:err}}));
    }

    const { user } = params;
    if (!user.roles.includes('operator')){
      const err = 'only operator can perform this action.';
      return Promise.reject(new BadRequest('invalid token', {errors: {error: err}}));
    }

    // validate butler
    const count = await this.countButler(butlerId);
    if (count === 0){
      return Promise.reject(util.endpointError({butlerId:'invalid value'}));
    }

    // insert data
    await this.knex('butlerEquipmentRequests').insert({...entry,
      butlerAddressId: butlerAddressId,
      butlerId: butlerId, // use butler id from request
      requestMadeBy:'operator'
    });

    return {result: 'success'};
  }

  async _handleButlerBoughtRequest(data, params, entry){
    const {AWS_S3_URL, AWS_IMAGES_S3_BUCKET} = process.env;

    const result = await this.app.service('fileUploader').create({uri: data.receipt});
    const _receipt = `${AWS_S3_URL}/${AWS_IMAGES_S3_BUCKET}/${result.id}`;
    if (!result.id){
      return Promise.reject(util.endpointError({receipt:'unable to upload image'}));
    }

    await this.knex('butlerEquipmentRequests').insert({...entry,
      receipt: _receipt
    });

    return {result: 'success'};
  }

  async _handleButlerRequest(data, params, entry){
    const {butlerAddressId} = data;
    await this.knex('butlerEquipmentRequests').insert({...entry,
      butlerAddressId: butlerAddressId,
    });

    return {result: 'success'};
  }

  async create(data, params){
    const entry = {
      createdAt: util.dateTime(),
      status: 'new',
      maskQuantity: Math.abs(data.maskQuantity),
      gloveQuantity: Math.abs(data.gloveQuantity),
      disinfectantQuantity: Math.abs(data.disinfectantQuantity),
      butlerId: params.user.id
    };

    if (data.requestMadeBy === 'operator'){
      return await this._operatorCreateRequest(data, params, {...entry, type:'request'});
    }

    if (data.type === 'bought'){
      return await this._handleButlerBoughtRequest(data, params, {...entry, type:'bought'});
    }

    return await this._handleButlerRequest(data, params, {...entry, type:'request'});
  }

  async patch(id, data, params){
    const record = await this.knex('butlerEquipmentRequests').where('id', id).first();
    if (!record || util.isEmptyObj(record)){
      return Promise.reject(util.endpointError({id:'invalid value'}));
    }

    if (record.status !== 'new'){
      return Promise.reject(util.endpointError({status:'status is already updated'}));
    }

    if (['rejected', 'approved'].includes(data.status) === false){
      return Promise.reject(util.endpointError({status: 'invalid value'}));
    }

    const note = data.note ? String(data.note) : '';
    const defaults = {
      status: data.status,
      note: data.note,
      requestStatusChangedDate: util.currentDate()
    };

    if (data.status === 'approved'){
      const qty = this.getQuantityObj(data);
      await this.knex('butlerEquipmentRequests').where({id: id}).update({...defaults, ...qty});
      await this.updateBulterStock(id);
    }else{
      await this.knex('butlerEquipmentRequests').where({id: id}).update(defaults);
    }

    await this.sendEmail(id, params.headers.authorization);
    return {result: 'success'};
  }

  async updateBulterStock(requestId){
    const request = await this.knex('butlerEquipmentRequests')
      .where('id', requestId)
      .first();

    const {butlerId} = request;
    const [stock] = await this.knex('butlerEquipmentStock').where({butlerId}).count();

    if (stock.count > 0){
      // record exists update stock count
      const { maskQuantity, gloveQuantity, disinfectantQuantity } = request;
      const query = this.knex('butlerEquipmentStock').where({butlerId});
      await query.increment('mask', Math.abs(maskQuantity));
      await query.increment('glove', Math.abs(gloveQuantity));
      await query.increment('disinfectant', Math.abs(disinfectantQuantity));
    }else{
      // create stock record
      // read all approved requests
      const entries = await this.knex('butlerEquipmentRequests').where({
        butlerId: butlerId,
        status: 'approved',
        type: 'request'
      });

      const record = {
        butlerId: butlerId,
        mask: 0,
        glove: 0,
        disinfectant: 0
      };

      for (const entry of entries){
        record.mask += Math.abs(entry.maskQuantity);
        record.glove += Math.abs(entry.gloveQuantity);
        record.disinfectant += Math.abs(entry.disinfectantQuantity);
      }

      await this.knex('butlerEquipmentStock').insert(record);
    }
  }

  getQuantityObj(data){
    let update = {};
    if (data.maskQuantity){
      update.maskQuantity = Math.abs(data.maskQuantity);
    }
    if (data.gloveQuantity){
      update.gloveQuantity = Math.abs(data.gloveQuantity);
    }
    if (data.disinfectantQuantity){
      update.disinfectantQuantity = Math.abs(data.disinfectantQuantity);
    }
    return update;
  }


  async sendEmail(requstId, authorization) {
    const requestData = await this.knex('butlerEquipmentRequests').where('id', requstId).first();
    if (!requestData){
      return;
    }

    const butler = await this.app.service('butlers').get(requestData.butlerId);
    if (!butler){
      return;
    }

    const {firstName, phoneNumber, email} = butler;
    const status = requestData.status;

    let note = '';
    if (requestData.note){
      note = 'Note: ' + requestData.note;
    }

    const {COMMS_URL} = process.env;
    const message = util.readEmailTemplate('butler-equipment-request-template')
      .replace('@status@', status)
      .replace('@butler_name@', firstName)
      .replace('@note@', note);

    const payload = {
      method: 'post',
      baseURL: COMMS_URL,
      url: '/send-email',
      data:{
        message: message,
        email: (process.env.NODE_ENV === 'development' ? 'test@getjarvis.com.au' : email),
        phoneNumber: phoneNumber,
        ticketStatus: 'pending',
        requesterId : '114329911454',
        author: 'Comms Platform',
        messageType: 'equpment_request_update',
      },
      headers: {authorization}
    };

    try{
      await axios(payload).catch(e => logger.error(e.message));
    } catch(e){
      logger.error(e.message);
    }

  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;



