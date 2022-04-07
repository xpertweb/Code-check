
const axios = require('axios');
const crypto = require('crypto');
const bizSdk = require('facebook-nodejs-business-sdk');
const ServerEvent = bizSdk.ServerEvent;
const EventRequest = bizSdk.EventRequest;
const UserData = bizSdk.UserData;

const access_token = process.env.FACEBOOK_PIXEL_API_TOKEN;
const pixel_id = process.env.FACEBOOK_PIXEL_ID;

const sendLeads = async (leadEmail)=>{
  let current_timestamp = Math.floor(new Date() / 1000);

  // const userData = new UserData(leadEmail);
  // const serverEvent = new ServerEvent('Lead',current_timestamp,userData);
  // const eventsData = [serverEvent];
  // const eventRequest = new EventRequest('','',access_token,pixel_id);
  // eventRequest._events = eventsData;
  // eventRequest.execute();


  const hashedEmail = crypto.createHash('sha256').update(leadEmail).digest('hex')
  const result = await axios({
    method: 'POST',
    baseURL: `https://graph.facebook.com`,
    url: `/v5.0/${pixel_id}/events`,
    data:  {
      access_token:access_token,
      data : [{
        "event_name": "Subscribe",
        "event_time": current_timestamp,
        "user_data": {
          "em": hashedEmail
        }
      }]
    }
  }
  )
}
module.exports = {
  sendLeads
};

