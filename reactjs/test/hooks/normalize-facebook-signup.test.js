const expect = require('chai').expect;
const normalizeFacebookSignup = require('../../src/hooks/normalize-facebook-signup');

describe('\'normalizeFacebookSignup\' hook', () => {
  it('parameters are normalized if provider is \'facebook\'', () => {
    const mock = {
      params: {
        oauth: {
          provider: 'facebook'
        }
      },
      data: {
        facebook: {
          profile: {
            _json: {
              email: 'foo@bar.com',
              first_name: 'John',
              last_name: 'Doe'
            }
          }
        }
      }
    };
    const hook = normalizeFacebookSignup();

    return hook(mock).then(result => {
      expect(result.data.email).to.equal('foo@bar.com');
      expect(result.data.firstName).to.equal('John');
      expect(result.data.lastName).to.equal('Doe');
    });
  });
});
