/* eslint-disable */

// Hacky proxy service for retrieving items from legacy server
// Should eventually be removed

const axios = require('axios');
const https = require('https');
const agent = new https.Agent({
  rejectUnauthorized: false
});

const getItemImageB64 = (username, itemId) => {
  const getImgBase64 = url => {
    return axios
      .get(url, {
        responseType: 'arraybuffer',
        httpsAgent: agent
      })
      .then(response => {
        const data = new Buffer(response.data, 'binary').toString('base64');
        return 'data:' + response.headers['content-type'] + ';base64, ' + data;
      })
      .catch(() => Promise.resolve(null));
  };

  const url = process.env.LEGACY_APP_URL
    + '/user/do/get_image_by_username?key=ZoZfip4Jnn&username='
    + (username || '')
    + '&item=' + itemId;

  return getImgBase64(url);
};

class Service {
  constructor (options) {
    this.options = options || {};
  }

  find (params) {
    if (!process.env.LEGACY_APP_URL) {
      throw new Error('Env not set correctly');
    }

    // List of items
    const url = process.env.LEGACY_APP_URL +
      '/user/do/items_by_username?key=ZoZfip4Jnn&username=' + (params.query.username || '');

    return axios.get(url, { httpsAgent: agent }).then(res => {
      if (res.status === 200) {
        if (res.data.success) {
          // Retrieve images in b64
          return Promise.all(res.data.items.map(item => {
            return getItemImageB64(params.query.username, item.id).then(imageData => {
              return Promise.resolve({
                ...item,
                image: imageData
              });
            });
          })).then(itemsWithImages => {
            return Promise.resolve({
              ...res.data,
              items: itemsWithImages
            });
          });
        } else {
          return Promise.resolve(res.data);
        }
      }
    });
  }

  get (id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    return Promise.resolve(data);
  }

  update (id, data, params) {
    return Promise.resolve(data);
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
    return Promise.resolve({ id });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
