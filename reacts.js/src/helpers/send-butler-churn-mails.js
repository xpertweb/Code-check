const axios = require('axios');
const { LocalDate, LocalTime } = require('js-joda');
const butlerChurnedFareWellTemplate = require('../mail-templates/butler-churned-farewell-template');
const butlerChurnAffectedClientsTemplate = require('../mail-templates/butler-churn-affected-clients-template');
const butlerPauseClientTemplate = require('../mail-templates/butler-temporary-churn-affected-client-template');
const butlerPauseButlerTemplate = require('../mail-templates/butler-temporary-churn-butler-template');

const sendButlerFarewellEmail = (
  params,
  butlerToBeChurned,
  isPause,
  churnDate,
  returnDate,
  churnReasonText
) => {
  if (isPause) {
    return axios({
      method: 'post',
      baseURL: process.env.COMMS_URL,
      url: '/send-email',
      data: {
        message: butlerPauseButlerTemplate
          .replace('@churned_butler_name@', butlerToBeChurned.firstName)
          .replace('@churn_Date@', churnDate)
          .replace('@churn_reason@', churnReasonText.reason.toLowerCase())
          .replace('@return_Date@', returnDate),
        email:
          process.env.NODE_ENV === 'development'
            ? 'test@getjarvis.com.au'
            : butlerToBeChurned.email,
        phoneNumber: butlerToBeChurned.phoneNumber,
        ticketStatus: 'pending',
        requesterId: '114329911454', // admin id
        author: 'Comms Platform',
        subject: 'Changes to your schedule',
        messageType: 'generic_email',
      },
      headers: {
        authorization: params.headers.authorization,
      },
    });
  } else {
    return axios({
      method: 'post',
      baseURL: process.env.COMMS_URL,
      url: '/send-email',
      data: {
        message: butlerChurnedFareWellTemplate
          .replace('@churned_butler_name@', butlerToBeChurned.firstName)
          .replace('@butler_last_date@', churnDate)
          .replace('@churn_reason@', churnReasonText.reason.toLowerCase()),
        email:
          process.env.NODE_ENV === 'development'
            ? 'test@getjarvis.com.au'
            : butlerToBeChurned.email,
        phoneNumber: butlerToBeChurned.phoneNumber,
        ticketStatus: 'pending',
        requesterId: '114329911454', // admin id
        author: 'Comms Platform',
        subject: 'Changes to your schedule',
        messageType: 'generic_email',
      },
      headers: {
        authorization: params.headers.authorization,
      },
    });
  }
};
const sendButlerFarewellSms = (
  params,
  butlerToBeChurned,
  isPause,
  churnDate,
  returnDate,
  churnReasonText
) => {
  if (isPause) {
    return axios({
      method: 'post',
      baseURL: process.env.COMMS_URL,
      url: '/send-sms',
      data: {
        message: butlerPauseButlerTemplate
          .replace('@churned_butler_name@', butlerToBeChurned.firstName)
          .replace('@churn_Date@', churnDate)
          .replace('@churn_reason@', churnReasonText.reason.toLowerCase())
          .replace('@return_Date@', returnDate),
        email: butlerToBeChurned.email,
        phoneNumber: butlerToBeChurned.phoneNumber,
        ticketStatus: 'pending',
        requesterId: '114329911454', // admin id
        author: 'Comms Platform',
        subject: 'Changes to your schedule',
        messageType: 'generic_email',
      },
      headers: {
        authorization: params.headers.authorization,
      },
    });
  } else {
    return axios({
      method: 'post',
      baseURL: process.env.COMMS_URL,
      url: '/send-sms',
      data: {
        message: butlerChurnedFareWellTemplate
          .replace('@churned_butler_name@', butlerToBeChurned.firstName)
          .replace('@butler_last_date@', churnDate)
          .replace('@churn_reason@', churnReasonText.reason.toLowerCase()),
        email: butlerToBeChurned.email,
        phoneNumber: butlerToBeChurned.phoneNumber,
        ticketStatus: 'pending',
        requesterId: '114329911454', // admin id
        author: 'Comms Platform',
        subject: 'Changes to your schedule',
        messageType: 'generic_email',
      },
      headers: {
        authorization: params.headers.authorization,
      },
    });
  }
};
const notifyClientByEmail = (
  params,
  isPause,
  affectedService,
  butlerToBeChurned,
  churnDate,
  returnDate,
  closestVisit,
  earliestOneOff,
  churnReasonText
) => {
  if (isPause) {
    return axios({
      method: 'post',
      baseURL: process.env.COMMS_URL,
      url: '/send-email',
      data: {
        message: butlerPauseClientTemplate
          .replace('@client_name@', affectedService.service.client.firstName)
          .replace(/@@churned_butler_name@@/g, butlerToBeChurned.firstName)
          .replace('@churn_reason@', churnReasonText.reason.toLowerCase())
          .replace('@churn_Date@', LocalDate.parse(churnDate).toString())
          .replace('@return_Date@', LocalDate.parse(returnDate).toString())
          .replace('@next_visit_date@', closestVisit.date.toString())
          .replace('@next_visit_time@', earliestOneOff.windowStartTime),
        email:
          process.env.NODE_ENV === 'development'
            ? 'test@getjarvis.com.au'
            : affectedService.service.client.email,
        phoneNumber: affectedService.service.client.phoneNumber,
        ticketStatus: 'pending',
        requesterId: '114329911454', // admin id
        author: 'Comms Platform',
        subject: 'Changes to your booking',
        messageType: 'generic_email',
      },
      headers: {
        authorization: params.headers.authorization,
      },
    });
  } else {
    return axios({
      method: 'post',
      baseURL: process.env.COMMS_URL,
      url: '/send-email',
      data: {
        message: butlerChurnAffectedClientsTemplate
          .replace('@client_name@', affectedService.service.client.firstName)
          .replace('@churned_butler_name@', butlerToBeChurned.firstName)
          .replace('@churn_reason@', churnReasonText.reason.toLowerCase())
          .replace('@churn_Date@', LocalDate.parse(churnDate).toString())
          .replace('@next_visit_date@', closestVisit.date.toString())
          .replace('@next_visit_time@', earliestOneOff.windowStartTime),
        email:
          process.env.NODE_ENV === 'development'
            ? 'test@getjarvis.com.au'
            : affectedService.service.client.email,
        phoneNumber: affectedService.service.client.phoneNumber,
        ticketStatus: 'pending',
        requesterId: '114329911454', // admin id
        author: 'Comms Platform',
        subject: 'Changes to your booking',
        messageType: 'generic_email',
      },
      headers: {
        authorization: params.headers.authorization,
      },
    });
  }
};

const notifyClientBySMS = (
  params,
  isPause,
  affectedService,
  butlerToBeChurned,
  churnDate,
  returnDate,
  closestVisit,
  earliestOneOff,
  churnReasonText
) => {
  if (isPause) {
    return axios({
      method: 'post',
      baseURL: process.env.COMMS_URL,
      url: '/send-sms',
      data: {
        message: butlerPauseClientTemplate
          .replace('@client_name@', affectedService.service.client.firstName)
          .replace(/@@churned_butler_name@@/g, butlerToBeChurned.firstName)
          .replace('@churn_reason@', churnReasonText.reason.toLowerCase())
          .replace('@churn_Date@', LocalDate.parse(churnDate).toString())
          .replace('@return_Date@', LocalDate.parse(returnDate).toString())
          .replace('@next_visit_date@', closestVisit.date.toString())
          .replace('@next_visit_time@', earliestOneOff.windowStartTime),
        email: affectedService.service.client.email,
        phoneNumber: affectedService.service.client.phoneNumber,
        ticketStatus: 'pending',
        requesterId: '114329911454', // admin id
        author: 'Comms Platform',
        subject: 'Changes to your booking',
        messageType: 'generic_email',
      },
      headers: {
        authorization: params.headers.authorization,
      },
    });
  } else {
    return axios({
      method: 'post',
      baseURL: process.env.COMMS_URL,
      url: '/send-sms',
      data: {
        message: butlerChurnAffectedClientsTemplate
          .replace('@client_name@', affectedService.service.client.firstName)
          .replace('@churned_butler_name@', butlerToBeChurned.firstName)
          .replace('@churn_reason@', churnReasonText.reason.toLowerCase())
          .replace('@churn_Date@', LocalDate.parse(churnDate).toString())
          .replace('@next_visit_date@', closestVisit.date.toString())
          .replace('@next_visit_time@', earliestOneOff.windowStartTime),
        email: affectedService.service.client.email,
        phoneNumber: affectedService.service.client.phoneNumber,
        ticketStatus: 'pending',
        requesterId: '114329911454', // admin id
        author: 'Comms Platform',
        subject: 'Changes to your booking',
        messageType: 'generic_email',
      },
      headers: {
        authorization: params.headers.authorization,
      },
    });
  }
};

module.exports = {
  sendButlerFarewellEmail,
  notifyClientByEmail,
  notifyClientBySMS,
  sendButlerFarewellSms,
};
