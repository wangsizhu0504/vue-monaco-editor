<script lang="ts" setup>
  import { ref } from 'vue'
  import EditorDemo from './editor/EditorDemo.vue'
  import DiffEditorDemo from './diffEditor/DiffEditorDemo.vue'

  const isEditor = ref(true)
  const handleEditor = () => isEditor.value = !isEditor.value
</script>

<template>
  <div style="height: 100%;">
    <div class="header">
      <button :disabled="isEditor" @click="handleEditor">Editor</button>
      <button :disabled="!isEditor" @click="handleEditor">Diff Editor</button>
    </div>
    <EditorDemo v-show="isEditor" />
    <DiffEditorDemo v-show="!isEditor" />
  </div>
</template>

<style>
.header {
  height: 40px;
}
</style>
