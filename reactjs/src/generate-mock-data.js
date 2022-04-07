const faker = require('faker');
const _ = require('lodash');
const { LocalDate } = require('js-joda');

const getRandomStartTime = () => {
  const myArray = [
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
  ];
  const rand = Math.floor(Math.random() * myArray.length);
  return myArray[rand];
};

const getRandomComment = () => {
  const reviewComments = [
    'I really liked the service, washy washy clean very',
    'Bleh',
    'Boring',
    'The best!',
    'I enjoyed the thorough attention to the walls',
    'Sometimes it is best to do than not to do',
    'Washy clean so good!',
    'OMG!',
    'There is one once thing',
    'Washed it was, yoda says',
    'For one much to powerful will bring balance to the force',
    'Meh :(',
  ];
  const randComment = Math.floor(Math.random() * reviewComments.length);
  return reviewComments[randComment];
};

const getRandomLocation = () => {
  const myArray = [
    'Rosie Place',
    'Velvetia',
    'Rosalinda',
    'Perfeita',
    'Superflua',
    'Malevula',
    'Cenicienta',
    'Somareva',
    'Escaleta',
    'Ceberos',
    'Calacala',
    'Moubra',
  ];
  const rand = Math.floor(Math.random() * myArray.length);
  return myArray[rand];
};

async function createClient(app) {
  return app.service('clients').create({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: 'aa',
    phoneNumber: '0458661904',
    isVerified: true,
  });
}

async function createServce(app, client) {
  return app.service('services').create({
    clientId: client.id,
    genderPref: 'f',
    pets: true,
    errands: false,
    visitGuaranteed: false,
    clientRating: 0,
    clientLifetimeValue: 0,
    disinfectantRequired: true,
    carpetDryCleaningRequired: true,
  });
}

const createAllocButler = (app, email) => {
  return app.service('butlers').create({
    firstName: 'ALLOCATE',
    lastName: faker.name.lastName(),
    email: email,
    password: 'aa',
    phoneNumber: '0458661904',
    gender: 'm',
    rating: 5,
    onFreeze: false,
    handlesPets: false,
    hasCar: false,
    maxTravelDistance: 1000.0,
    disinfectantProvided: true,
    carpetDryCleaningProvided: true,
  });
};

const createButlerWithAllocations = async (app) => {
  let butler;
  try {
    butler = await createAllocButler(app, 'allocate1@gmail.com');
  } catch (e) {
    // running 2ed time create a new butler user
    butler = await createAllocButler(app, faker.internet.email().toLowerCase());
  }

  if (!butler){
    console.log('Error: Unable to create butler :(');
    return Promise.resolve({});
  }

  console.log('Created Butler With Allocation');
  console.log('Email: ', butler.email);
  console.log('Password: ', 'aa');

  for (var i = 0; i < 5; i++) {
    const client = await createClient(app);
    const service = await createServce(app, client);
    console.log('service id:', service.id);

    await app.service('serviceCallHistory').create({
      serviceId: service.id,
      unchurnAttemptComment: 'default value',
      firstVisitFollowUpCallComment: 'default value',
      debtorCallComment: 'wdebtor call test comment',
      unchurnAttempt: Math.random() >= 0.8, // random true or false ,
      firstVisitFollowUpCall: Math.random() >= 0.8,
      debtorCall: Math.random() >= 0.8,
    });

    await app.service('serviceInvoicing').create({
      serviceId: service.id,
      recipientName: client.firstName,
      recipientEmail: client.email,
      frequency: 'w',
      requiresTaxInvoice: Math.random() >= 0.8, // random true or false ,
      recipientNumber: client.phoneNumber,
      description: 'i want this for reasons',
      paymentMethod: 'directDebit',
    });

    await app.service('serviceExpenses').create({
      serviceId: service.id,
      date: LocalDate.now().toString(),
      amount: 30,
      summary: 'A summary',
    });

    await app.service('serviceButlers').create({
      serviceId: service.id,
      butlerId: butler.id,
      activeFrom: '2017-01-01',
    });

    await app.service('serviceAddresses').create({
      serviceId: service.id,
      line1: '98 Perry St',
      line2: '',
      locale: `${getRandomLocation()}`,
      state: 'VIC',
      country: 'Australia',
      postcode: '3078',
      activeFrom: '2017-05-01',
    });

    await app.service('butlerAddresses').create({
      butlerId: butler.id,
      line1: '92 FakeAddress St',
      line2: '',
      locale: 'Fairfield',
      state: 'VIC',
      country: 'Australia',
      postcode: '3078',
      activeFrom: '2017-05-01',
    });

    await app.service('visitPlans').create({
      serviceId: service.id,
      startDate: '2018-06-01',
      endDate: '2021-12-02',
      windowStartTime: `${getRandomStartTime()}:00:00`,
      windowEndTime: '19:00:00',
      duration: '01:00:00',
      recurrence: 'w',
    });
  }
};

const createButlersWithWorkBlock = async (app) => {
  for (var i = 0; i < 3; i++) {
    const butler = await app.service('butlers').create({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email().toLowerCase(),
      password: 'aa',
      phoneNumber: '0458661904',
      gender: 'f',
      rating: 5,
      onFreeze: false,
      handlesPets: true,
      hasCar: false,
      maxTravelDistance: 1000.0,
      disinfectantProvided: true,
      carpetDryCleaningProvided: true,
    });

    console.log('created new butler');
    console.log('Email:', butler.email);
    console.log('Password:', 'aa');


    await app.service('butlerAddresses').create({
      butlerId: butler.id,
      line1: '92 FakeAddressAllocation St',
      line2: '',
      locale: `${getRandomLocation()}`,
      state: 'VIC',
      country: 'Australia',
      postcode: '3078',
      activeFrom: '2017-05-01',
    });

    await app.service('workBlocks').create({
      butlerId: butler.id,
      startDate: '2017-10-18',
      windowStartTime: '01:00:00',
      windowEndTime: '22:00:00',
    });
  }
};


const createButlerDummyData = async (app) => {
  const butler = await app.service('butlers').create({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: 'aa',
    phoneNumber: '0458661904',
    gender: 'f',
    rating: 5,
    onFreeze: false,
    managedSchedule: Math.random() >= 0.5, // random true or false
    handlesPets: false,
    hasCar: false,
    maxTravelDistance: 1000.0,
  });

  console.log('created new butler');
  console.log('Email:', butler.email);
  console.log('Password:', 'aa');
  for (var i = 0; i < 5; i++) {
    const client = await createClient(app);
    const service = await createServce(app, client);
    console.log('service id', service.id);
    await app.service('serviceAddresses').create({
      serviceId: service.id,
      line1: '98 Perry St',
      line2: '',
      locale: `${getRandomLocation()}`,
      state: 'VIC',
      country: 'Australia',
      postcode: '3078',
      activeFrom: '2017-05-01',
    });

    await app.service('serviceCallHistory').create({
      serviceId: service.id,
      unchurnAttemptComment: 'default value',
      firstVisitFollowUpCallComment: 'default value',
      debtorCallComment: 'wdebtor call test comment',
      unchurnAttempt: Math.random() >= 0.8, // random true or false ,
      firstVisitFollowUpCall: Math.random() >= 0.8,
      debtorCall: Math.random() >= 0.8,
    });

    await app.service('serviceInvoicing').create({
      serviceId: service.id,
      recipientName: client.firstName,
      recipientEmail: client.email,
      frequency: 'w',
      requiresTaxInvoice: Math.random() >= 0.8, // random true or false ,
      recipientNumber: client.phoneNumber,
      description: 'i want this for reasons',
      paymentMethod: 'directDebit',
    });
    await app.service('serviceExpenses').create({
      serviceId: service.id,
      date: LocalDate.now().toString(),
      amount: 30,
      summary: 'A summary',
    });

    await app.service('serviceButlers').create({
      serviceId: service.id,
      butlerId: butler.id,
      activeFrom: '2017-01-01',
    });

    await app.service('serviceFeedback').create({
      score: Math.floor(Math.random() * 5), //random value between 3 and 5
      visitDate: LocalDate.now().toString(),
      butlerId: butler.id,
      serviceId: service.id,
      creationDate: LocalDate.now().toString(),
      comment: getRandomComment(),
      doNotShareFeedbackWithButler: false,
    });

    const clientToDoItem = await app.service('clientToDoItems').create({
      summary: 'Washy washy clean please',
      clientId: client.id,
    });

    await app.service('clientToDoItemPictures').create({
      imageUrl:
        'https://s3-ap-southeast-2.amazonaws.com/images.getjarvis.com.au/54e598d3289987aa55a1e84dd78fd44fbe11d3e6e4cc2b877fdf9f61de6d7909.jpeg',
      clientToDoItemId: clientToDoItem.id,
    });

    await app.service('visitPlans').create({
      serviceId: service.id,
      startDate: LocalDate.now().toString(),
      endDate: '2021-12-02',
      windowStartTime: `${getRandomStartTime()}:00:00`,
      windowEndTime: '19:00:00',
      duration: '01:00:00',
      recurrence: 'w',
    });
  }
};

module.exports = async function (app) {
  console.log('---------------------------');
  console.log('created Butler with Dummy Data');
  await createButlerDummyData(app);

  // create fake allocate user to mimic allocations behaviour
  console.log('created Butler with Allocation');
  await createButlerWithAllocations(app);

  console.log('created Butler with Work Block');
  await createButlersWithWorkBlock(app);
  console.log('---------------------------');
};
