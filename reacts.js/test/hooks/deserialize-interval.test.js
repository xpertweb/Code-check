const chai = require('chai');
const expect = chai.expect;
const deserializeInterval = require('../../src/hooks/deserialize-interval');

describe('\'deserializeInterval\' hook', () => {
  const opts = {
    intervalField: 'duration',
    serializedField: 'duration'
  };

  it('correctly deserializes an interval with hours, minutes, seconds', () => {
    const mock = {
      method: 'get',
      type: 'after',
      result: {
        duration: {
          hours: 2,
          minutes: 30,
          seconds: 22
        }
      }
    };

    const hook = deserializeInterval(opts);

    const result = hook(mock);

    expect(result.result.duration).to.equal('02:30:22');
  });

  it('correctly deserializes an interval with missing hours, seconds', () => {
    const mock = {
      method: 'get',
      type: 'after',
      result: {
        duration: {
          minutes: 30
        }
      }
    };

    const hook = deserializeInterval(opts);

    const result = hook(mock);

    expect(result.result.duration).to.equal('00:30:00');
  });
});
