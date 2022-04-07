const { LocalDate } = require('js-joda');
// geopoint: {
//   x: 145.000113,
//   y: -37.889721
// }
// geopoint:{
//   x: 151.2558872,
//   y: -33.8924891
// }
// geopoint: {
//   "x": 144.999262,
//   "y": -37.816945
// }

module.exports = {
  butlers: {
    name: 'butlers',
    store: [{
      id: '001eb1e0-82c3-11e9-a539-9bae8522835a',
      hasCar: true,
      firstName: "Lucia",
    },{
      id: "00579dae-2df2-11ea-be41-a3c009a0f5e9",
      hasCar: true,
      firstName: "Pamela",
    },{
      id: '00578f9c-0798-11ea-b4b0-a7975c4bbb87',
      firstName: "Hitesh",
      hasCar: false,
    },{
      id: "005a8a0a-753e-11e8-8757-274876d8d6dd",
      firstName: "Fernanda7",
      hasCar: false,
    }]
  },
  workDays: {
    name: 'workDays',
    store: [{
      butlerId: '001eb1e0-82c3-11e9-a539-9bae8522835a',
      date: LocalDate.parse('2020-01-09'),
      windowStartTime: '08:00:00',
      windowEndTime: '11:00:00',
      butlerAddressGeopoint: {x: 145.000113, y: -37.889721}
    },{
      butlerId: '001eb1e0-82c3-11e9-a539-9bae8522835a',
      date: LocalDate.parse('2020-01-15'),
      windowStartTime: '09:00:00',
      windowEndTime: '14:00:00',
      butlerAddressGeopoint: {x: 1.1, y: 1.1}
    }]
  },
  visits: {
    name: 'visits',
    store: [{
      butlerId: '001eb1e0-82c3-11e9-a539-9bae8522835a',
      date: LocalDate.parse('2020-01-02'),
      duration: '01:00:00',
      windowStartTime: '10:00:00',
      windowEndTime: '12:00:00',
      geopoint: { lat: 1.1, lng: 1.1 }
    },{
      butlerId: '001eb1e0-82c3-11e9-a539-9bae8522835a',
      date: LocalDate.parse('2020-01-15'),
      duration: '01:00:00',
      windowStartTime: '10:00:00',
      windowEndTime: '12:00:00',
      geopoint: { lat: 0.0, lng: 0.0 }
    }]
  }
}