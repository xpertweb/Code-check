const checkPermissions = require('feathers-permissions');
const { iff } = require('feathers-hooks-common');
const { restrictToOwner } = require('feathers-authentication-hooks');
const { authenticate } = require('@feathersjs/authentication').hooks;

module.exports = (customOwnerField = 'id') => {
  return [
    authenticate('jwt'),
    checkPermissions({
      roles: ['operator'],
      field: 'roles',
      error: false
    }),
    iff(context => !context.params.permitted,
      restrictToOwner({ idField: 'id', ownerField: customOwnerField })
    )];
};