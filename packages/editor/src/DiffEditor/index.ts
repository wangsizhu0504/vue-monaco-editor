import type { SlotsType } from 'vue-demi'
import { defineComponent, nextTick, onMounted, onUnmounted, watch } from 'vue-demi'
import { getOrCreateModel } from '../utils'
import type { Editor } from '../types'
import { useEditor } from '../hooks/useEditor'
import { diffEditorProps } from './props'

export default defineComponent({
  name: 'DiffEditor',
  props: diffEditorProps,
  slots: Object as SlotsType<{
    default: any,
    loading: any,
  }>,
  setup(props, ctx) {
    const { emit } = ctx

    const { render, monacoRef, containerRef, editorRef, unload, whenMonacoIsReady } = useEditor<Editor.IStandaloneDiffEditor>(props, ctx, 'vue-monaco-diff-editor')

    // originalModelPath
    watch(
      () => props.originalModelPath,
      whenMonacoIsReady<string>(() => {
        const originalEditor = editorRef.value?.getOriginalEditor()
        const model = getOrCreateModel(
          monacoRef.value!,
          props.original || '',
          props.originalLanguage || props.language || 'text',
          props.originalModelPath || '',
        )

        if (model !== originalEditor?.getModel())
          originalEditor?.setModel(model)
      }),
    )

    // modifiedModelPath
    watch(
      () => props.modifiedModelPath,
      whenMonacoIsReady<string>(() => {
        const modifiedEditor = editorRef.value!.getModifiedEditor()
        const model = getOrCreateModel(
          monacoRef.value!,
          props.modified || '',
          props.modifiedLanguage || props.language || 'text',
          props.modifiedModelPath || '',
        )

        if (model !== modifiedEditor.getModel())
          modifiedEditor.setModel(model)
      }),
    )

    // modified
    watch(
      () => props.modified,
      whenMonacoIsReady(() => {
        const modifiedEditor = editorRef.value!.getModifiedEditor()
        if (modifiedEditor.getOption(monacoRef.value!.editor.EditorOption.readOnly)) {
          modifiedEditor.setValue(props.modified || '')
        } else {
          if (props.modified !== modifiedEditor.getValue()) {
            modifiedEditor.executeEdits('', [
              {
                range: modifiedEditor.getModel()!.getFullModelRange(),
                text: props.modified || '',
                forceMoveMarkers: true,
              },
            ])

            modifiedEditor.pushUndoStop()
          }
        }
      }),
    )

    // original
    watch(
      () => props.original,
      whenMonacoIsReady(() => {
        editorRef.value?.getModel()?.original.setValue(props?.original || '')
      }),
    )

    // language
    watch(
      () => [props.language, props.originalLanguage, props.modifiedLanguage],
      whenMonacoIsReady(() => {
        // eslint-disable
        const { original, modified } = editorRef.value!.getModel()!

        monacoRef.value!.editor.setModelLanguage(original, props.originalLanguage || props.language || 'text')

        monacoRef.value!.editor.setModelLanguage(modified, props.originalLanguage || props.language || 'text')
      }),
    )

    const createDiffEditor = () => {
      if (!containerRef.value || !monacoRef.value || editorRef.value)
        return

      // diff editor before mount
      emit('beforeMount', monacoRef.value)
      editorRef.value = monacoRef.value.editor.createDiffEditor(containerRef.value, {
        automaticLayout: true,
        autoIndent: 'brackets',
        theme: props.theme,
        formatOnPaste: true,
        formatOnType: true,
        ...props.options,
      })
      const originalModel = getOrCreateModel(
        monacoRef.value,
        props.original || '',
        props.originalLanguage || props.language || 'text',
        props.originalModelPath || '',
      )

      const modifiedModel = getOrCreateModel(
        monacoRef.value,
        props.modified || '',
        props.modifiedLanguage || props.language || 'text',
        props.modifiedModelPath || '',
      )
      editorRef.value?.setModel({
        original: originalModel,
        modified: modifiedModel,
      })

      // diff editor mount
      emit('mount', editorRef.value, monacoRef.value)
    }

    onMounted(() => {
      const stop = watch(
        monacoRef,
        () => {
          if (containerRef.value && monacoRef.value) {
            nextTick(() => stop())
            createDiffEditor()
          }
        },
        { immediate: true },
      )
    })

    onUnmounted(() => {
      if (editorRef.value)
        disposeEditor()
      else
        unload()
    })
    function disposeEditor() {
      const models = editorRef.value?.getModel()

      if (!props.keepCurrentOriginalModel)
        models?.original?.dispose()

      if (!props.keepCurrentModifiedModel)
        models?.modified?.dispose()

      editorRef.value?.dispose()
    }

    return render
  },
})
