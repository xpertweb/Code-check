module.exports = function (app) {
  return function (url) {
    const config = app.get('authentication');
    const options = {
      jwt: config.jwt,
      secret: config.secret
    };

    return async function (req, res, next) {
      if (req.feathers && req.feathers.payload) {
        let knex = app.get('knexClient');

        const realClient = await knex('clients')
          .where('facebookId', req.feathers.payload.userId)
          .orWhere('googleId', req.feathers.payload.userId);


        if (!realClient || realClient.length === 0) {

          const socialMediaClient = await Promise.all([
            knex('facebookClients')
              .where('id', req.feathers.payload.userId),
            knex('googleClients')
              .where('id', req.feathers.payload.userId),
          ]);


          let clientToExtractFrom;

          let googleAccount = false;
          let facebookAccount = false;
          if (socialMediaClient[0].length > 0) {
            clientToExtractFrom = socialMediaClient[0][0];
            facebookAccount = true;
          } else if (socialMediaClient[1].length > 0) {
            clientToExtractFrom = socialMediaClient[1][0];
            googleAccount = true;
          }

          const { email, firstName, lastName } = clientToExtractFrom;

          let finalUrl = `${url}?token=registration-required&email=${email}&firstname=${firstName}&lastname=${lastName}`;
          if (googleAccount) {
            finalUrl += `&googleid=${req.feathers.payload.userId}`;
          } else if (facebookAccount) {
            finalUrl += `&facebookid=${req.feathers.payload.userId}`;
          }
          res.redirect(finalUrl);
        } else {

          if (!realClient[0].isVerified) { //set the client as verified so the account system wont kick this user out
            await knex('clients')
              .where('id', realClient[0].id)
              .update({
                isVerified: true
              });
          }

          req.feathers.payload.userId = realClient[0].id;
          app.passport.createJWT(req.feathers.payload, options).then(token => {
            res.redirect(`${url}?token=${token}&userid=${realClient[0].id}`);
          })
            .catch(error => {
              next(error);
            });
        }
      }
    };

  };
};

