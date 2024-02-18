import { createApp } from 'vue'

import { install as InstallMonacoEditorPlugin, loader } from '@vue-monaco/editor'
import App from './App.vue'

loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs',
  },
})

createApp(App).use(InstallMonacoEditorPlugin).mount('#app')
