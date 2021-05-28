<template>
  <div
      class="
      bg-white
      p-2
      rounded
      mt-1
      border-b border-grey
      cursor-pointer
      hover:bg-grey-lighter
      flex
      align-middle
    "
  >
    <template v-if="isEditing == false">
      <input
          type="checkbox"
          class="rounded"
          :checked="task.done"
          @click="toggleTaskDone(task)"
      />
      <div @dblclick="goingToEdit">{{ task.title }}</div>
    </template>
    <template v-if="isEditing">
      <input
          v-model="editing"
          @keyup.enter="completeEditing"
          @keyup.esc="cancel"
          @blur="completeEditing"
          ref="editingEl"
          class="w-full h-full"
      />
    </template>
  </div>
</template>

<script setup>
import {ref, toRefs, defineProps, defineEmit, nextTick, onMounted} from "vue";
import {onClickOutside} from "@vueuse/core";

import {useModel} from "../models/tasks.js";

const {updateTaskTitle, toggleTaskDone} = useModel();

const props = defineProps({
  task: {
    type: Object,
  },
});

const emit = defineEmit(["editCompleted", "editCanceled"]);

const isEditing = ref(!!props.task?.isNewAppened);

const editingEl = ref(null);

const editing = ref(null);

onMounted(() => {
  nextTick(() => {
    if (isEditing.value) {
      editingEl.value.focus();
    }
  });
});

function completeEditing() {
  isEditing.value = false;
  updateTaskTitle(props.task.id, editing.value);
  emit("editCompleted", editing.value);
}

function cancel() {
  isEditing.value = false;
  emit("editCanceled");
}

function goingToEdit() {
  isEditing.value = true;
  editing.value = props.task.title;
  nextTick(() => {
    editingEl.value.focus();
  });

  onClickOutside(editingEl, () => {
    completeEditing();
  });
}
</script>
