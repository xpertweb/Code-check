const header = require('./header');
const {roundFloat} = require('./helper');
const _ = require('lodash');
const LinearProgram = require('./linear-program');

const LPI_STATUS_FAIL = 0;
const LPI_STATUS_BUILT = 1;
const LPI_STATUS_SOLVED = 2;
const LPI_STATUS_SOLVE_FAIL = 3;

const LE = 1; // Less than or equal (<=)
const EQ = 3; // Equal (=)
const GE = 2; // Greater than or equal (>=)

const BUTLER_BROKEN_WINDOW_PENALTY = 10000.0;

// https://github.com/LarryBattle/YASMIJ.js/
// https://github.com/smremde/node-lp_solve


const OPTIMAL = 0;
const SEVERE = 2;
const FULL = 6;


function build_sch_lp(num_visits) {
  const lpi = {
    status:0,
    lp: {},
    num_visits:0,
    num_lower_bounds:0,
    num_upper_bounds:0,
    num_vars:0,
    num_constraints:0,
  };
  // no alternative
  lpi.status = LPI_STATUS_FAIL;

  init_sch_lp_model(lpi, num_visits, num_visits + 1, num_visits + 1);
  if (!lpi.lp) {
    return lpi;
  }

  for (let i = 0; i < num_visits; i++) {
    /* Lower/upper window bounds for visit */
    __init_sch_lp_lower_bound_constraint(lpi, i, i);
    __init_sch_lp_upper_bound_constraint(lpi, i, i);

    /* Keep this and next visit separated (butler cannot be in two places!) */
    if (i < num_visits - 1) {
      __init_sch_lp_consec_constraint(lpi, i);
    }
  }

  /* Butler lower and upper bound constraints (only consider first/last visits)
   * This is an additional bound we're adding, so the bound index is the
   * one after the last standard visit bound index */
  let bound_idx = num_visits;
  let first_visit_idx = 0;
  let last_visit_idx = num_visits - 1;

  __init_sch_lp_lower_bound_constraint(lpi, first_visit_idx, bound_idx);
  __init_sch_lp_upper_bound_constraint(lpi, last_visit_idx, bound_idx);

  /* Set up optimization function */
  lpi.lp.lprec.set_minim()
  lpi.status = LPI_STATUS_BUILT;
  return lpi;
}

function init_sch_lp_model(lpi, num_visits, num_lower_bounds, num_upper_bounds) {
  lpi.num_visits = num_visits;
  lpi.num_lower_bounds = num_lower_bounds;
  lpi.num_upper_bounds = num_upper_bounds;
  lpi.num_vars = num_visits + num_lower_bounds + num_upper_bounds;
  lpi.num_constraints = lpi.num_vars - 1;  

  
  // custom block
  lpi.lp = new LinearProgram(lpi.num_constraints, lpi.num_vars);
  // http://lpsolve.sourceforge.net/5.5/set_verbose.htm
  lpi.lp.lprec.set_verbose(SEVERE);
  lpi.lp.lprec.set_presolve(0, 0);
}




function __sch_lp_pop_vars(lpi, schedule) {
  const row = [];
  lpi.lp.lprec.get_variables(row);
  for (let i = 0; i < lpi.num_visits; i++) {
    schedule.anchored_visits[i].opt_time = row[i];
    schedule.anchored_visits[i].window_start_time_slack = row[lpi.num_visits + i];
    schedule.anchored_visits[i].window_end_time_slack = row[lpi.num_visits + lpi.num_lower_bounds + i];
  }

  schedule.butler_window_start_time_slack = row[lpi.num_visits + lpi.num_lower_bounds - 1];
  schedule.butler_window_end_time_slack = row[lpi.num_visits + lpi.num_lower_bounds + lpi.num_upper_bounds - 1];

  /* Add on duration of last visit to cost - cost should be the difference
   * between the start time of the first visit and end time of the last visit.
   * The addition here makes sure it is the end time of the last visit, not
   * the start time of the last visit. */
  let last_visit_duration = schedule.anchored_visits[lpi.num_visits - 1].visit.duration;
  schedule.cost = lpi.lp.lprec.get_objective() + last_visit_duration;
}

function solve_sch_lp(lpi, schedule, b_start_time, b_end_time) {
  if (lpi.status === LPI_STATUS_FAIL) {    
    return;
  }

  /* Set actual parameters for this particular schedule. See build_sch_lp func
   * above for more details on each constraint */
  for (let i = 0; i < lpi.num_visits; i++) {
    let visit = schedule.anchored_visits[i].visit;   

    __set_sch_lp_lower_bound_constraint_val(lpi, i, visit.window_start_time);
    __set_sch_lp_upper_bound_constraint_val(lpi, i, visit.window_end_time - visit.duration);

    if (i < lpi.num_visits - 1) {
      __set_sch_lp_consec_constraint_val(lpi, i, visit.duration + schedule.anchored_visits[i].travel_time_to_next);
    }
  }

  /* Butler work window */
  const lastVisit = schedule.anchored_visits[lpi.num_visits - 1];
  __set_sch_lp_lower_bound_constraint_val(lpi, lpi.num_visits, b_start_time);
  __set_sch_lp_upper_bound_constraint_val(lpi, lpi.num_visits, b_end_time - lastVisit.visit.duration);


  let weights = [];
  for (let i = 0; i < lpi.num_visits; i++) {
    // tested
    weights[i] = Math.pow(2.0, 14.0 - schedule.anchored_visits[i].visit.priority);
  }
  weights[lpi.num_visits] = BUTLER_BROKEN_WINDOW_PENALTY;
  __set_sch_lp_obj_weights(lpi, weights, weights);  
  const result = lpi.lp.lprec.solve();
  if (result == OPTIMAL) {
    lpi.status = LPI_STATUS_SOLVED;    
    __sch_lp_pop_vars(lpi, schedule)
  } else {
    // console.log('FAILED TO GENERATE LP SOL:', result);
    lpi.status = LPI_STATUS_SOLVE_FAIL;
  }
}


// Tested
function __sch_lp_set_constraint(lpi, const_idx, const_type, num_vars, ...args) {
  let vars_idxs = [];
  let coeffs = [];

  const _args = _.chunk(args, num_vars);
  for (let i = 0; i < num_vars; i++) {
    const [first, sec] = _args[i];
    vars_idxs[i] = first + 1;
    coeffs[i] = sec;
  }

  // const_type
  // LE (1)  Less than or equal (<=)
  // EQ (3)  Equal (=)
  // GE (2)  Greater than or equal (>=)
  // FR (0)  Free
  lpi.lp.lprec.set_rowex(const_idx + 1, num_vars, coeffs, vars_idxs);
  lpi.lp.lprec.set_constr_type(const_idx + 1, const_type);
}

// tested
function __sch_lp_set_constraint_val(lpi, const_idx, value) {
  // http://lpsolve.sourceforge.net/5.5/set_rh.htm
  lpi.lp.lprec.set_rh(const_idx + 1, value);
}

function __init_sch_lp_lower_bound_constraint(lpi, visit_idx, lower_bound_idx) {
  let offset = lpi.num_visits;
  let const_lower_bound_idx = (offset - 1) + lower_bound_idx;
  let var_visit_start_time_idx = visit_idx;
  let var_visit_lower_bound_slack_idx = offset + lower_bound_idx;

  __sch_lp_set_constraint(lpi, const_lower_bound_idx, GE, 2,
    var_visit_start_time_idx, 1.0,
    var_visit_lower_bound_slack_idx, 1.0
  );
}

function __set_sch_lp_lower_bound_constraint_val(lpi, lower_bound_idx, value) {
  let offset = lpi.num_visits;
  let const_lower_bound_idx = (offset - 1) + lower_bound_idx;
  __sch_lp_set_constraint_val(lpi, const_lower_bound_idx, value);
}

function __init_sch_lp_upper_bound_constraint(lpi, visit_idx, upper_bound_idx) {
  let offset = (lpi.num_visits + lpi.num_lower_bounds);
  let const_upper_bound_idx = (offset - 1) + upper_bound_idx;
  let var_visit_start_time_idx = visit_idx;
  let var_visit_upper_bound_slack_idx = offset + upper_bound_idx;

  __sch_lp_set_constraint(lpi, const_upper_bound_idx, LE, 2,
    var_visit_start_time_idx, 1.0,
    var_visit_upper_bound_slack_idx, -1.0
  );
}

function __set_sch_lp_upper_bound_constraint_val(lpi, upper_bound_idx, value) {
  let offset = (lpi.num_visits + lpi.num_lower_bounds);
  let const_upper_bound_idx = (offset - 1) + upper_bound_idx;
  __sch_lp_set_constraint_val(lpi, const_upper_bound_idx, value);
}

function __init_sch_lp_consec_constraint(lpi, visit_idx) {
  let const_consec_idx = visit_idx;
  let var_visit_start_time_idx = visit_idx;
  let var_next_visit_start_time_idx = visit_idx + 1;

  __sch_lp_set_constraint(lpi, const_consec_idx, GE, 2,
    var_next_visit_start_time_idx, 1.0,
    var_visit_start_time_idx, -1.0
  );
}

function __set_sch_lp_consec_constraint_val(lpi, visit_idx, value) {
  let const_consec_idx = visit_idx;
  __sch_lp_set_constraint_val(lpi, const_consec_idx, value);
}


// tested
function __set_sch_lp_obj_weights(lpi, lower_bound_weights, upper_bound_weights) {
  let col_bounds_offset = lpi.num_visits + 1;
  let num_weights = lpi.num_lower_bounds + lpi.num_upper_bounds;
  let num_cols_updated = num_weights + 2;
  let tmp_row = [];
  let tmp_row_cmap = [];

  for (let i = 0; i < num_weights; i++) {
    let col = col_bounds_offset + i;
    if (i < lpi.num_lower_bounds) {
      tmp_row[i] = lower_bound_weights[i];
    } else {
      tmp_row[i] = upper_bound_weights[i - lpi.num_lower_bounds];
    }
    tmp_row_cmap[i] = col;
  }

  /* Common optimization function coeffs (last visit - first visit) */
  tmp_row[num_weights] = -1.0;
  tmp_row[num_weights + 1] = 1.0;
  tmp_row_cmap[num_weights] = 1;
  tmp_row_cmap[num_weights + 1] = lpi.num_visits;
  // http://lpsolve.sourceforge.net/5.1/set_obj_fn.htm
  lpi.lp.lprec.set_obj_fnex(tmp_row.length, tmp_row, tmp_row_cmap);
}


module.exports = {
  build_sch_lp,
  solve_sch_lp
}