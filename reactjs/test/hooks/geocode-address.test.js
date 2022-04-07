const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const feathers = require('@feathersjs/feathers');
const geocodeAddress = require('../../src/hooks/geocode-address');

describe('\'geocodeAddress\' hook', () => {
  let app;

  const opts = {
    addressFields: [
      'line1',
      'line2',
      'locale',
      'state',
      'country',
      'postcode'
    ],
    resultField: 'geopoint'
  };

  const correctResponse = {
    json: {
      results: [{
        geometry: {
          location: {
            lat: -37.813571,
            lng: 144.973423
          }
        }
      }]
    }
  };

  const noResultsResponse = {
    json: {
      results: []
    }
  };

  const gmapsMock = {
    geocode: (data) => {
      return {
        asPromise: () => {
          return new Promise((resolve) => {
            if (data.address === '1 Collins St,Melbourne,VIC,Australia,3000') {
              resolve(correctResponse);
            } else {
              resolve(noResultsResponse);
            }
          });
        }
      };
    }
  };

  beforeEach(() => {
    app = feathers()
      .set('gmaps', gmapsMock);
  });

  it('correctly calls google geocoding service and injects results', () => {
    const mock = {
      app: app,
      data: {
        line1: '1 Collins St',
        locale: 'Melbourne',
        state: 'VIC',
        country: 'Australia',
        postcode: '3000'
      }
    };

    const hook = geocodeAddress(opts);

    return hook(mock).then(result => {
      expect(result.data.geopoint.lat).to.equal(-37.813571);
      expect(result.data.geopoint.lng).to.equal(144.973423);
    });
  });

  it('throws error when address cannot be geocoded', () => {
    const mock = {
      app: app,
      data: {
        line1: 'Bad',
        locale: 'Addresses',
        state: 'Cause',
        country: 'Bad',
        postcode: 'Bugs'
      }
    };

    const hook = geocodeAddress(opts);

    expect(hook(mock)).to.be.rejected;
  });
});
