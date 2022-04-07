const expect = require('chai').expect;
const validateRange = require('../../src/hooks/validate-range');

describe('\'validateRange\' hook', () => {
  const opts = {
    lowerBoundField: 'from',
    upperBoundField: 'to'
  };

  it('throws an error when lower bound is ordinally after upper bound', () => {
    const mock = {
      type: 'before',
      data: {
        from: 2,
        to: 1
      }
    };

    const hook = validateRange(opts);

    expect(hook.bind(this, mock)).to.throw();
  });

  it('does not throw an error when lower bound is ordinally before upper bound', () => {
    const mock = {
      type: 'before',
      data: {
        from: 1,
        to: 2
      }
    };

    const hook = validateRange(opts);

    expect(hook.bind(this, mock)).to.not.throw();
  });

  it('does not throw an error when lower bound is equal to upper bound', () => {
    const mock = {
      type: 'before',
      data: {
        from: 2,
        to: 2
      }
    };

    const hook = validateRange(opts);

    expect(hook.bind(this, mock)).to.not.throw();
  });
});
