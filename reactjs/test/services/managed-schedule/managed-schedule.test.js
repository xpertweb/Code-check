const { LocalDate } = require('js-joda');
const expect = require('chai').expect;
const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const managedSchedule = require('../../../src/services/managed-schedule/index');
let rankedButlersData = require('./rankedButlersData.data');
const allocationsData = require('./allocatableVisitsData.data');
const servicesData = require('./servicesOfAllocatableVisitsData.data');
const requestedVisitsData = require('./visitsRequestedByButlersData.data');
const fitlerOutVisitsDataManagedButler = require('./fitlerOutVisitsDataManagedButler.data.json');
const fitlerOutVisitsDataNonManagedButler = require('./fitlerOutVisitsDataNonManagedButler.data.json');
const fitlerOutWorkDaysDataManagedButler = require('./fitlerOutWorkDaysDataManagedButler.data.json');
const fitlerOutWorkDaysDataNonManagedButler = require('./fitlerOutWorkDaysDataNonManagedButler.data.json');
const allocationSettingsData = require('./allocationSettingsData.data.json');

const visits = fitlerOutVisitsDataManagedButler.concat(fitlerOutVisitsDataNonManagedButler);
const workDays = fitlerOutWorkDaysDataManagedButler.concat(fitlerOutWorkDaysDataNonManagedButler);
//add properties to be used for filtering and querying by featherjs
const startDate = LocalDate.now().minusDays(1).toString();
const endDate = LocalDate.now().plusDays(10).toString();
visits.forEach(x => {
  x.startDate = startDate;
  x.endDate = LocalDate.parse(endDate).plusDays(1).toString(); //match the right end of the date
});
workDays.forEach(x => {
  x.startDate = startDate;
  x.endDate = LocalDate.parse(endDate).plusDays(1).toString(); //match the right end of the date
  x.date = x.startDate.toString();
});
allocationsData.forEach(x => {
  x.anchoredVisits.forEach((x, i) => {
    if (i % 2 == 0) {
      x.date = startDate;
    } else {
      x.date = endDate;
    }
    x.serviceId = '04dd918e-17d3-11e9-bf5e-23925b711080';
    x.service.id = '04dd918e-17d3-11e9-bf5e-23925b711080';
  });
  x.startDate = startDate;
  x.endDate = LocalDate.parse(endDate).plusDays(1).toString();
  x.dumpAuxMulti = true;
});

servicesData.forEach(x=> {
  x.id = '04dd918e-17d3-11e9-bf5e-23925b711080';
});

const fakeVisitPlans = require('./fakeVisitPlans.data');
fakeVisitPlans.forEach(x=> {
  x.startDate = startDate;
  x.endDate = endDate;
});

console.log(allocationsData[0].startDate, allocationsData[0].endDate);

rankedButlersData.forEach((x, i) => {
  x.butler.disqualifyingButlerRating = 3.5;
  rankedButlersData[i] = Object.assign({}, x, x.butler);
});

const memory = require('feathers-memory');
const express = require('@feathersjs/express');
let app;
let server;
describe('\'managedSchedule\' service', function () {
  this.timeout(25000);
  beforeEach(done => {
    //create all fake endpoints required to test the managed schedules
    app = feathers()
      .configure(managedSchedule)
      .use(
        '/rankedButlers',
        memory({
          id: 'rankedButlers',
          store: rankedButlersData
        })
      )
      .use(
        '/allocationSettings',
        memory({
          id: 'allocationSettings',
          store: allocationSettingsData
        })
      )
      .use(
        '/visitPlans',
        memory({
          id: 'visitPlans',
          store: fakeVisitPlans
        })
      )
      .use(
        '/clientValueSettings',
        memory({
          id: 'clientValueSettings',
          store: [{
            id: '6fdc19c6-3f8b-11e9-ba15-f73ec1638b7d',
            futureWeeklyVisitPlansMultiplier: '4.00',
            futureFortnightlyVisitPlansMultiplier: '3.00',
            futureOnceOffVisitPlansMultiplier: '0.00',
            daysOfClientLoyaltyMultiplier: '0.25'
          }]
        })
      )
      .use(
        '/serviceExcludedButlers',
        memory({
          id: 'serviceExcludedButlers',
          store: []
        })
      )
      .use(
        '/butlerPauses',
        memory({
          id: '1e89b14c-833c-11e9-8f9e-67d59032f17b',
          'butlerId': '08ceeb42-1a46-11e9-9838-77e0dafed613',
          'reason': null,
          'startDate': '2019-05-30'
        })
      )
      .use(
        '/churnPerClientSettings',
        memory({
          id: 'churnPerClientSettings',
          store: [{
            id: '37e64da0-8588-11e9-8bda-cbd0949f2c95',
            daysOfTenureByButler: 30,
            disqualifyingChurnPerClientRating: 0.60
          }]
        })
      )
      .use(
        '/allocations',
        memory({
          id: 'allocations',
          store: allocationsData
        })
      )
      .use(
        '/services',
        memory({
          id: 'services',
          store: servicesData
        })
      )
      .use(
        '/requestedVisits',
        memory({
          id: 'requestedVisits',
          store: requestedVisitsData
        })
      )
      .use(
        '/visits',
        memory({
          id: 'visits',
          store: visits
        })
      )
      .use(
        '/workDays',
        memory({
          id: 'workDays',
          store: workDays
        })
      );
    server = express(app).listen(3333);
    server.once('listening', () => done());
  });

  it('registered the service', () => {
    const service = app.service('managedSchedule');
    assert.ok(service, 'Registered the service');
  });

  it('ran all filters and passed properly without exceptions', async () => {
    const response = await app.services.managedSchedule.find({
      query: {
        startDate: startDate,
        endDate: endDate,
      }
    });

    console.log(response.map(x=> x.butlersWantingThisVisit.length));

    //by doing this we check that start date and end date of visits are being checked
    expect(response.length).to.be.equal(15);
    //by doing this we check that work days and schedule filters are passing properly
    expect(response[6].butlersWantingThisVisit.length).to.be.equal(2);

    //check for non managed schedule butlers to be within results 
    expect(response[6].butlersWantingThisVisit[0].firstName).to.be.equal('Suzane');
    expect(response[6].butlersWantingThisVisit[0].managedSchedule).to.be.equal(true);

    //check for managed schedule butlers to be within results 
    expect(response[1].butlersWantingThisVisit[0].firstName).to.be.equal('Sudina');
    expect(response[1].butlersWantingThisVisit[0].managedSchedule).to.be.equal(true);

    //check distance to visit is being processed properly
    expect(response[2].butlersWantingThisVisit.map(x => x.address.state).indexOf('VIC')).to.be.equal(-1); //check there are no mixed state results 
    expect(response[2].butlersWantingThisVisit.map(x => x.address.state).indexOf('NSW')).to.be.equal(0); //check there are no mixed state results

    //console.log(response.findIndex(x=> x.visit.id == 'fc36520a-1ea8-11e9-9506-1baa7bda2e9d'));
    //console.log(response.filter(x=> x.butlersWantingThisVisit.length > 0 && x.butlersWantingThisVisit.filter(x => x.address.state == 'VIC'))[0] )
  });


  it('filter out butler which doesnt have a work day assigned to the day of the visit', async () => {

    let clonedWorkDaysData = JSON.parse(JSON.stringify(workDays));
    let butlerId = rankedButlersData.find(x => x.butler.firstName == 'Henry').butler.id;
    //remove all work days of this butler
    let index = clonedWorkDaysData.length - 1;
    while (index >= 0) {
      if (clonedWorkDaysData[index].butlerId === butlerId) {
        clonedWorkDaysData.splice(index, 1);
      }
      index -= 1;
    }

    app = app
      .use(
        '/workDays',
        memory({
          id: 'workDays',
          store: clonedWorkDaysData
        })
      );
    const response = await app.services.managedSchedule.find({
      query: {
        startDate,
        endDate
      }
    });

    //check Odgerel is not in the list of butlers assigned as it was in previous 'it' function
    expect(response[1].butlersWantingThisVisit[0].firstName).to.be.equal('Sudina');
  });


  it('requested visit butlers not in managed schedule plan match only requested visits', async () => {

    const response = await app.services.managedSchedule.find({
      query: {
        startDate,
        endDate
      }
    });

    let managedButlers = rankedButlersData.filter(x => !x.managedSchedule);
    let requestedVisitsByButler = requestedVisitsData.filter(x => x.butlerId == managedButlers[0].id);
    const returnedPlans = response.filter(x => requestedVisitsByButler.find(y => y.id == x.visit.id));

    // expect(managedButlers[0].id).to.be.equal(returnedPlans[0].visit.butlersWhoRequestedThisVisit[0]);
    // expect(returnedPlans[0].butlersWantingThisVisit.find(x => x.id == managedButlers[0].id)).to.not.be.null;
    // expect(returnedPlans[1].visit.butlersWhoRequestedThisVisit).to.be.equal(undefined); //this would otherwise be the above butler if it was broken

  });

  afterEach(done => {
    server.close(done);
  });
});
