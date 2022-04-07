const _ = require('lodash');
const axios = require('axios');

// const get = (x, y, _default='') => _.get(x, y, _default);

const defaults = {
  ticketStatus: 'pending',
  requesterId: '114329911454',
  author: 'Backend Core',
};

/**
 * use test value of we are not on production
 * */
function protect(email){
  if (process.env.NODE_ENV === 'development'){
    return 'test@getjarvis.com.au';
  }

  return email;
}

/**
 * sendEmail(authorization, {
 *   email: email,
 *   phoneNumber: phoneNumber,
 *   message: '',
 *   messageType: '',
 * });
 */
async function sendEmail(authorization, _data){
  _data.email = protect(_data.email);
  const data = {
    ...defaults,
    ..._data,
  };

  try {
    await axios({
      method: 'post',
      baseURL: process.env.COMMS_URL,
      url: '/send-email',
      data: data,
      headers: { authorization }
    });
  } catch (e) {
    console.log('Unable to send email', {
      error: e.message,
      email: data.email,
    });
  }

  return Promise.resolve();
}


/**
 * sendSMS(authorization, {
 *   email: email,
 *   phoneNumber: phoneNumber,
 *   message: '',
 * });
 */
async function sendSMS(authorization, _data){
  if (_data.email){
    _data.email = protect(_data.email);
  }

  const data = {
    ...defaults,
    ..._data
  };

  try {
    await axios({
      method: 'post',
      baseURL: process.env.COMMS_URL,
      url: '/send-sms',
      data: data,
      headers: { authorization }
    });
  } catch (e) {
    console.log('Unable to send sms', {
      error: e.message,
      phoneNumber: data.phoneNumber,
    });
  }

  return Promise.resolve();
}

module.exports = {
  sendSMS,
  sendEmail
};
