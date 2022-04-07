const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const restrictOnForeignId = require('../../src/hooks/restrict-on-foreign-id');
const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');

describe('\'restrictOnForeignId\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers()
      .use('/mock-service', memory({
        name: 'mock-service',
        store: {
          '1': { id: 1, foreignRef: 7 },
          '2': { id: 2, foreignRef: 8 }
        }
      }));

    app.service('mock-service').hooks({
      before: {
        all: [restrictOnForeignId({
          exemptRoles: 'adminRole',
          foreignField: 'foreignRef'
        })]
      }
    });
  });

  it('does not do anything if provider is not set', () => {
    let hook = {
      id: '1',
      type: 'before',
      method: 'get',
      params: {},
      app
    };

    const returnedHook = restrictOnForeignId()(hook);
    expect(hook).to.deep.equal(returnedHook);
  });

  it('when user is not authenticated, throws a not authenticated error', () => {
    let hook = {
      id: '1',
      type: 'before',
      method: 'get',
      params: {
        provider: 'rest'
      },
      app
    };

    try {
      restrictOnForeignId()(hook);
    } catch (error) {
      expect(error.code).to.equal(401);
    }
  });


  it('narrows results on find() call', () => {
    const params = {
      provider: 'rest',
      user: {
        id: 8
      }
    };

    return app.service('mock-service').find(params).then(result => {
      expect(result).to.have.lengthOf(1);
      expect(result[0].id).to.equal(2);
    });
  });

  it('does not narrow results for exempted role', () => {
    const params = {
      provider: 'rest',
      user: {
        id: 8,
        roles: ['adminRole']
      }
    };

    return app.service('mock-service').find(params).then(result => {
      expect(result).to.have.lengthOf(2);
      expect(result[0].id).to.equal(1);
      expect(result[1].id).to.equal(2);
    });
  });

  it('restricts access on get(), update(), patch(), remove() calls', () => {
    const params = {
      provider: 'rest',
      user: {
        id: 8
      }
    };

    // foreignRef: Should be valid if we weren't trying to deal with
    // a field not already owned by us (since our id is 8)
    const obj = {
      foreignRef: 8
    };

    return Promise.all([
      expect(app.service('mock-service').get(1, params)).to.be.rejected,
      expect(app.service('mock-service').update(1, obj, params)).to.be.rejected,
      expect(app.service('mock-service').patch(1, obj, params)).to.be.rejected,
      expect(app.service('mock-service').remove(1, params)).to.be.rejected
    ]);
  });

  it('restricts input value on create(), update(), patch() calls', () => {
    const params = {
      provider: 'rest',
      user: {
        id: 8
      }
    };

    const obj = {
      foreignRef: 9
    };

    return Promise.all([
      expect(app.service('mock-service').create(obj, params)).to.be.rejected,
      expect(app.service('mock-service').update(2, obj, params)).to.be.rejected,
      expect(app.service('mock-service').patch(2, obj, params)).to.be.rejected
    ]);
  });
});
