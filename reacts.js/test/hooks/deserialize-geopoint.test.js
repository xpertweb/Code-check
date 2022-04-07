const chai = require('chai');
const expect = chai.expect;
const deserializeGeopoint = require('../../src/hooks/deserialize-geopoint');

describe('\'deserializeGeopoint\' hook', () => {
  const opts = {
    geopointField: 'geopoint',
    serializedField: 'geopoint'
  };

  it('correctly deserializes a geopoint from knex-pgsql', () => {
    const mock = {
      method: 'get',
      type: 'after',
      result: {
        geopoint: {
          x: 144.973423,
          y: -37.813571
        }
      }
    };

    const hook = deserializeGeopoint(opts);

    return hook(mock).then(result => {
      expect(result.result.geopoint).to.deep.equal({
        lat: -37.813571,
        lng: 144.973423
      });
    });
  });

  it('excludes serialize _computed field from result', () => {
    const mock = {
      method: 'get',
      type: 'after',
      result: {
        geopoint: {
          x: 144.973423,
          y: -37.813571
        }
      }
    };

    const hook = deserializeGeopoint(opts);

    return hook(mock).then(result => {
      expect(result.result._computed).to.be.undefined;
    });
  });
});
