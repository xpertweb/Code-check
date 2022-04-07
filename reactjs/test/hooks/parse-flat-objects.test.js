const { expect } = require('chai');
const parseFlatObjects = require('../../src/hooks/parse-flat-objects');

describe('\'parseFlatObjects\' hook', () => {
  it('correctly constructs object from flat representation', () => {
    const mock = {
      result: {
        'a': 1,
        'b.c': 2,
        'b.d': 3
      }
    };

    const hook = parseFlatObjects();

    const result = hook(mock);
    expect(result.result).to.deep.equal({
      a: 1,
      b: {
        c: 2,
        d: 3
      }
    });
  });
});
