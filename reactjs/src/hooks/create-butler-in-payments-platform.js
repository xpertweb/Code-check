const axios = require('axios');
const logger = require('winston');
const getServerProtocol = require('../helpers/get-server-protocol');
const {authenticateAgainstPaymentsPlatform} = require('../helpers/authenticate-against-payments-platform');

async function findPaymentsButlerByEmail(token, email) {
  const response = await axios({
    method: 'post',
    url: process.env.PAYMENTS_URI,
    headers: { Authorization: 'Bearer ' + token },
    data: {
      query:
        '{\n' +
        '  butler(where: {\n' +
        `    email: "${email}"\n` +
        '  }) {' +
        '    id\n' +
        '  }\n' +
        '}'
    }
  });

  try {
    return response.data.data.client;
  } catch (e) {
    throw new Error ('Error finding client in Payments: ' + e.message);
  }
}

function formatData(data) {
  return Object.keys(data).map(key => `${key}: "${data[key]}"`).join('\n');
}

async function createButlerWithZeroBalance(token, createData) {
  const response = await axios({
    method: 'post',
    url: process.env.PAYMENTS_URI,
    headers: { Authorization: 'Bearer ' + token },
    data: {
      query:
        'mutation {\n' +
        '  createButler(\n' +
        `    ${formatData(createData)}\n` +
        '    openingBalance: 0\n' +
        '  ) {\n' +
        '    id\n' +
        '  }\n' +
        '}'
    }
  });

  try {
    return response.data.data.createClient;
  } catch (e) {
    throw new Error ('Error creating client in Payments: ' + e.message);
  }
}

async function updateButler(token, id, updateData) {
  const response = await axios({
    method: 'post',
    url: process.env.PAYMENTS_URI,
    headers: { Authorization: 'Bearer ' + token },
    data: {
      query:
        'mutation {\n' +
        '  updateButler(\n' +
        `    id: "${id}"\n` +
        `    data: { ${formatData(updateData)} }\n` +
        '  ) {\n' +
        '    id\n' +
        '  }\n' +
        '}'
    }
  });

  try {
    return response.data.data.createButler;
  } catch (e) {
    throw new Error ('Error creating butler in Payments: ' + e.message);
  }
}

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async function createClientInPayments(context) {
    try {
      const opsButler = context.result;
      //get an admin token
      const token = (await axios({
        method: 'POST',
        baseURL: `${getServerProtocol()}${process.env.FEATHERS_HOST_URL}`,
        url: '/authentication',
        data: {
          email: process.env.ROOT_EMAIL,
          password: process.env.ROOT_PASSWORD,
          strategy: 'operatorLocal'
        }
      }
      )).data.accessToken;
      const paymentsToken = await authenticateAgainstPaymentsPlatform(token.replace('Bearer ', ''));

      const paymentsButler = await findPaymentsButlerByEmail(paymentsToken, opsButler.email);

      if (paymentsButler) {
        await updateButler(paymentsToken, paymentsButler.id, {
          firstName: opsButler.firstName,
          lastName: opsButler.lastName
        });
      } else {
        // create a butler in payments to maintain sync
        await createButlerWithZeroBalance(paymentsToken, {
          email: opsButler.email.toLowerCase(),
          firstName: opsButler.firstName,
          lastName: opsButler.lastName
        });
      }
    } catch (e) {
      logger.error(`Error creating a butler in Payments platform: ${e.message}`);
    }
    

    return context;
  };
};
