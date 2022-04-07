const chai = require('chai');
const expect = chai.expect;
const analyseSchedules = require('../../src/hooks/analyse-schedules');

describe('\'analyseSchedules\' hook', () => {
  it('flags schedule status as \'ok\' by default', () => {
    const mock = {
      result: {}
    };

    const hook = analyseSchedules();

    return hook(mock).then(result => {
      expect(result.result.analysis.status).to.equal('ok');
    });
  });

  it('flags schedule status as \'error\' if truncated', () => {
    const mock = {
      result: {
        trunc: true
      }
    };

    const hook = analyseSchedules();

    return hook(mock).then(result => {
      expect(result.result.analysis.status).to.equal('error');
    });
  });

  it('flags schedule status as \'warning\' if butler unavailable', () => {
    const mock = {
      result: {
        butlerAvailable: false
      }
    };

    const hook = analyseSchedules();

    return hook(mock).then(result => {
      expect(result.result.analysis.status).to.equal('warning');
    });
  });

  it('flags schedule status as \'warning\' if constraints not satisfied', () => {
    const mock = {
      result: [
        {
          constraintsSatisfied: true
        },
        {
          constraintsSatisfied: false
        }
      ]
    };

    const hook = analyseSchedules();

    return hook(mock).then(result => {
      expect(result.result[0].analysis.status).to.equal('ok');
      expect(result.result[1].analysis.status).to.equal('warning');
    });
  });
});
