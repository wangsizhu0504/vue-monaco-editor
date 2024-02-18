<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import files from './files'

  const fileName = ref<keyof typeof files>('script.js')
  const file = computed(() => files[fileName.value])
  const handleClick = (name: string) => fileName.value = name as keyof typeof files
  const handleChange = (val: string, event: any) => console.log(val, event)
</script>

<template>
  <div style="height: 100%;">
    <button
      :key="item.name"
      v-for="item in files"
      @click="handleClick(item.name)"
    >
      {{ item.name }}
    </button>
    <MonacoEditor
      height="80vh"
      theme="vs-dark"
      :path="fileName"
      :value="file.value"
      @change="handleChange"
      :language="file.language"
    >
      <div style="height: 100%;">loading slot</div>
      <template #failure>
        <div style="height: 100%;">failure slot</div>
      </template>
    </monacoeditor>
  </div>
</template>
