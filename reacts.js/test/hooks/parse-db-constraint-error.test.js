const expect = require('chai').expect;
const parseDbConstraintError = require('../../src/hooks/parse-db-constraint-error');

describe('\'parseDbConstraintError\' hook', () => {
  const rulesSpec = [
    {
      constraint: 'constraint1',
      fieldName: 'field1',
      message: 'Error message!'
    },
    {
      constraint: 'constraint2',
      message: 'Error message which is general!'
    }
  ];

  it('parses a specific constraint error correctly based on parse rules spec', () => {
    const mock = {
      type: 'error',
      error: {
        constraint: 'constraint1'
      }
    };

    const hook = parseDbConstraintError(rulesSpec);
    const result = hook(mock);

    expect(result.error.errors['field1']).to.equal('Error message!');
  });

  it('parses a general constraint error correctly based on parse rules spec', () => {
    const mock = {
      type: 'error',
      error: {
        constraint: 'constraint2'
      }
    };

    const hook = parseDbConstraintError(rulesSpec);
    const result = hook(mock);

    expect(result.error.errors['error']).to.equal('Error message which is general!');
  });
});
