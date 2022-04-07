const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

const disableBatchRequests = require('../../src/hooks/disable-batch-requests');

describe('\'disableBatchRequests\' hook', () => {
  it('throws an error when input data is an array', () => {
    const mock = {
      data: []
    };
    const hook = disableBatchRequests();

    return expect(hook(mock)).to.be.rejected;
  });
});
