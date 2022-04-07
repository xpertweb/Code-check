const _ = require('lodash');

module.exports = function () {
  return async function isAdmin(hook) {

  	let roles = _.get(hook,'params.user.roles');
  	let role=_.first(roles);
    let team = _.get(hook,'result');
    
    if(role=='butler'){
      team.isAdmin=0;
      let butlerId = _.get(hook,'params.user.id');
      let db = hook.app.get('knexClient');
      let admin = await db.select('*').from('butlerTeamsAdministrators').where('butlerTeamsAdministrators.butlerTeamId', hook.result.id)
                                                                        .where('butlerTeamsAdministrators.butlerId', butlerId);
      if(admin.length>0){
        team.isAdmin=1;
      }
    }
      hook.result=team;
      return hook;
  };
};
