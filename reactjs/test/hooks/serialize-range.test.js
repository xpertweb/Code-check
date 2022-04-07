const chai = require('chai');
const expect = chai.expect;
const serializeRange = require('../../src/hooks/serialize-range');

describe('\'serializeRange\' hook', () => {
  const opts = {
    lowerBoundField: 'from',
    upperBoundField: 'to',
    serializedField: 'range'
  };

  it('correctly serializes a range', () => {
    const mock = {
      method: 'create',
      type: 'before',
      data: {
        from: 'a',
        to: 'b'
      }
    };

    const hook = serializeRange(opts);

    return hook(mock).then(result => {
      expect(result.data.range).to.equal('[a,b)');
    });
  });

  it('excludes serialize _computed field from result', () => {
    const mock = {
      method: 'create',
      type: 'before',
      data: {
        from: 'a',
        to: 'b'
      }
    };

    const hook = serializeRange(opts);

    return hook(mock).then(result => {
      expect(result.data._computed).to.be.undefined;
    });
  });

  it('correctly serializes a range with no lower bound', () => {
    const mock = {
      method: 'create',
      type: 'before',
      data: {
        to: 'b'
      }
    };

    const hook = serializeRange(opts);

    return hook(mock).then(result => {
      expect(result.data.range).to.equal('[,b)');
    });
  });

  it('correctly serializes a range with no upper bound', () => {
    const mock = {
      method: 'create',
      type: 'before',
      data: {
        from: 'a'
      }
    };

    const hook = serializeRange(opts);

    return hook(mock).then(result => {
      expect(result.data.range).to.equal('[a,)');
    });
  });

  it('removes upper and lower bounds fields', () => {
    const mock = {
      method: 'create',
      type: 'before',
      data: {
        from: 'a',
        to: 'b'
      }
    };

    const hook = serializeRange(opts);

    return hook(mock).then(result => {
      expect(result.data.from).to.be.undefined;
      expect(result.data.to).to.be.undefined;
    });
  });
});
