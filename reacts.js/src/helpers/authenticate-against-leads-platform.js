
const axios = require('axios');
const logger = require('winston');

export async function authenticateAgainstLeadsPlatform(opsToken) {
  const response = await axios({
    method: 'post',
    url: process.env.LEADS_API,
    data: {
      query:
        'mutation {\n' +
        '  login(\n' +
        '    strategy: jwt\n' +
        `    accessToken: "${opsToken}"\n` +
        '  ) {\n' +
        '    token\n' +
        '  }\n' +
        '}'
    }
  });

  try {
    return response.data.data.login.token;
  } catch (e) {
    logger.error('Error authenticating with Leads: ' + e.message);
  }
}
