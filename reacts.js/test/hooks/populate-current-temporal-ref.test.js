const chai = require('chai');
const expect = chai.expect;
const populateCurrentTemporalRef = require('../../src/hooks/populate-current-temporal-ref');
const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');
const { LocalDate } = require('js-joda');

describe('\'populateCurrentTemporalRef\' hook', () => {
  const app = feathers()
    .use('/foreignTemporalService', memory({
      name: 'foreignTemporalService',
      store: {
        '1': { id: 1, myServiceRef: 1, data: { a: 'foo' }, activeFrom: LocalDate.parse('2017-01-01') },
        '2': { id: 2, myServiceRef: 1, data: { a: 'boo' }, activeFrom: LocalDate.parse('2017-01-03') },
        '3': { id: 3, myServiceRef: 1, data: { a: 'bar' }, activeFrom: LocalDate.parse('2017-01-07') },
        '4': { id: 4, myServiceRef: 1, data: { a: 'bat' }, activeFrom: LocalDate.parse('2017-01-04') },
        '5': { id: 5, myServiceRef: 1, data: { a: 'bot' }, activeFrom: LocalDate.parse('2017-01-02') }
      }
    }));

  const hookOpts = {
    refService: 'foreignTemporalService',
    refServiceIdField: 'myServiceRef',
    nameAs: 'currentInstance',
    temporalField: 'activeFrom',
    now: () => LocalDate.parse('2017-01-05')
  };

  it('populates the correct foreign service reference based on now()', () => {
    const mock = {
      app: app,
      type: 'after',
      method: 'get',
      params: {
        _populate: false
      },
      result: {
        id: 1
      }
    };

    const hook = populateCurrentTemporalRef(hookOpts);

    return hook(mock).then(result => {
      expect(result.result.currentInstance.data.a).to.equal('bat');
    });
  });

  it('correctly normalizes result if normalization func is specified', () => {
    const mock = {
      app: app,
      type: 'after',
      method: 'get',
      params: {
        _populate: false
      },
      result: {
        id: 1
      }
    };

    const hook = populateCurrentTemporalRef({
      ...hookOpts,
      normalize: (o) => o.data
    });

    return hook(mock).then(result => {
      expect(result.result.currentInstance.data).to.be.undefined;
      expect(result.result.currentInstance.a).to.equal('bat');
    });
  });
});
