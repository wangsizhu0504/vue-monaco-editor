# @vue-monaco/editor

Use [monaco-editor](https://microsoft.github.io/monaco-editor/) loaded in [Vue 2&3](https://vuejs.org/), no need to configure plugins in `webpack` (or `rollup`, ` vite`) and other packaging tools.

[![gitHub license](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/wangsizhu0504/vue-monaco/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/@vue-monaco/ditor.svg?style=flat)](https://www.npmjs.com/package/@vue-monaco/editor)

English | [简体中文](./README.zh-CN.md)

## Installation

```sh
npm i @vue-monaco/editor
```

Vue `<= 2.6.14` requires [@vue/composition-api](https://github.com/vuejs/composition-api) to be installed.

```sh
npm i @vue-monaco/editor @vue/composition-api
```

## Usage

**Editor**

```vue
<script lang="ts" setup>
  import { ref, shallowRef } from 'vue'

  const MONACO_EDITOR_OPTIONS = {
    automaticLayout: true,
    formatOnType: true,
    formatOnPaste: true,
  }

  const code = ref('// some code...')
  const editorRef = shallowRef()
  const handleMount = editor => (editorRef.value = editor)

  // your action
  function formatCode() {
    editorRef.value?.getAction('editor.action.formatDocument').run()
  }
</script>

<template>
  <monaco-editor
    v-model:value="code"
    theme="vs-dark"
    :options="MONACO_EDITOR_OPTIONS"
    @mount="handleMount"
  />
</template>
```

**Diff Editor**

```vue
<script lang="ts" setup>
  import { ref, shallowRef } from 'vue'

  const OPTIONS = {
    automaticLayout: true,
    formatOnType: true,
    formatOnPaste: true,
    readOnly: true,
  }

  const diffEditorRef = shallowRef()
  const handleMount = diffEditor => (diffEditorRef.value = diffEditor)

  // get the original value
  function getOriginalValue() {
    return diffEditorRef.value.getOriginalEditor().getValue()
  }

  // get the modified value
  function getOriginalValue() {
    return diffEditorRef.value.getModifiedEditor().getValue()
  }
</script>

<template>
  <monaco-diff-editor
    theme="vs-dark"
    original="// the original code"
    modified="// the modified code"
    language="javascript"
    :options="OPTIONS"
    @mount="handleMount"
  />
</template>
```

## Props & Events & slots

### Editor

| Name | Type | Default | Description | remark |
| --- | --- | --- | --- | --- |
| value | `string` |  | value of the current model, can use `v-model:value` | `v-model:value` |
| language | `string` |  | all language of the current model | languages supported by `monaco-editor`, [view here](https://github.com/microsoft/monaco-editor/tree/main/src/basic-languages) |
| path | `string` |  | path to the current model |  |
| defaultValue | `string` |  | default value of the current model |  |
| defaultLanguage | `string` |  | default language of the current model | languages supported by `monaco-editor` [view here](https://github.com/microsoft/monaco-editor/tree/main/src/basic-languages) |
| defaultPath | `string` |  | default path of the current model | `monaco.editor.createModel(..., ..., monaco.Uri.parse(defaultPath))` |
| theme | `vs` \| `vs-dark` | `vs` | the theme for the monaco editor. |  |
| line | `number` |  | number of lines to jump to |  |
| options | `object` | `{}` | [IStandaloneEditorConstructionOptions](https://microsoft.github.io/monaco-editor/docs.html#interfaces/editor.IStandaloneEditorConstructionOptions.html) |  |
| overrideServices | `object` | `{}` | [IEditorOverrideServices](https://microsoft.github.io/monaco-editor/docs.html#interfaces/editor.IEditorOverrideServices.html) |  |
| saveViewState | `boolean` | `true` | save the view state of the model (scroll position, etc.) after model changes | a unique `path` needs to be configured for each model |
| width | `number` \| `string` | `100%` | container width |  |
| height | `number` \| `string` | `100%` | container height |  |
| className | `string` |  | container class name |  |
| onBeforeMount | `(monaco: Monaco) => void` |  | execute before the editor instance is created |  |
| onMount | `(editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => void` |  | execute after the editor instance has been created |  |
| onChange | `(value: string \| undefined, event: monaco.editor.IModelContentChangedEvent) => void` |  | execute when  the changed value change |  |
| onValidate | `(markers: monaco.editor.IMarker[]) => void` |  | execute when a syntax error occurs | `monaco-editor` supports syntax-checked languages [view here](https://github.com/microsoft/monaco-editor/tree/main/src/basic-languages) |
| `#loading` | `slot` | `'loading...'` | loading status | when loading files from CDN, displaying the loading status will be more friendly |

### Diff Editor

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| original | `string` |  | The original source value (left editor) |
| modified | `string` |  | The modified source value (right editor) |
| language | `string` |  | Language for the both models - original and modified (all languages that are [supported](https://github.com/microsoft/monaco-editor/tree/main/src/basic-languages) by monaco-editor) |
| originalLanguage | `string` |  | This prop gives you the opportunity to specify the language of the original source separately, otherwise, it will get the value of the language property. |
| modifiedLanguage | `string` |  | This prop gives you the opportunity to specify the language of the modified source separately, otherwise, it will get the value of language property. |
| originalModelPath | `string` |  | Path for the "original" model. Will be passed as a third argument to `.createModel` method - `monaco.editor.createModel(..., ..., monaco.Uri.parse(originalModelPath))` |
| modifiedModelPath | `string` |  | Path for the "modified" model. Will be passed as a third argument to `.createModel` method - `monaco.editor.createModel(..., ..., monaco.Uri.parse(modifiedModelPath))` |
| theme  | `vs` \| `vs-dark` \| `string` | `vs` (`vs` theme equals `light` theme) | The theme for the monaco editor. Define new themes by `monaco.editor.defineTheme`. |
| options | `object` | `{}` | [IStandaloneDiffEditorConstructionOptions](https://microsoft.github.io/monaco-editor/docs.html#interfaces/editor.IStandaloneDiffEditorConstructionOptions.html) |
| width | `number` \| `string` | `100%` | Container width |
| height | `number` \| `string` | `100%` | Container height |
| className | `string` |  | Container class name |
| onBeforeMount | `(monaco: Monaco) => void` |  | Execute before the editor instance is created |
| onMount | `(editor: monaco.editor.IStandaloneDiffEditor, monaco: Monaco) => void` |  | Execute after the editor instance has been created |
| `#loading` | `slot` | `'loading...'` | Loading status |

### Vite

If you use `vite`, you need to do this (see [#1791 (comment)](https://github.com/vitejs/vite/discussions/1791#discussioncomment-321046) for details).

```js
import { loader } from '@vue-monaco/editor'

import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json')
      return new jsonWorker()

    if (label === 'css' || label === 'scss' || label === 'less')
      return new cssWorker()

    if (label === 'html' || label === 'handlebars' || label === 'razor')
      return new htmlWorker()

    if (label === 'typescript' || label === 'javascript')
      return new tsWorker()

    return new editorWorker()
  }
}

loader.config({ monaco })
```

## Inspiration

MonacoVue is made possible thanks to the inspirations from the following projects:

- [monaco-loader](https://github.com/suren-atoyan/monaco-loader)
- [monaco-vue](https://github.com/imguolao/monaco-vue)

## License

[MIT](LICENSE)
