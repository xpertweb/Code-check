const chai = require('chai');
const expect = chai.expect;
const serializeGeopoint = require('../../src/hooks/serialize-geopoint');

describe('\'serializeGeopoint\' hook', () => {
  const opts = {
    geopointField: 'geopoint',
    serializedField: 'geopoint'
  };

  it('correctly serializes a geopoint for knex-pgsql', () => {
    const mock = {
      method: 'create',
      type: 'before',
      data: {
        geopoint: {
          lat: -37.813571,
          lng: 144.973423
        }
      }
    };

    const hook = serializeGeopoint(opts);

    return hook(mock).then(result => {
      expect(result.data.geopoint).to.equal('(144.973423,-37.813571)');
    });
  });

  it('excludes serialize _computed field from result', () => {
    const mock = {
      method: 'create',
      type: 'before',
      data: {
        geopoint: {
          lat: -37.813571,
          lng: 144.973423
        }
      }
    };

    const hook = serializeGeopoint(opts);

    return hook(mock).then(result => {
      expect(result.data._computed).to.be.undefined;
    });
  });
});
