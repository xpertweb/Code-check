const _ = require('lodash');

module.exports = function () {
  return async function getAllButlerTeamsOnly(hook) {
  	let butlerId = _.get(hook,'params.query.butlerId');
  	let roles = _.get(hook,'params.user.roles');
  	let role=_.first(roles);
  	let loggedInButlerId=_.get(hook,'params.user.id');

  	if(butlerId && role=='butler'){
  	  let results = _.get(hook,'result');

      const response = results.map((row) => {
         let team = {id:_.get(row,'butlerTeams.id'),name:_.get(row,'butlerTeams.name'),dateTimeCreated:_.get(row,'butlerTeams.dateTimeCreated'),isAdmin:0};
         let butlerTeamsAdministrator = _.get(row,'butlerTeamsAdministrators.butlerId');
         if(butlerTeamsAdministrator==loggedInButlerId){
            team.isAdmin=1;
         }
         return team;

      });
      hook.result=response;
    }
      return hook;
  };
};
