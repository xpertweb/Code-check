//REGISTER ALL API ENDPOINTS
const userIdentities = require('./user-identities/user-identities.service.js');
const butlers = require('./butlers/butlers.service.js');
const clients = require('./clients/clients.service.js');
const operators = require('./operators/operators.service.js');

const workBlocks = require('./work-blocks/work-blocks.service.js');

const butlerAddresses = require('./butler-addresses/butler-addresses.service.js');

const services = require('./services/services.service.js');

const serviceAddresses = require('./service-addresses/service-addresses.service.js');

const serviceButlers = require('./service-butlers/service-butlers.service.js');

const visitPlans = require('./visit-plans/visit-plans.service.js');

const uploadButlerPoliceCheck = require('./upload-butler-police-check');

const uploadButlerResume = require('./upload-butler-resume');

const googleClients = require('./google-clients/google-clients.service.js');

const butlerVisitCheckinStatus = require('./butler-visit-checkin-status');

const clientSchedules = require('./client-schedules');

const publicReviews = require('./public-reviews');

const facebookClients = require('./facebook-clients/facebook-clients.service.js');

const visits = require('./visits/visits.service.js');

const visitPlansStartingOnDate = require('./visit-plans-starting-on-date');

let schedules;
if (!process.env.FAST_DEV_MODE){
  schedules = require('./schedules/schedules.service.js');
}

const requestedVisits = require('./requested-visits');

const allocations = require('./allocations');

const clientToDoItems = require('./client-to-do-items');
const operatorsToDoItems = require('./operators-to-do-items');

const clientToDoItemPictures = require('./client-to-do-item-pictures');

const recalculateRatings = require('./recalculate-ratings');

const butlerBankAccounts = require('./butlers-bank-accounts');

const butlerRatings = require('./butler-ratings');

const butlerVisits = require('./butler-visits');

const serviceCallHistory = require('./service-call-history');

const recalculateAllButlersActiveClients = require('./recalculate-all-butlers-active-clients');

const getMultipleClientInvoiceSettings = require('./get-multiple-client-invoice-settings');

const feedbackSettings = require('./feedback-settings');

const workDays = require('./work-days/work-days.service.js');

const allocationSettings = require('./allocation-settings');

const servicePauses = require('./service-pauses/service-pauses.service.js');

const legacyAllocs = require('./legacy-allocs/legacy-allocs.service.js');

const legacyItems = require('./legacy-items/legacy-items.service.js');

const serviceExpenses = require('./service-expenses/service-expenses.service.js');

const serviceChurns = require('./service-churns/service-churns.service.js');

const churnCategories = require('./churn-categories/churn-categories.service.js');

const newChurnCategories = require('./new-churn-categories/new-churn-categories.service.js');

const tasks = require('./tasks/tasks.service.js');

const butlerSkills = require('./butler-skills/butler-skills.service.js');

const serviceTasks = require('./service-tasks/service-tasks.service.js');

const butlerPauses = require('./butler-pauses/butler-pauses.service.js');

const serviceHandovers = require('./service-handovers/service-handovers.service.js');

const serviceChurnRisks = require('./service-churn-risks/service-churn-risks.service.js');

const serviceFeedback = require('./service-feedback/service-feedback.service.js');

const serviceButlerNoShow = require('./service-butler-no-show/service-butler-no-show.service.js');

const serviceReschedule = require('./service-reschedule/service-reschedule.service.js');

const serviceInvoicing = require('./service-invoicing/service-invoicing.service.js');
const serviceInvoices = require('./invoices/invoices.service.js');
const serviceMailInvoices = require('./invoice-mail/invoice-mail.service.js');

const serviceMarketing = require('./service-marketing/service-marketing.service.js');

const serviceExcludedButlers = require('./service-excluded-butlers/service-excluded-butlers.service.js');

const enrollButler = require('./enroll-butler');

const butlerChurns = require('./butler-churns/butler-churns.service.js');

const butlerBankDetails = require('./butler-bank-details');

const butlerChurnCategories = require('./butler-churn-categories/butler-churn-categories.service.js');

const serviceButlerChurnCategories = require('./service-butler-churn-categories/service-butler-churn-categories.service.js');

const recalculateChurnsPerClientRatings = require('./recalculate-churns-per-client-ratings');

const churnPerClientSettings = require('./churn-per-client-settings');

const butlerStrikes = require('./butler-strikes/butler-strikes.service.js');

const butlerStrikeCategories = require('./butler-strike-categories/butler-strike-categories.service.js');

const managedSchedule = require('./managed-schedule');

const authManagement = require('./auth-management');

const mailer = require('./mailer');

const allocationLogs = require('./allocation-logs');

const clientValueSettings = require('./client-value-settings');

const rankedButlers = require('./ranked-butlers');

const fileUploader = require('./file-uploader');

const butlerSignUp = require('./butler-sign-up');

const addImageForToDoItem = require('./add-images-for-todo-item');
const butlerEquipmentRequests = require('./butler-equipment-requests');

const butlerFeedbackAppeals = require('./butler-feedback-appeals/butler-feedback-appeals.service.js');
const visitModificationRequests = require('./visit-modification-requests/visit-modification-requests.service');
const butlerChurnsCustom = require('./butler-churns-custom/butler-churns-custom.service.js');
const butlerOverridePaySettings = require('./butlerOverridePaySettings');

const butlerAuthManagement = require('./butler-auth-management/butler-auth-management.service.js');
const allocationsWithExtraPay = require('./allocations-with-extra-pay/allocations-with-extra-pay.service.js');

const allocationCancellation = require('./allocation-cancellation/allocation-cancellation.service.js');
const butlerDisputes = require('./butler-disputes/butler-disputes.service.js');

const clientActiveButlers = require('./client-active-butlers/client-active-butlers.service');
const searchServices = require('./search-services/search-services.service');
const clientDetails = require('./client-details/client-details.service')


const churnedClientsForLeadPool = require('./churned-clients-for-lead-pool/churned-clients-for-lead-pool.service.js');
const butlerResetPassword = require('./butler-reset-password/butler-reset-password.service');
const clientResetPassword = require('./client-reset-password/client-reset-password.service');
const butlerTeams = require('./butler-teams/butler-teams.service.js');

const serviceLogs = require('./service-logs/service-logs.service.js');

const butlerAndButlerTeams = require('./butler-and-butler-teams/butler-and-butler-teams.service.js');

const butlerTeamsAdministrators = require('./butler-teams-administrators/butler-teams-administrators.service.js');
const notifyNearByButlers = require('./notify-nearby-butler/notify-nearby-butler.service');
const currentGeoLocation = require('./current-geo-location/current-geo-location.service');

const bultersFirstVisit = require('./bulters-first-visit/bulters-first-visit.service');
const nearByButlersVisit = require('./near-by-butlers-visit/near-by-butlers-visit.service');
const getButlersNearLocation = require('./get-butlers-near-location/get-butlers-near-location.service');
const getButlersNearVisit = require('./get-butlers-near-visit/get-butlers-near-visit.service');


module.exports = function() {
  const app = this; // eslint-disable-line no-unused-vars

  app.configure(butlerBankAccounts);
  app.configure(clientValueSettings);
  app.configure(userIdentities);
  app.configure(butlers);
  app.configure(clientSchedules);
  app.configure(addImageForToDoItem);
  app.configure(butlerRatings);
  app.configure(recalculateChurnsPerClientRatings);
  app.configure(churnPerClientSettings);
  app.configure(clients);
  app.configure(getMultipleClientInvoiceSettings);
  app.configure(butlerVisits);
  app.configure(operators);
  app.configure(publicReviews);
  app.configure(butlerVisitCheckinStatus);
  app.configure(workBlocks);
  app.configure(workDays);
  app.configure(visitPlansStartingOnDate);
  app.configure(clientToDoItems);
  app.configure(operatorsToDoItems);
  app.configure(clientToDoItemPictures);
  app.configure(butlerAddresses);
  app.configure(services);
  app.configure(searchServices);
  app.configure(fileUploader);
  app.configure(serviceAddresses);
  app.configure(googleClients);
  app.configure(facebookClients);
  app.configure(uploadButlerPoliceCheck);
  app.configure(uploadButlerResume);
  app.configure(butlerSignUp);
  app.configure(butlerBankDetails);
  app.configure(feedbackSettings);
  app.configure(enrollButler);
  app.configure(serviceButlers);
  app.configure(visitPlans);
  app.configure(allocationSettings);
  app.configure(allocationLogs);
  app.configure(serviceCallHistory);
  app.configure(recalculateAllButlersActiveClients);
  app.configure(visits);
  if (!process.env.FAST_DEV_MODE){
    app.configure(schedules);
    app.configure(serviceLogs);
    app.configure(butlerTeams);
    app.configure(butlerAndButlerTeams);
    app.configure(butlerTeamsAdministrators);
  }
  app.configure(bultersFirstVisit);
  app.configure(allocations);
  app.configure(managedSchedule);
  app.configure(rankedButlers);
  app.configure(authManagement);
  app.configure(servicePauses);
  app.configure(legacyAllocs);
  app.configure(requestedVisits);
  app.configure(legacyItems);
  app.configure(serviceExpenses);
  app.configure(serviceChurns);
  app.configure(churnCategories);
  app.configure(recalculateRatings);
  app.configure(tasks);
  app.configure(mailer);
  app.configure(butlerSkills);
  app.configure(serviceTasks);
  app.configure(butlerPauses);
  app.configure(serviceHandovers);
  app.configure(serviceChurnRisks);
  app.configure(serviceFeedback);
  app.configure(serviceButlerNoShow);
  app.configure(serviceReschedule);
  app.configure(serviceInvoicing);
  app.configure(serviceInvoices);
  app.configure(serviceMailInvoices);
  app.configure(serviceMarketing);
  app.configure(serviceExcludedButlers);
  app.configure(butlerChurns);
  app.configure(butlerChurnCategories);
  app.configure(serviceButlerChurnCategories);
  app.configure(newChurnCategories);
  app.configure(butlerStrikes);
  app.configure(butlerStrikeCategories);
  app.configure(butlerChurnsCustom);
  app.configure(butlerEquipmentRequests);
  app.configure(butlerFeedbackAppeals);
  app.configure(visitModificationRequests);
  app.configure(butlerOverridePaySettings);
  app.configure(require('./visits-with-furthest-recurrence/visits-with-furthest-recurrence.service'));
  app.configure(require('./calculate-service-creation-date/calculate-service-creation-date.service'));
  app.configure(require('./email-logs'));
  app.configure(allocationCancellation);
  app.configure(require('./download-butler-invoices/download-butler-invoices.service'));
  app.configure(butlerAuthManagement);
  app.configure(clientActiveButlers);
  app.configure(butlerDisputes);
  app.configure(allocationsWithExtraPay);
  app.configure(churnedClientsForLeadPool);
  app.configure(butlerResetPassword);
  app.configure(clientResetPassword);
  app.configure(butlerTeams);
  app.configure(butlerAndButlerTeams);
  app.configure(butlerTeamsAdministrators);
  app.configure(serviceLogs);
  app.configure(clientDetails);
  app.configure(notifyNearByButlers);
  app.configure(currentGeoLocation);
  app.configure(nearByButlersVisit);
  app.configure(getButlersNearLocation);
  app.configure(getButlersNearVisit);
};
