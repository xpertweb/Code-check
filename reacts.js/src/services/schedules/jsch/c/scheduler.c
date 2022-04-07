#include <stdio.h>
#include <stdarg.h>
#include <float.h>
#include <lpsolve/lp_lib.h>
#include <math.h>
#include "scheduler.h"

//#define DEBUG

#define EPSILON 0.00001

#define LPI_STATUS_FAIL 0
#define LPI_STATUS_BUILT 1
#define LPI_STATUS_SOLVED 2
#define LPI_STATUS_SOLVE_FAIL 3

#define BUTLER_BROKEN_WINDOW_PENALTY 10000.0;


typedef struct {
  int status;
  lprec *lp;
  int num_visits;
  int num_lower_bounds;
  int num_upper_bounds;
  int num_vars;
  int num_constraints;
} lpi_t;

void __sch_lp_set_constraint(lpi_t *lpi, int const_idx, int const_type, int num_vars, ...) {
  va_list args;
  va_start(args, num_vars);

  int vars_idxs[num_vars];
  double coeffs[num_vars];

  for (int i = 0; i < num_vars; i++) {
    vars_idxs[i] = va_arg(args, int) + 1;
    coeffs[i] = va_arg(args, double);
  }

  set_rowex(lpi->lp, const_idx + 1, num_vars, coeffs, vars_idxs);
  set_constr_type(lpi->lp, const_idx + 1, const_type);
  va_end(args);
}

void __sch_lp_set_constraint_val(lpi_t *lpi, int const_idx, double value) {
  set_rh(lpi->lp, const_idx + 1, value);
}

void __init_sch_lp_model(lpi_t *lpi, int num_visits, int num_lower_bounds, int num_upper_bounds) {
  /*
  VARIABLES (COLUMNS):
  V1, V2 ... Vn | LBslack1, LBslack2, ... LBslackN | UBslack1, UBslack2, ... UBslackN
  */

  lpi->num_visits = num_visits;
  lpi->num_lower_bounds = num_lower_bounds;
  lpi->num_upper_bounds = num_upper_bounds;
  lpi->num_vars = num_visits + num_lower_bounds + num_upper_bounds;
  lpi->num_constraints = lpi->num_vars - 1; /* (num_visits - 1) consec visit constraints */
  lpi->lp = make_lp(lpi->num_constraints, lpi->num_vars);

#ifdef DEBUG
  for (int i = 0; i < num_visits; i++) {
    char buff[10];
    sprintf(buff, "Visit%d", i);
    set_col_name(lpi->lp, i + 1, buff);
  }

  for (int i = 0; i < num_lower_bounds; i++) {
    char buff[10];
    sprintf(buff, "LBSlack%d", i);
    set_col_name(lpi->lp, num_visits + i + 1, buff);
  }

  for (int i = 0; i < num_upper_bounds; i++) {
    char buff[10];
    sprintf(buff, "UBSlack%d", i);
    set_col_name(lpi->lp, num_visits + num_lower_bounds + i + 1, buff);
  }
#endif
  set_verbose(lpi->lp, SEVERE);
  set_presolve(lpi->lp, 0, 0);
}

void __init_sch_lp_lower_bound_constraint(lpi_t *lpi, int visit_idx, int lower_bound_idx) {
  int offset = lpi->num_visits;
  int const_lower_bound_idx = (offset - 1) + lower_bound_idx;
  int var_visit_start_time_idx = visit_idx;
  int var_visit_lower_bound_slack_idx = offset + lower_bound_idx;

  __sch_lp_set_constraint(lpi, const_lower_bound_idx, GE, 2,
    var_visit_start_time_idx, 1.0,
    var_visit_lower_bound_slack_idx, 1.0
  );
}

void __set_sch_lp_lower_bound_constraint_val(lpi_t *lpi, int lower_bound_idx, double value) {
  int offset = lpi->num_visits;
  int const_lower_bound_idx = (offset - 1) + lower_bound_idx;
  __sch_lp_set_constraint_val(lpi, const_lower_bound_idx, value);
}

void __init_sch_lp_upper_bound_constraint(lpi_t *lpi, int visit_idx, int upper_bound_idx) {
  int offset = (lpi->num_visits + lpi->num_lower_bounds);
  int const_upper_bound_idx = (offset - 1) + upper_bound_idx;
  int var_visit_start_time_idx = visit_idx;
  int var_visit_upper_bound_slack_idx = offset + upper_bound_idx;

  __sch_lp_set_constraint(lpi, const_upper_bound_idx, LE, 2,
    var_visit_start_time_idx, 1.0,
    var_visit_upper_bound_slack_idx, -1.0
  );
}

void __set_sch_lp_upper_bound_constraint_val(lpi_t *lpi, int upper_bound_idx, double value) {
  int offset = (lpi->num_visits + lpi->num_lower_bounds);
  int const_upper_bound_idx = (offset - 1) + upper_bound_idx;
  __sch_lp_set_constraint_val(lpi, const_upper_bound_idx, value);
}

void __init_sch_lp_consec_constraint(lpi_t *lpi, int visit_idx) {
  int const_consec_idx = visit_idx;
  int var_visit_start_time_idx = visit_idx;
  int var_next_visit_start_time_idx = visit_idx + 1;

  __sch_lp_set_constraint(lpi, const_consec_idx, GE, 2,
    var_next_visit_start_time_idx, 1.0,
    var_visit_start_time_idx, -1.0
  );
}

void __set_sch_lp_consec_constraint_val(lpi_t *lpi, int visit_idx, double value) {
  int const_consec_idx = visit_idx;
  __sch_lp_set_constraint_val(lpi, const_consec_idx, value);
}

void __init_sch_lp_obj(lpi_t *lpi) {
  set_minim(lpi->lp); /* Minimize objective function */
}

void __set_sch_lp_obj_weights(lpi_t *lpi, double *lower_bound_weights, double *upper_bound_weights) {
  int col_bounds_offset = lpi->num_visits + 1; /* Col is offset by one (for a given variable) */
  int num_weights = lpi->num_lower_bounds + lpi->num_upper_bounds;
  int num_cols_updated = num_weights + 2;
  REAL tmp_row[num_cols_updated];
  int tmp_row_cmap[num_cols_updated];

  for (int i = 0; i < num_weights; i++) {
    int col = col_bounds_offset + i;
    if (i < lpi->num_lower_bounds) {
      tmp_row[i] = lower_bound_weights[i];
    } else {
      tmp_row[i] = upper_bound_weights[i - lpi->num_lower_bounds];
    }
    tmp_row_cmap[i] = col;
  }

  /* Common optimization function coeffs (last visit - first visit) */
  tmp_row[num_weights] = -1.0;
  tmp_row[num_weights + 1] = 1.0;
  tmp_row_cmap[num_weights] = 1;
  tmp_row_cmap[num_weights + 1] = lpi->num_visits;

  set_obj_fnex(lpi->lp, num_cols_updated, tmp_row, tmp_row_cmap);
}

lpi_t *build_sch_lp(int num_visits) {
  lpi_t *lpi = (lpi_t*)malloc(sizeof(lpi_t));
  lpi->status = LPI_STATUS_FAIL;

  __init_sch_lp_model(lpi, num_visits, num_visits + 1, num_visits + 1);
  if (lpi->lp == NULL) {
    return lpi; /* Failed to init model */
  }

  for (int i = 0; i < num_visits; i++) {
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
  int bound_idx = num_visits;
  int first_visit_idx = 0;
  int last_visit_idx = num_visits - 1;

  __init_sch_lp_lower_bound_constraint(lpi, first_visit_idx, bound_idx);
  __init_sch_lp_upper_bound_constraint(lpi, last_visit_idx, bound_idx);

  /* Set up optimization function */
  __init_sch_lp_obj(lpi);

  lpi->status = LPI_STATUS_BUILT;
  return lpi;
}

void __sch_lp_pop_vars(lpi_t *lpi, schedule_t *schedule) {
  REAL row[lpi->num_vars];
  get_variables(lpi->lp, row);

  for (int i = 0; i < lpi->num_visits; i++) {
    schedule->anchored_visits[i].opt_time = row[i];
    schedule->anchored_visits[i].window_start_time_slack = row[lpi->num_visits + i];
    schedule->anchored_visits[i].window_end_time_slack = row[lpi->num_visits + lpi->num_lower_bounds + i];
  }

  schedule->butler_window_start_time_slack = row[lpi->num_visits + lpi->num_lower_bounds - 1];
  schedule->butler_window_end_time_slack = row[lpi->num_visits + lpi->num_lower_bounds + lpi->num_upper_bounds - 1];

  /* Add on duration of last visit to cost - cost should be the difference
   * between the start time of the first visit and end time of the last visit.
   * The addition here makes sure it is the end time of the last visit, not
   * the start time of the last visit. */
  double last_visit_duration = schedule->anchored_visits[lpi->num_visits - 1].visit->duration;
  schedule->cost = get_objective(lpi->lp) + last_visit_duration;
}

void solve_sch_lp(lpi_t *lpi, schedule_t *schedule, double b_start_time, double b_end_time) {
  if (lpi->status == LPI_STATUS_FAIL) {
    return;
  }

  /* Set actual parameters for this particular schedule. See build_sch_lp func
   * above for more details on each constraint */
  for (int i = 0; i < lpi->num_visits; i++) {
    visit_t *visit = schedule->anchored_visits[i].visit;

    __set_sch_lp_lower_bound_constraint_val(lpi, i, visit->window_start_time);
    __set_sch_lp_upper_bound_constraint_val(lpi, i, visit->window_end_time - visit->duration);

    if (i < lpi->num_visits - 1) {
      __set_sch_lp_consec_constraint_val(lpi, i, visit->duration + schedule->anchored_visits[i].travel_time_to_next);
    }
  }

  /* Butler work window */
  anchored_visit_t last_visit = schedule->anchored_visits[lpi->num_visits - 1];
  double last_visit_duration = last_visit.visit->duration;
  __set_sch_lp_lower_bound_constraint_val(lpi, lpi->num_visits, b_start_time);
  __set_sch_lp_upper_bound_constraint_val(lpi, lpi->num_visits, b_end_time - last_visit_duration);

  /* Set bounds weights for objective function - higher weights result in the
   * bounds associated with them being "stronger" (less likely to be broken) */
  double weights[lpi->num_visits + 1];
  for (int i = 0; i < lpi->num_visits; i++) {
    weights[i] = pow(2.0, 14.0 - schedule->anchored_visits[i].visit->priority);
  }
  weights[lpi->num_visits] = BUTLER_BROKEN_WINDOW_PENALTY;
  __set_sch_lp_obj_weights(lpi, weights, weights);

  /* Perform the actual computation */
  int result = solve(lpi->lp);

  /* Handle results of computation */
  if (result == OPTIMAL) {
    lpi->status = LPI_STATUS_SOLVED;
    __sch_lp_pop_vars(lpi, schedule);
  } else {
    printf("FAILED TO GENERATE LP SOL : code %d", result);
    lpi->status = LPI_STATUS_SOLVE_FAIL;
  }
}

void free_sch_lp(lpi_t *lpi) {
  delete_lp(lpi->lp);
  free(lpi);
}

void int_swap(int *a, int *b) {
  int tmp = *a;
  *a = *b;
  *b = tmp;
}

int __permute(int *map, int n, int start, int next_idx, int **permutations) {
  if (start == n - 1) {
    for (int i = 0; i < n; i++) {
      permutations[next_idx][i] = map[i];
    }
    return next_idx + 1;
  }

  for (int i = start; i < n; i++) {
    int_swap(map + start, map + i);
    next_idx = __permute(map, n, start + 1, next_idx, permutations);
    int_swap(map + start, map + i);
  }
  return next_idx;
}

int **generate_permutations(int n, int *num_permutations) {
  *num_permutations = 1;
  for (int i = 1; i <= n; i++) {
    *num_permutations *= i;
  }

  /* Alloc 2D array as a single continuous block */
  int **permutations = (int**)malloc((sizeof(int*) * *num_permutations) +
                                     (*num_permutations * n * sizeof(int)));
  int *block_start = (int*)(permutations + *num_permutations);
  for (int i = 0; i < *num_permutations; i++) {
    permutations[i] = block_start + (i * n);
  }
  int map[n];
  for (int i = 0; i < n; i++) {
    map[i] = i;
  }
  __permute(map, n, 0, 0, permutations);
  return permutations;
}

void init_schedule(schedule_t *schedule, int num_visits) {
  schedule->num_visits = num_visits;
  schedule->anchored_visits = (anchored_visit_t*)malloc(sizeof(anchored_visit_t) * num_visits);
}

void free_schedule(schedule_t *schedule) {
  free(schedule->anchored_visits);
}

void d_copy_schedule(schedule_t *dst, schedule_t *src) {
  dst->num_visits = src->num_visits;
  dst->constraints_satisfied = src->constraints_satisfied;
  dst->cost = src->cost;
  dst->efficiency = src->efficiency;
  dst->butler_window_start_time_slack = src->butler_window_start_time_slack;
  dst->butler_window_end_time_slack = src->butler_window_end_time_slack;
  for (int i = 0; i < src->num_visits; i++) {
    dst->anchored_visits[i] = src->anchored_visits[i];
  }
}

double get_time_between(double *travel_time_matrix, int size, int A, int B) {
  return *(travel_time_matrix + (A * size) + B);
}

void calc_efficiency(schedule_t *schedule) {
  double total_time = schedule->cost;
  double work_time = 0.0;
  for (int i = 0; i < schedule->num_visits; i++) {
    work_time += schedule->anchored_visits[i].visit->duration;
  }
  schedule->efficiency = work_time / total_time;
}

void calc_constraints_satisified(schedule_t *schedule) {
  schedule->constraints_satisfied = 1;
  for (int i = 0; i < schedule->num_visits; i++) {
    schedule->constraints_satisfied &= schedule->anchored_visits[i].window_start_time_slack < EPSILON;
    schedule->constraints_satisfied &= schedule->anchored_visits[i].window_end_time_slack < EPSILON;
  }
  schedule->constraints_satisfied &= schedule->butler_window_start_time_slack < EPSILON;
  schedule->constraints_satisfied &= schedule->butler_window_end_time_slack < EPSILON;
}

void populate_schedule(schedule_t *out, visit_t *visits, butler_work_day_t *butler, double *travel_time_matrix) {
  int num_visits = out->num_visits;
  int num_permutations;
  int **permutations = generate_permutations(num_visits, &num_permutations);

  schedule_t *schedules = (schedule_t*)malloc(sizeof(schedule_t) * num_permutations);
  for (int i = 0; i < num_permutations; i++) {
    init_schedule(schedules + i, num_visits);
  }

#ifdef DEBUG
  for (int i = 0; i < num_visits; i++) {
    printf("=====\n");
    printf("%d \n", visits[i].id);
    printf("%lf \n", visits[i].window_start_time);
  }
#endif

  lpi_t *lpi = build_sch_lp(num_visits);
  int num_locations = num_visits + 1; /* Extra location is the butler's house */

  double lowest_cost = DBL_MAX;
  int lowest_cost_idx = -1;
  for (int i = 0; i < num_permutations; i++) {
    for (int j = 0; j < num_visits; j++) {
      int visit_idx = permutations[i][j];
      visit_t *visit = &visits[visit_idx];
      schedules[i].anchored_visits[j].visit = visit;

      if (j < num_visits - 1) {
        int next_visit_idx = permutations[i][j + 1];
        schedules[i].anchored_visits[j].travel_time_to_next =
          get_time_between(travel_time_matrix, num_locations, visit_idx, next_visit_idx);
      }
    }

    solve_sch_lp(lpi, schedules + i, butler->window_start_time, butler->window_end_time);

    /* Special case: if only one visit, then cost should be manually calculated
     * as simply the length of that visit (since the minimising function
     * behaves differently) */
    if (num_visits == 1) {
      schedules[i].cost = visits[0].duration;
    }

    /* Augment cost to include travel from butler house to first visit, and
     * travel from last visit back to butler house */
    int first_visit_idx = permutations[i][0];
    int last_visit_idx = permutations[i][num_visits - 1];
    int butler_idx = num_locations - 1; /* Last location is the butler location */
    schedules[i].cost = schedules[i].cost
      + get_time_between(travel_time_matrix, num_locations, first_visit_idx, butler_idx)
      + get_time_between(travel_time_matrix, num_locations, last_visit_idx, butler_idx);

    /* Calculate efficiency metric (work time / total time) */
    calc_efficiency(schedules + i);

    /* Determine whether any constraints have been broken */
    calc_constraints_satisified(schedules + i);

    /* Check if best schedule yet (given permutations so far)... */
    if (schedules[i].cost < lowest_cost) {
      lowest_cost = schedules[i].cost;
      lowest_cost_idx = i;
    }
  }

  d_copy_schedule(out, schedules + lowest_cost_idx);

  for (int i = 0; i < num_permutations; i++) {
    free_schedule(schedules + i);
  }
  free(schedules);
  free(permutations);
  free_sch_lp(lpi);
}
