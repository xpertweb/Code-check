const { LocalDate } = require('js-joda');

module.exports = {
  butlers: {
    name: 'butlers',
    store: {
      '1': {
        id: 1,
        hasCar: true,
        firstName: 'John'
      },
      '2': {
        id: 2,
        hasCar: true,
        firstName: 'Jane'
      }
    }
  },
  workDays: {
    name: 'workDays',
    store: {
      '1': {
        butlerId: 1,
        date: LocalDate.parse('2017-05-01'),
        windowStartTime: '08:00:00',
        windowEndTime: '12:00:00',
        butlerAddressId: 1,
        butlerAddressGeopoint: { lat: 0.1, lng: 0.1 }
      },
      '2': {
        butlerId: 1,
        date: LocalDate.parse('2017-05-08'),
        windowStartTime: '09:00:00',
        windowEndTime: '14:00:00',
        butlerAddressId: 2,
        butlerAddressGeopoint: { lat: 0.0, lng: 0.0 }
      },
      '3': {
        butlerId: 2,
        date: LocalDate.parse('2017-05-02'),
        windowStartTime: '12:00:00',
        windowEndTime: '17:00:00',
        butlerAddressId: 3,
        butlerAddressGeopoint: { lat: 0.0, lng: 0.0 }
      }
    }
  },
  visits: {
    name: 'visits',
    store: {
      '1': {
        id: 1,
        serviceId: 1,
        serviceAddressId: 1,
        visitPlanId: 10,
        butlerId: 1,
        date: LocalDate.parse('2017-05-01'),
        duration: '01:00:00',
        windowStartTime: '10:00:00',
        windowEndTime: '12:00:00',
        geopoint: { lat: 1.1, lng: 1.1 }
      },
      '2': {
        id: 2,
        serviceId: 1,
        serviceAddressId: 2,
        visitPlanId: 10,
        butlerId: 1,
        date: LocalDate.parse('2017-05-08'),
        duration: '01:00:00',
        windowStartTime: '10:00:00',
        windowEndTime: '12:00:00',
        geopoint: { lat: 0.0, lng: 0.0 }
      },
      '3': {
        id: 3,
        serviceId: 1,
        serviceAddressId: 3,
        visitPlanId: 11,
        butlerId: 1,
        date: LocalDate.parse('2017-05-01'),
        duration: '02:00:00',
        windowStartTime: '08:00:00',
        windowEndTime: '12:00:00',
        geopoint: { lat: 0.0, lng: 0.0 }
      },
      '4': {
        id: 4,
        serviceId: 2,
        serviceAddressId: 4,
        visitPlanId: 12,
        butlerId: 2,
        date: LocalDate.parse('2017-05-02'),
        duration: '02:00:00',
        windowStartTime: '10:00:00',
        windowEndTime: '15:00:00',
        geopoint: { lat: 0.0, lng: 0.0 }
      },
      '5': {
        id: 5,
        serviceId: 2,
        serviceAddressId: 5,
        visitPlanId: 13,
        butlerId: 2,
        date: LocalDate.parse('2017-05-03'), // NOTE: No corresponding work day
        duration: '01:00:00',
        windowStartTime: '09:00:00',
        windowEndTime: '17:00:00',
        geopoint: { lat: 0.0, lng: 0.0 }
      }
    }
  }
   

}
