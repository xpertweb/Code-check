const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');
const decodeJwt = require('jwt-decode');
const ROLES_ENUM = require('../src/helpers/enum/roles-enum');
const oauth2 = require('@feathersjs/authentication-oauth2');
const facebookStrategy = require('passport-facebook');
const googleStrategy = require('passport-google-oauth20');
const makeHandler = require('./oauth-handler');
const createHmac = require('create-hmac');

const jwtToken = require('jsonwebtoken');
let KEY_ID = process.env.SMOOCH_TOKEN_KEY;
let SECRET = process.env.SMOOCH_TOKEN_SIGNATURE;

if (process.env.NODE_ENV === 'development') { // use test keys
  KEY_ID = 'app_5d882477c82cec0011b20c95';
  SECRET = 'qLZ0Lx4EheRUCjfjf1uuYg9BfPT9PAxRurpdV4h7I923JsL1ZnGVxmUj1dzafhMgWp78K-Fp3U-E_Vsqi9TXyg';
}

const signJwt = function(userId) {
  return jwtToken.sign(
    {
      scope: 'appUser',
      userId: userId
    },
    SECRET,
    {
      header: {
        alg: 'HS256',
        typ: 'JWT',
        kid: KEY_ID
      }
    }
  );
};

const customIsVerifiedHook = require('../src/hooks/custom-is-verified-hook');

//const EmailFirstOAuth2Verifier = require('./email-first-oauth-verifier');
module.exports = function () 
{
  const app = this;
  const config = app.get('authentication');

  // Set up authentication with the secret

  app.configure(authentication(config));
  app.configure(jwt(config.jwt));
  app.configure(local(config.operatorLocal));
  app.configure(local(config.butlerLocal));
  app.configure(local(config.clientLocal));


  const handler = makeHandler(app);
  // .... 

  app.configure(oauth2(Object.assign({
    name: 'google',
    Strategy: googleStrategy,
    // Provide the handler to the Google auth setup.
    // The successRedirect should point to the handle-oauth-login.html hosted on the web server.
    handler: handler('/handle-oauth-login.html'),
    emailField: 'email'
  }, config.google)));


  app.configure(oauth2(Object.assign({
    name: 'facebook',
    Strategy: facebookStrategy,
    // Provide the handler to the Google auth setup.
    // The successRedirect should point to the handle-oauth-login.html hosted on the web server.
    handler: handler('/handle-oauth-login.html')
  }, config.facebook)));

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks(
  {
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies),
        customIsVerifiedHook(), // !!! Add the isVerified hook before authentication
        context => {
          context.params.jwt = { expiresIn: 1209600 }; // 2 weeks
        }
      ],
      update: [ authentication.hooks.authenticate(config.strategies)],
      remove: [ authentication.hooks.authenticate('jwt')]
    },
    after: 
    {
      create: [async (hook) => 
      {
        const { app } = hook;
        const { user } = hook.params;
        const token = hook.result.accessToken;
        const openJwt = decodeJwt(token);

        let newUserData;

        if (user) {
          switch ((user.roles || [])[0]) 
          { //we need this in case the user is updated while still logged-in
          case ROLES_ENUM.BUTLERS:
            newUserData = await app.service('butlers').get({ id: openJwt.userId });
            await app.service('butlers') //update last login date
              .patch(openJwt.userId, {
                dateTimeLastLogin: (new Date().toISOString()).slice(0, 19).replace('T', ' ')
            });
            break;
          case ROLES_ENUM.CLIENTS:
            newUserData = await app.service('clients').get({ id: openJwt.userId });
            break;
          case ROLES_ENUM.OPERATORS:
            newUserData = await app.service('operators').get({ id: openJwt.userId });
            break;
          default:
            break;
          }

          hook.result.data = Object.assign(user, newUserData);
          const hmac = createHmac(
            'sha256', //hash function
            process.env.INTERCOM_KEY //secret key (keep safe!)
          ); // user's email address
          hmac.update(hook.result.data.email);


          hook.result.data.intercomAuth = hmac.digest('hex');
          hook.result.data.smoochToken = signJwt(hook.result.data.id);
          delete hook.result.data['password'];
        }


        hook.result.code = 200;
        return hook;
      }]
    },
  });
};
