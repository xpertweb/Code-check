#ifndef scheduler_h__
#define scheduler_h__

typedef struct {
  int id;
  double window_start_time;
  double window_end_time;
  double duration;
  int priority;
} visit_t;

typedef struct {
  visit_t *visit;
  double travel_time_to_next;
  double opt_time;
  double window_start_time_slack;
  double window_end_time_slack;
} anchored_visit_t;

typedef struct {
  double window_start_time;
  double window_end_time;
} butler_work_day_t;

typedef struct {
  anchored_visit_t *anchored_visits;
  int num_visits;
  int constraints_satisfied;
  double cost;
  double efficiency;
  double butler_window_start_time_slack;
  double butler_window_end_time_slack;
} schedule_t;

extern void init_schedule(schedule_t*, int);
extern void free_schedule(schedule_t*);
extern void populate_schedule(schedule_t*, visit_t*, butler_work_day_t*, double*);

#endif
