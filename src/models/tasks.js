import axios from "axios";
import {ref} from "vue";
export function titleChanged(task, changedTitle) {
    task.title = changedTitle;
}


async function getTasks() {
  const payload = await getData();
  parsePayload(payload);
}

async function updateLaneTitle(laneId, title){
    console.log("updateLaneTitle", laneId, title);
    await axios.put(`/api/lanes/${laneId}`, {title});
    await getTasks();
}


async function fetchData(){
    const response = await axios.get("/api/tasks");
    console.log("response",response);
    return response.data;
}

async function getTasks() {
    const payload = await fetchData();
    parsePayload(payload);
}





async function postNewTask(laneId, taskId, title) {
    await axios.post(`/api/tasks`, {
        laneId,
        taskId, 
        title
    });
    await getTasks();
}


const laneList = ref([]);
const lanes = ref(null);
const tasks = ref(null);

function parsePayload(payload) {
    laneList.value = payload.laneList;
    lanes.value = payload.lanes;
    tasks.value = payload.tasks;
}



async function updateTaskTitle(taskId, title){
    console.log("updateTaskTitle", taskId, title);
    await axios.put(`/api/tasks/${taskId}`, {title});
    await getTasks();
}

async function moveTask(taskId, laneId, newIndex) {
    await axios.put(`/api/tasks/${taskId}/moveTo`, {laneId, newIndex});
    await getTasks();
}

async function repositionTask(taskId, newIndex, oldIndex) {
    await axios.put(`/api/tasks/${taskId}/reposition`, {newIndex, oldIndex});
    await getTasks();
}


export function useModel() {
    return {
        // Group
        tasks,
        postNewTask,
        getTasks,


        // Item
        updateTaskTitle,
        moveTask,
        repositionTask,
        
        
        lanes,
        laneList,
        updateLaneTitle,

        
    };
}