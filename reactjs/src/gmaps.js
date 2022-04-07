module.exports = function () {
  const app = this;
  const { key } = app.get('gmaps');
  let googleMapsClient;
  // if (process.env.NODE_ENV === 'production') {
    // Only use actual gmaps client in production
    googleMapsClient = require('@google/maps').createClient({
      key: key,
      Promise: Promise
    });
  // } else {
  //   // Mock client
  //   googleMapsClient = {
  //     geocode: () => {
  //       return {
  //         asPromise: () => {
  //           return Promise.resolve({
  //             json: {
  //               results: [{
  //                 geometry: {
  //                   location: {
  //                     lat: 0.0,
  //                     lng: 0.0
  //                   }
  //                 }
  //               }]
  //             }
  //           });
  //         }
  //       };
  //     }
  //   };
  // }
  app.set('gmaps', googleMapsClient);
};
