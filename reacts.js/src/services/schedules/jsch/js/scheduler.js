const header = require('./header');
const {roundFloat} = require('./helper');
const _ = require('lodash');

const { 
  build_sch_lp, 
  solve_sch_lp 
} = require('./lp-builder');

const EPSILON = 0.00001;
const LPI_STATUS_FAIL = 0;
const LPI_STATUS_BUILT = 1;
const LPI_STATUS_SOLVED = 2;
const LPI_STATUS_SOLVE_FAIL = 3;
const BUTLER_BROKEN_WINDOW_PENALTY = 10000.0;


// const DBL_MAX = 1.79769e+308;
const DBL_MAX = Number.MAX_VALUE;
const LP_SEVERE = 2; 

function lpi_t(){
  return {
    status:0,
    lp:undefined,
    num_visits:0,
    num_lower_bounds:0,
    num_upper_bounds:0,
    num_vars:0,
    num_constraints:0,
  };
}

function int_swap(a, b) {
  return [b, a];
}

function __permute(map, n, start, next_idx, permutations) {
  if (start == n - 1) {
    for (let i = 0; i < n; i++) {
      permutations[next_idx][i] = map[i];
    }
    return next_idx + 1;
  }

  for (let i = start; i < n; i++) {
    // replacement for int_swap
    const temp = map[start];
    map[start] = map[i];
    map[i] = temp;    
    next_idx = __permute(map, n, start + 1, next_idx, permutations);
    const temp2 = map[start];
    map[start] = map[i];
    map[i] = temp2;
  }
  return next_idx;
}


function get_num_permutations(n){
  let num_permutations = 1;
  for (let i = 1; i <= n; i++) {
    num_permutations = num_permutations * i;
  }

  return num_permutations;
}

function generate_permutations(n, num_permutations) {
  /* Alloc 2D array as a single continuous block */
  const permutations = [];
  for (let i = 0; i < num_permutations; i++) {
    permutations[i] = [];
  }

  const map = [];
  for (let i = 0; i < n; i++) {
    map.push(i);
  }
  __permute(map, n, 0, 0, permutations);
  return permutations;
}


function get_time_between(travel_time_matrix, size, A, B) {
  return travel_time_matrix[(A * size) + B];
}

function calc_efficiency(schedule) {
  let total_time = schedule.cost;
  let work_time = 0.0;
  for (let i = 0; i < schedule.num_visits; i++) {
    work_time += schedule.anchored_visits[i].visit.duration;
  }
  schedule.efficiency = work_time/total_time;
}

function calc_constraints_satisified(schedule) {
  schedule.constraints_satisfied = 1;
  for (let i = 0; i < schedule.num_visits; i++) {
    schedule.constraints_satisfied &= schedule.anchored_visits[i].window_start_time_slack < EPSILON;
    schedule.constraints_satisfied &= schedule.anchored_visits[i].window_end_time_slack < EPSILON;
  }
  schedule.constraints_satisfied &= schedule.butler_window_start_time_slack < EPSILON;
  schedule.constraints_satisfied &= schedule.butler_window_end_time_slack < EPSILON;
}

function d_copy_schedule(dst, src) {
  dst.num_visits = src.num_visits;
  dst.constraints_satisfied = src.constraints_satisfied;
  dst.cost = src.cost;
  dst.efficiency = src.efficiency;
  dst.butler_window_start_time_slack = src.butler_window_start_time_slack;
  dst.butler_window_end_time_slack = src.butler_window_end_time_slack;

  for (let i = 0; i < src.num_visits; i++) {
    // src.anchored_visits[i].visit.duration = roundFloat(src.anchored_visits[i].visit.duration);
    // src.anchored_visits[i].duration = roundFloat(src.anchored_visits[i].duration);
    // src.anchored_visits[i].travel_time_to_next = roundFloat(src.anchored_visits[i].travel_time_to_next);
    // src.anchored_visits[i].opt_time = roundFloat(src.anchored_visits[i].opt_time);
    // src.anchored_visits[i].window_start_time_slack = roundFloat(src.anchored_visits[i].window_start_time_slack);
    // src.anchored_visits[i].window_end_time_slack = roundFloat(src.anchored_visits[i].window_end_time_slack);
    dst.anchored_visits[i] = src.anchored_visits[i];
  }
}

function init_schedule(schedule, num_visits) {
  schedule.num_visits = num_visits;
  schedule.anchored_visits = [];

  for (var i = 0; i < num_visits; i++) {
    schedule.anchored_visits.push(header.anchored_visit_t())
  }
}

function populate_schedule(visits, butler, travel_time_matrix) {
  const num_visits = visits.length;
  const num_permutations = get_num_permutations(num_visits);
  const permutations = generate_permutations(num_visits, num_permutations);

  const schedules = [];
  for (var i = 0; i < num_permutations; i++) {
    schedules.push(header.scheduleStruct());
  }

  for (let i = 0; i < num_permutations; i++) {
    init_schedule(schedules[i], num_visits);
  }

  const lpi = build_sch_lp(num_visits);
  const num_locations = num_visits + 1; /* Extra location is the butler's house */

  let lowest_cost = DBL_MAX;
  let lowest_cost_idx = -1;
  for (let i = 0; i < num_permutations; i++) {
    for (let j = 0; j < num_visits; j++) {
      const visit_idx = permutations[i][j];      
      const visit = {...visits[visit_idx]};
      schedules[i].anchored_visits[j].visit = visit;

      if (j < num_visits - 1) {
        let next_visit_idx = permutations[i][j + 1];
        schedules[i].anchored_visits[j].travel_time_to_next =
          get_time_between(travel_time_matrix, num_locations, visit_idx, next_visit_idx);
      }
    }
    
    solve_sch_lp(lpi, schedules[i], butler.window_start_time, butler.window_end_time);

    /* Special case: if only one visit, then cost should be manually calculated
     * as simply the length of that visit (since the minimising function
     * behaves differently) */
    if (num_visits == 1) {
      schedules[i].cost = visits[0].duration;
    }

    /* Augment cost to include travel from butler house to first visit, and
     * travel from last visit back to butler house */
    let first_visit_idx = permutations[i][0];
    let last_visit_idx = permutations[i][num_visits - 1];
    let butler_idx = num_locations - 1; /* Last location is the butler location */

    schedules[i].cost = schedules[i].cost
          + get_time_between(travel_time_matrix, num_locations, first_visit_idx, butler_idx)
          + get_time_between(travel_time_matrix, num_locations, last_visit_idx, butler_idx);

    /* Calculate efficiency metric (work time / total time) */
    calc_efficiency(schedules[i]);

    /* Determine whether any constraints have been broken */
    calc_constraints_satisified(schedules[i]);

    /* Check if best schedule yet (given permutations so far)... */
    if (schedules[i].cost < lowest_cost) {
      lowest_cost = schedules[i].cost;
      lowest_cost_idx = i;
    }
  }
  
  return schedules[lowest_cost_idx];
  // d_copy_schedule(out, schedules[lowest_cost_idx]);
}


module.exports = {
  populate_schedule,
  init_schedule
};