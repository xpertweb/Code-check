const header = require('./header.js');
const { populate_schedule, init_schedule } = require('./scheduler.js');
const print = txt => process.stdout.write(txt + ' ');
function main(){
  console.log("Program starting...");
  const num_visits = 5;
  const visits = [{
      id: 0,
      window_start_time: 11.0,
      window_end_time: 22.0,
      duration: 1.5,
      priority: 2,
    },{
      id: 1,
      window_start_time: 11.5,
      window_end_time: 17.5,
      duration: 1.0,
      priority: 1,
    },{
      id: 2,
      window_start_time: 9.0,
      window_end_time: 19.0,
      duration: 1.0,
      priority: 4
    },{
      id: 3,
      window_start_time: 9.0,
      window_end_time: 18.0,
      duration: 1.0,
      priority: 3,
    },{
      id: 4,
      window_start_time: 8.0,
      window_end_time: 18.0,
      duration: 1.0,
      priority: 5,
    }];

  const butler = {
    window_start_time: 8.5,
    window_end_time: 24.0,
  };

  let num_locations = num_visits + 1;
  let mtx = [];
  for (let i = 0; i < num_locations; i++) {
    for (let j = 0; j < num_locations; j++) {
      mtx[(i * num_locations) + j] = 0.5;
    }
  }

  // const sch = header.scheduleStruct();
  // init_schedule(sch, num_visits);
  const sch = populate_schedule(visits, butler, mtx);
  process.stdout.write(sch.cost + '---\n');
  for (let i = 0; i < sch.num_visits; i++) {
     print(String(sch.anchored_visits[i].visit.id));
  }
   process.stdout.write("\n");
  for (let i = 0; i < sch.num_visits; i++) {
    print(String(sch.anchored_visits[i].opt_time));
  }
   process.stdout.write("\n");

  for (let i = 0; i < sch.num_visits; i++) {
     print(String(sch.anchored_visits[i].window_start_time_slack));
  }
   process.stdout.write("\n");

  for (let i = 0; i < sch.num_visits; i++) {
     print(String(sch.anchored_visits[i].window_end_time_slack));
  }
   process.stdout.write("\n");
   print(String(sch.butler_window_start_time_slack));
   process.stdout.write(String(sch.butler_window_end_time_slack + ' ' + sch.constraints_satisfied));
}

main();