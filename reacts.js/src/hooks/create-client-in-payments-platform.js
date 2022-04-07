const axios = require('axios');
const logger = require('winston');
const getServerProtocol = require('../helpers/get-server-protocol');
const {authenticateAgainstPaymentsPlatform} = require('../helpers/authenticate-against-payments-platform');

async function findPaymentsClientByEmail(token, email) {
  const response = await axios({
    method: 'post',
    url: process.env.PAYMENTS_URI,
    headers: { Authorization: 'Bearer ' + token },
    data: {
      query:
        '{\n' +
        '  client(where: {\n' +
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

async function createClientWithZeroBalance(token, createData) {
  const response = await axios({
    method: 'post',
    url: process.env.PAYMENTS_URI,
    headers: { Authorization: 'Bearer ' + token },
    data: {
      query:
        'mutation {\n' +
        '  createClient(\n' +
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

async function updateClient(token, id, updateData) {
  const response = await axios({
    method: 'post',
    url: process.env.PAYMENTS_URI,
    headers: { Authorization: 'Bearer ' + token },
    data: {
      query:
        'mutation {\n' +
        '  updateClient(\n' +
        `    id: "${id}"\n` +
        `    data: { ${formatData(updateData)} }\n` +
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

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async function createClientInPayments(context) {
    try {
      const opsClient = context.result;
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

      const paymentsClient = await findPaymentsClientByEmail(paymentsToken, opsClient.email);

      if (paymentsClient) {
        await updateClient(paymentsToken, paymentsClient.id, {
          phoneNumber: opsClient.phoneNumber,
          firstName: opsClient.firstName,
          lastName: opsClient.lastName
        });
      } else {
        // create a client in payments to maintain sync
        await createClientWithZeroBalance(paymentsToken, {
          email: opsClient.email.toLowerCase(),
          phoneNumber: opsClient.phoneNumber,
          firstName: opsClient.firstName,
          lastName: opsClient.lastName
        });
      }
    } catch (e) {
      logger.error(`Error creating a client in Payments platform: ${e.message}`);
    }
    

    return context;
  };
};
