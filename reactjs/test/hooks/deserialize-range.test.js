const chai = require('chai');
const expect = chai.expect;
const deserializeRange = require('../../src/hooks/deserialize-range');

describe('\'deserializeRange\' hook', () => {
  const opts = {
    lowerBoundField: 'from',
    upperBoundField: 'to',
    serializedField: 'range'
  };

  it('correctly deserializes a range', () => {
    const mock = {
      method: 'get',
      type: 'after',
      result: {
        range: '[a,b)'
      }
    };

    const hook = deserializeRange(opts);

    return hook(mock).then(result => {
      expect(result.result.from).to.equal('a');
      expect(result.result.to).to.equal('b');
    });
  });

  it('excludes serialize _computed field from result', () => {
    const mock = {
      method: 'get',
      type: 'after',
      result: {
        range: '[a,b)'
      }
    };

    const hook = deserializeRange(opts);

    return hook(mock).then(result => {
      expect(result.result._computed).to.be.undefined;
    });
  });

  it('correctly deserializes a range with no lower bound', () => {
    const mock = {
      method: 'get',
      type: 'after',
      result: {
        range: '[,b)'
      }
    };

    const hook = deserializeRange(opts);

    return hook(mock).then(result => {
      expect(result.result.from).to.be.undefined;
      expect(result.result.to).to.equal('b');
    });
  });

  it('correctly deserializes a range with no upper bound', () => {
    const mock = {
      method: 'get',
      type: 'after',
      result: {
        range: '[a,)'
      }
    };

    const hook = deserializeRange(opts);

    return hook(mock).then(result => {
      expect(result.result.from).to.equal('a');
      expect(result.result.to).to.be.undefined;
    });
  });
});
