const fastifyCreateFunc = require("fastify");
const fastify = fastifyCreateFunc({logger: true});


const tasks = {
  laneList: ["lane1", "lane2", "lane3"],
  lanes: {
    "lane1": {
      id: "lane1",
      taskList: ["task-1", "task-2", "task-3"],
      title: "Backlogs"
    },
    "lane2": {
      id: "lane2",
      taskList: ["task-4"],
      title: "Work In Progress"
    },
    "lane3": {
      id: "lane3",
      taskList: ["task-5", "task-6"],
      title: "Done"
    }
  },
  tasks: {
    "task-1": {
      id: "task-1",
      lane: "lane1",
      title: "모델 분리",
      done: false,
    },
    "task-2": {
      id: "task-2",
      lane: "lane1",
      title: "서버 연동",
      done: false,
    },
    "task-3": {
      id: "task-3",
      lane: "lane1",
      title: "node 서버 기초",
      done: false,
    },
    "task-4": {
      id: "task-4",
      lane: "lane2",
      title: "trello 클론 기본",
      done: false,
    },
    "task-5": {
      id: "task-5",
      lane: "lane3",
      title: "개발환경 배우기",
      done: true,
    },
    "task-6": {
      id: "task-6",
      lane: "lane3",
      title: "vue 기초 배우기",
      done: true,
    },
  }
}

fastify.get("/api/tasks", async (request, reply) => {
  return tasks;
});

fastify.put("/api/lanes/:laneId", async (request, reply) => {
  console.log("parameters", request.params)
  console.log("body", request.body)

  const laneId = request.params.laneId;
  const {title} = request.body;
  tasks.lanes[laneId].title = title;
  return {status: "OK"};
});

fastify.put("/api/tasks/:taskId", async (request, reply) => {
  console.log("parameters", request.params)
  console.log("body", request.body)

  const taskId = request.params.taskId;
  const {title, done} = request.body;
  if (!!title) {
    tasks.tasks[taskId].title = title;
  }
  if (!!done) {
    tasks.tasks[taskId].done = done;
  }

  return {status: "OK"};
});

fastify.put("/api/tasks/:taskId/moveTo", async (request, reply) => {
  console.log("parameters", request.params);
  console.log("body", request.body);
  const taskId = request.params.taskId;
  const {laneId, newIndex} = request.body;

  const task = tasks.tasks[taskId];

  const fromLane = tasks.lanes[task.lane];
  const toLane = tasks.lanes[laneId];


  const oldIndex = fromLane.taskList.indexOf(taskId);
  if (oldIndex > -1) {
    fromLane.taskList.splice(oldIndex, 1);
  }

  toLane.taskList.splice(newIndex, 0, taskId);

  // 중요
  task.lane = laneId;

  return {status: "OK"};
});

fastify.put("/api/tasks/:taskId/reposition", async (request, reply) => {
  console.log("parameters", request.params);
  console.log("body", request.body);
  const taskId = request.params.taskId;
  const {newIndex} = request.body;

  const task = tasks.tasks[taskId];
  const lane = tasks.lanes[task.lane];


  const oldIndex = lane.taskList.indexOf(taskId);
  if (oldIndex > -1) {
    lane.taskList.splice(oldIndex, 1);
  }

  lane.taskList.splice(newIndex, 0, taskId);

  return {status: "OK"};
});

// fastify.post("/api/tasks/:id/updateTitle", async(request, reply)=>{
//     return tasks;
// });

const start = async () => {
  try {
    await fastify.listen(3001);
  } catch (err) {
    console.log.error(err);
    process.exit(1);
  }
};

start();

