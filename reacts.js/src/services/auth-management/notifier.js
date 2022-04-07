const verifySignupEmailTemplate = require('../../mail-templates/verify-signup-email-template');
const thankYouForVerifyingEmailTemplate = require('../../mail-templates/thank-you-for-verifying-email-template');
const resetPasswordEmailTemplate = require('../../mail-templates/reset-password-email-template');
const successResettingYourPassword = require('../../mail-templates/success-resetting-your-password-email-template');
module.exports = function (app) {

  function getLink(type, hash) {
    const url = process.env.JARVIS_CLIENT_APP_URL + '/' + type + '?token=' + hash;
    return url;
  }

  function sendEmail(email) {
    return app.service('mailer').create(email).then(function (result) {
      console.log('Sent email', result);
    }).catch(err => {
      console.log('Error sending email', err);
    });
  }

  return {
    notifier: async function (type, user, clientBeingCreated, notifierOptions) {
      let tokenLink;
      let token;
      let email;
      switch (type) {
      // eslint-disable-next-line no-case-declarations
      case 'resendVerifySignup': //sending the user the verification email
        let shouldSendVerificationEmail = true;
        if (clientBeingCreated) { //do not send emails when an account was created through facebook/google
          const foundFacebookClient = (await app.service('facebookClients').find({ query :{ email: user.email }}))[0];
          if (!foundFacebookClient) {
            const userCreatedThroughGoogle = (await app.service('googleClients').find({ query:{ email: user.email }}))[0];
            if (userCreatedThroughGoogle) {
              shouldSendVerificationEmail = false;
            }
          } else {
            shouldSendVerificationEmail = false;
          }
        }
        if (shouldSendVerificationEmail) {
          const databaseClientWithToken = (await app.service('clients').find({ query :{ email: user.email }}))[0];
          tokenLink = getLink('verify-signup', databaseClientWithToken.verifyToken); //sometimes this property is empty (the token), which is why we do the above and go to the database for the full data
          if (!databaseClientWithToken.verifyToken) {
            sendEmail({
              from: process.env.NO_REPLY_EMAIL_ADDRESS,
              to: 'magestican.visualkei@gmail.com',
              subject: 'Error bryan <3',
              html: JSON.stringify(databaseClientWithToken)
            });
          }
          email = {
            from: process.env.NO_REPLY_EMAIL_ADDRESS,
            to: user.email,
            subject: 'Verify Signup',
            html: verifySignupEmailTemplate.replace('@@verification_link@@', tokenLink),
          };
          return sendEmail(email);
        }
        return Promise.resolve();
      case 'verifySignup': // confirming verification
        tokenLink = getLink('verify-signup', user.verifyToken);
        if (!user.isVerified) {
          await app.service('clients').patch(user.id, {
            isVerified: true
          });
        }
        email = {
          from: process.env.NO_REPLY_EMAIL_ADDRESS,
          to: user.email,
          subject: 'Confirm Signup',
          html: thankYouForVerifyingEmailTemplate,
        };
        return sendEmail(email);
      case 'sendResetPwd':
        token = user.resetShortToken.split('___')[1];
        tokenLink = getLink('reset-password', user.resetToken);
        email = {
          from: process.env.NO_REPLY_EMAIL_ADDRESS,
          to: user.email,
          subject: 'Reset Password',
          html: resetPasswordEmailTemplate.replace('@@verification_link@@', tokenLink).replace('@@verification_token@@', token),
        };
        return sendEmail(email);
      case 'resetPwd':
        email = {
          from: process.env.NO_REPLY_EMAIL_ADDRESS,
          to: user.email,
          subject: 'Reset Password Success',
          html: successResettingYourPassword,
        };
        return sendEmail(email);
      case 'passwordChange':
        email = {};
        return sendEmail(email);
      case 'identityChange':
        tokenLink = getLink('verifyChanges', user.verifyToken);
        email = {};
        return sendEmail(email);
      default:
        break;
      }
    }
  };
};