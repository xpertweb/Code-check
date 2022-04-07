const axios = require("axios");
const logger = require("winston");
const {
  authenticateAgainstPaymentsPlatform
} = require("./authenticate-against-payments-platform");

async function getHistoricVisit(token, clientEmails, date) {
  try {
    const response = await axios({
      method: "post",
      url: process.env.PAYMENTS_URI,
      headers: { Authorization: "Bearer " + token },
      data: {
        query: `
      {
        historicVisits(where: {date_in: ["${date}"], client: {
        email_in: [${'"' + clientEmails.join('","') + '"'}]
      }}){
        id
        date
        client {
          id
          firstName
          lastName
          email
          phoneNumber
        }
        butler {
          id
          email
          firstName
          lastName
        }
        fee {
          amount
        }
      }
    }
      `
      }
    });

    return response.data.data.historicVisits;
  } catch (e) {
    console.log("error on historicVisits", e);
    throw new Error("Error finding client in Payments: " + e.message);
  }
}
async function getSingleHistoricVisit(token, clientEmail, date) {
  try {
    const response = await axios({
      method: "post",
      url: process.env.PAYMENTS_URI,
      headers: { Authorization: "Bearer " + token },
      data: {
        query: `
      {
        historicVisits(where: {
          client: {email: "${clientEmail}"}
          date: "${date}"
        }){
          id
          date
          fee {
            amount
            description
          }
          client {
            id
            firstName
            lastName
            email
            phoneNumber
            payments {
              description
              amount
              date
              stripePaymentId
            }
          }
            charge {
              amount
              amountAfterDiscount
              description
            }
            butler {
              id
              firstName
              lastName
              email
              payments {
                description
                amount
                date
                stripePaymentId
              }
            }
          }
      }
      `
      }
    });

    return response.data.data.historicVisits;
  } catch (e) {
    console.log("error on historicVisits", e);
    throw new Error("Error finding client in Payments: " + e.message);
  }
}
export async function getHistoricVisitFromPaymentsPlatform({
  clientEmails,
  date,
  authorization
}) {
  try {
    const paymentsToken = await authenticateAgainstPaymentsPlatform(
      authorization.replace("Bearer ", "")
    );
    const historicVisitData = await getHistoricVisit(
      paymentsToken,
      clientEmails,
      date
    );

    return historicVisitData;
  } catch (e) {
    logger.error("Error getting historic visit data : " + e.message);
  }
}

export async function getSingleHistoricVisitFromPayment(
  clientEmail,
  authorization,
  date
) {
  try {
    const paymentsToken = await authenticateAgainstPaymentsPlatform(
      authorization.replace("Bearer ", "")
    );
    const historicVisitData = await getSingleHistoricVisit(
      paymentsToken,
      clientEmail,
      date
    );
    return historicVisitData;
  } catch (e) {
    logger.error("Error getting historic visit data : " + e.message);
  }
}
