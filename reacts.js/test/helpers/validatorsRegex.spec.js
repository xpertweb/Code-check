const {
  rdatetime
} = require('../../src/models/validators/regex');
// const { Schema } = require('feathers-schema');
  

const expect = require('chai').expect;

describe('\'Model Validators\' helper', () => {
  it('validates proper date and time type', () => {
    const expectedDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    expect(rdatetime.exec(expectedDateTime)).to.be.not.null;

    const anotherDateTime = '2019-01-11 03:45:16';
    expect(rdatetime.exec(anotherDateTime)).to.be.not.null;

    const badDateTime = '2019-01-11 03:45';
    expect(rdatetime.exec(badDateTime)).to.be.null;

    const anotherBadDateTime = '2019-01-11';
    expect(rdatetime.exec(anotherBadDateTime)).to.be.null;

  });
});
