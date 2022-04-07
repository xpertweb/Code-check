// Initializes the `butlerAuthManagement` service on path `/butler-auth-management`
const moment = require('moment')
const authManagement = require('feathers-authentication-management');
const hooks = require('./butler-auth-management.hooks');
const successResettingYourPassword = require('../../mail-templates/success-resetting-your-password-email-template');
const resetPasswordTemplate = require('../../mail-templates/butler-reset-password-email-template');

// const url = process.env.JARVIS_BUTLER_APP_URL
const from = process.env.NO_REPLY_EMAIL_ADDRESS

const notifier = (app) => {
  try {
    return async function (type, butler) {
      switch (type) {
        case 'sendResetPwd':
          const token = butler.resetShortToken.split('___')[1]
          console.log('--- send butler reset password token')
          const sendResetPwdEmail = {
            from,
            to: butler.email,
            subject: 'Reset Password',
            html: resetPasswordTemplate.replace('@@verification_token@@', token),
          };
          app.service('mailer').create(sendResetPwdEmail)
          break;
        case 'resetPwd':
          console.log('--- resetPwd success')
          const resetPwdEmail = {
            from,
            to: butler.email,
            subject: 'Reset Password Success',
            html: successResettingYourPassword,
          };
          app.service('mailer').create(resetPwdEmail)
          break;
        default:
          break;
      }
    }
  } catch (error) {
    console.warn(error)
  }
}

module.exports = function (app) {
  // Initialize our service with any options it requires
  const options = {
    service: '/butlers',
    path: 'butlerAuthManagement',
    identifyUserProps: ["_id", "phone", "email"],
    shortTokenLen: 6,
    shortTokenDigits: true,
    skipIsVerifiedCheck: true,
    notifier: notifier(app)
  }
  app.configure(authManagement(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('butlerAuthManagement');

  service.hooks(hooks);
};
