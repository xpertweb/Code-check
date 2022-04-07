const _ = require('lodash')
function visit_t(){
  return {
    id: 0,
    window_start_time: 0,
    window_end_time: 0,
    duration: 0, // double
    priority: 0,
  };
}

function anchored_visit_t(){
  return {
    visit: {
      id: 0,
      window_start_time: 0,
      window_end_time: 0,
      duration: 0, // double
      priority: 0,
    },
    travel_time_to_next:0, // double
    opt_time:0, // double
    window_start_time_slack:0, // double
    window_end_time_slack:0, // double
  };
}

function butler_work_day_t(){
  return {
    window_start_time:0, // double
    window_end_time:0, // double
  };
}

function schedule_t(num_visits){
  return {
    anchored_visits: fillArray(anchored_visit_t, num_visits),
    num_visits: num_visits,
    constraints_satisfied:0,
    cost: 0, // double
    efficiency: 0, // double
    butler_window_start_time_slack: 0, // double
    butler_window_end_time_slack: 0, // double
  };
}

function scheduleStruct(){
  return {
    anchored_visits: [],
    num_visits: 0,
    constraints_satisfied:0,
    cost: 0, // double
    efficiency: 0, // double
    butler_window_start_time_slack: 0, // double
    butler_window_end_time_slack: 0, // double
  };
}

function fillArray(f, len) {
  var arr = [];
  for (var i = 0; i < len; i++) {
    arr.push(f());
  }
  return arr;
}

module.exports = {
  visit_t,
  anchored_visit_t,
  butler_work_day_t,
  schedule_t,
  scheduleStruct,
  fillArray
};