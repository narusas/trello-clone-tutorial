import axios from "axios";
import {ref} from "vue";


async function fetchData() {
  const response = await axios.get("/api/tasks");
  console.log("response", response);
  return response.data;
}

async function getTasks() {
  const payload = await fetchData();
  parsePayload(payload);
}


const laneList = ref([]);
const lanes = ref(null);
const tasks = ref(null);

function parsePayload(payload) {
  laneList.value = payload.laneList;
  lanes.value = payload.lanes;
  tasks.value = payload.tasks;
}

async function updateLaneTitle(laneId, newTitle) {
  await axios.put(`/api/lanes/${laneId}`, {title: newTitle});
  await getTasks();
}

async function updateTaskTitle(taskId, newTitle) {
  await axios.put(`/api/tasks/${taskId}`, {title: newTitle});
  await getTasks();
}

async function moveTask(taskId, laneId, newIndex) {
  await axios.put(`/api/tasks/${taskId}/moveTo`, {laneId, newIndex});
}

async function repositionTask(taskId, oldIndex, newIndex) {
  await axios.put(`/api/tasks/${taskId}/reposition`, {newIndex});
}


export function useModel() {
  return {

    lanes,
    laneList,
    updateLaneTitle,

    tasks,
    updateTaskTitle,
    moveTask,
    repositionTask,
    getTasks
  };
}