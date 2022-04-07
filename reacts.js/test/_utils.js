const faker = require('faker');
const knexCleaner = require('knex-cleaner');         

// Utility functions for tests

export const cleanDb = app => {
  const knex = app.get('knexClient');

  return knexCleaner.clean(knex, {
    mode: 'truncate',
    ignoreTables: ['knex_migrations', 'knex_migrations_lock']
  });
};

export const mockClient = (firstName, lastName) => {
  return {
    firstName: firstName || 'John',
    lastName: lastName || 'Doe',
    email: faker.internet.email(),
    password: 'aa',
    phoneNumber: '9999999999'
  };
};

export const mockButler = (firstName, lastName) => {
  return {
    firstName: firstName || 'John',
    lastName: lastName || 'Doe',
    email: faker.internet.email(),
    password: 'aa',
    phoneNumber: '0458661904',
    gender: 'm',
    rating: 5,
    onFreeze: false,
    handlesPets: false,
    hasCar: false,
    maxTravelDistance: 1000.0
  };
};

export const mockService = clientId => {
  return {
    clientId: clientId,
    genderPref: 'f',
    pets: true,
    errands: false,
    visitGuaranteed: false,
    clientRating: 0,
    clientLifetimeValue: 0
  };
};

export const mockServicePause = (serviceId, startDate, endDate) => {
  return {
    serviceId: serviceId,
    startDate: startDate,
    endDate: endDate
  };
};

export const mockServiceButler = (serviceId, butlerId, activeFrom) => {
  return {
    serviceId: serviceId,
    butlerId: butlerId,
    activeFrom: activeFrom
  };
};

export const mockServiceAddress = (serviceId, activeFrom) => {
  return {
    serviceId: serviceId,
    line1: 'Street',
    line2: '',
    locale: 'Suburb',
    state: 'VIC',
    country: 'Australia',
    postcode: '3000',
    activeFrom: activeFrom
  };
};

export const mockButlerAddress = (butlerId, activeFrom) => {
  return {
    butlerId: butlerId,
    line1: 'Street',
    line2: '',
    locale: 'Suburb',
    state: 'VIC',
    country: 'Australia',
    postcode: '3000',
    activeFrom: activeFrom
  };
};

export const mockVisitPlan = (
  serviceId,
  recurrence,
  startDate,
  endDate,
  windowStartTime,
  windowEndTime,
  duration
) => {
  return {
    serviceId: serviceId,
    startDate: startDate,
    endDate: endDate,
    windowStartTime: windowStartTime || '09:00:00',
    windowEndTime: windowEndTime || '15:00:00',
    duration: duration || '01:00:00',
    recurrence: recurrence
  };
};

export const mockWorkBlock = (
  butlerId,
  startDate,
  endDate,
  windowStartTime,
  windowEndTime
) => {
  return {
    butlerId: butlerId,
    startDate: startDate,
    endDate: endDate,
    windowStartTime: windowStartTime || '09:00:00',
    windowEndTime: windowEndTime || '15:00:00'
  };
};
