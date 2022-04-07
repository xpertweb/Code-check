#include <stdio.h>
#include <stdlib.h>
#include <float.h>
#include "scheduler.h"

int main() {
  printf("Program starting...");

  /*int A[5];
  for (int i = 0; i < 5; i++) {
    A[i] = i;
  }
  permute(A, 4, 0);*/

  int num_visits = 5;
  visit_t visits[num_visits];
  visits[0].id = 0;
  visits[0].window_start_time = 11.0;
  visits[0].window_end_time = 22.0;
  visits[0].duration = 1.5;
  visits[0].priority = 2;
  ///visits[0].geo_latitude = 0.0;
  //v/isits[0].geo_longitude = 0.0;

  visits[1].id = 1;
  visits[1].window_start_time = 11.5;
  visits[1].window_end_time = 17.5;
  visits[1].duration = 1.0;
  visits[1].priority = 1;
  //visits[1].geo_latitude = 0.0;
  //visits[1].geo_longitude = 0.0;

  visits[2].id = 2;
  visits[2].window_start_time = 9.0;
  visits[2].window_end_time = 19.0;
  visits[2].duration = 1.0;
  visits[2].priority = 4;
  //visits[2].geo_latitude = 0.0;
  //visits[2].geo_longitude = 0.0;

  visits[3].id = 3;
  visits[3].window_start_time = 9.0;
  visits[3].window_end_time = 18.0;
  visits[3].duration = 1.0;
  visits[3].priority = 3;
  //visits[3].geo_latitude = 0.0;
  //visits[3].geo_longitude = 0.0;

  visits[4].id = 4;
  visits[4].window_start_time = 8.0;
  visits[4].window_end_time = 18.0;
  visits[4].duration = 1.0;
  visits[4].priority = 5;
  //visits[4].geo_latitude = 0.0;
  //visits[4].geo_longitude = 0.0;

  /*visits[5].window_start_time = 8.0;
  visits[5].window_end_time = 19.0;
  visits[5].duration = 1.0;
  visits[5].priority = 6;

  visits[6].window_start_time = 8.0;
  visits[6].window_end_time = 21.0;
  visits[6].duration = 2.0;
  visits[6].priority = 7;

  visits[7].window_start_time = 8.0;
  visits[7].window_end_time = 23.0;
  visits[7].duration = 1.0;
  visits[7].priority = 8;*/

  schedule_t sch;
  butler_work_day_t butler;

  butler.window_start_time = 8.5;
  butler.window_end_time = 24.0;

  int num_locations = num_visits + 1;
  double mtx[num_locations * num_locations];
  for (int i = 0; i < num_locations; i++) {
    for (int j = 0; j < num_locations; j++) {
      mtx[(i * num_locations) + j] = 0.5;
    }
  }

  init_schedule(&sch, num_visits);
  populate_schedule(&sch, visits, &butler, mtx);
  printf("%lf ---\n", sch.cost);
  for (int i = 0; i < sch.num_visits; i++) {
    printf("%d ", sch.anchored_visits[i].visit->id);
  }
  printf("\n");
  for (int i = 0; i < sch.num_visits; i++) {
    printf("%2.5lf ", sch.anchored_visits[i].opt_time);
  }
  printf("\n");

  for (int i = 0; i < sch.num_visits; i++) {
    printf("%2.5lf ", sch.anchored_visits[i].window_start_time_slack);
  }
  printf("\n");

  for (int i = 0; i < sch.num_visits; i++) {
    printf("%2.5lf ", sch.anchored_visits[i].window_end_time_slack);
  }
  printf("\n");
  printf("%2.5lf ", sch.butler_window_start_time_slack);
  printf("%2.5lf %d", sch.butler_window_end_time_slack, sch.constraints_satisfied);
  free_schedule(&sch);

  return 0;
}
