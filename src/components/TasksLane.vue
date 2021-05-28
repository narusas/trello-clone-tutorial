<template>
  <div class="rounded bg-blue-200 w-64 p-2 mx-2 shadow-2xl">
    <div class="flex justify-between py-1">
      <h3 v-if="isEditingTitle == false"
          @dblclick="goingToEditTitle"
          class="text-sm font-bold">{{ lane.title }}</h3>
      <input type="text"
             v-else
             v-model="editingTitle"

             ref="editingTitleEl"
             @keyup.esc="cancelEditTitle"

             @keyup.enter="completeEditTitle"
             @blur="completeEditTitle"

      >
    </div>
    <div class="text-sm mt-2">
      <draggable
          group="people"
          :list="lane.taskList"
          item-key="id"
          @change="updateList"
      >
        <template #item="{element}">
          <task-item :task="tasks[element]"
                     @task-title-changed="titleChanged(element, $event)"/>
        </template>
      </draggable>
      <task-item
          v-if="isAppendingNewTask"
          :task="newTask"
          :isAppending="true"
          @completed="completeNew"
          @canceled="cancelNew"
      />
      <p class="mt-3 text-grey-dark flex" @click="addTask">
        <plus/>
        Add a card...
      </p>
    </div>
  </div>
</template>
<script setup>
import {ref, defineProps, toRefs, computed, watch, nextTick, inject} from "vue";
import {Plus} from "@icon-park/vue-next";
import TaskItem from "./TaskItem.vue";
import draggable from '../../node_modules/vuedraggable/src/vuedraggable';
import {useModel} from "../models/tasks.js";


const props = defineProps({
  lane: {
    type: Object
  }
});


const {lane} = toRefs(props);

// 모델에서 필요 모듈를 가져오는 방법
// 1. Root Component가 모두 가져온후에 provide/inject
const tasks = inject("tasks");


const {updateLaneTitle, moveTask, repositionTask} = useModel();


const newTask = ref(null);
const isAppendingNewTask = ref(false);
function addTask() {
  const newTask = {
    id: id++,
    lane: props.lane.id,
    title: '',
    done: false,
  }
  todos.value.push(newTask);
}

// const todos = ref(lane.value.tasks.filter(task => !task.done ))

const isEditingTitle = ref(false);
const editingTitle = ref(null);
const editingTitleEl = ref(null);

function goingToEditTitle() {
  isEditingTitle.value = true;
  editingTitle.value = lane.value.title;
  nextTick(() => {
    editingTitleEl.value.focus();
  });

}

function cancelEditTitle() {
  isEditingTitle.value = false;
  editingTitle.value = null;
}

function completeEditTitle() {
  if (!!editingTitle.value) {
    updateLaneTitle(lane.value.id, editingTitle.value);
  }
  isEditingTitle.value = false;
  editingTitle.value = null;
}


function updateList(event) {
  console.log("event", event);
  if (!!event.added) {
    console.log("다른 리스트로 이동했습니다. ");
    const taskId = event.added.element;
    const newIndex = event.added.newIndex;
    moveTask(taskId, props.lane.id, newIndex)
  } else if (!!event.moved) {
    console.log("같은 리스트안에서 순서가 변경 되었습니다. ");
    const taskId = event.moved.element;
    const {oldIndex, newIndex} = event.moved;
    repositionTask(taskId, oldIndex, newIndex);
  }


}


</script>
