import type { SlotsType } from 'vue-demi'
import {
  defineComponent,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue-demi'
import { getOrCreateModel } from '../utils'
import { useValidator } from '../hooks/useValidator'
import { useEditor } from '../hooks/useEditor'
import type { Editor } from '../types'
import { editorProps } from './props'

const viewStates = new Map<string | undefined, Editor.ICodeEditorViewState | null>()

export default defineComponent({
  name: 'Editor',
  props: editorProps,
  emits: ['update:value', 'beforeMount', 'mount', 'change', 'validate'],
  slots: Object as SlotsType<{
    loading: any,
    default: any
  }>,
  setup(props, ctx) {
    const { emit } = ctx
    const {
      render,
      containerRef,
      editorRef,
      monacoRef,
      unload,
      whenMonacoIsReady,
    } = useEditor<Editor.IStandaloneCodeEditor>(props, ctx, 'vue-monaco-editor')

    const { disposeValidator } = useValidator(emit, monacoRef, editorRef)
    const preventTriggerChangeEvent = ref<boolean>(false)

    // path
    watch(
      () => props.path,
      whenMonacoIsReady<string>((newPath, oldPath) => {
        const model = getOrCreateModel(
          monacoRef.value!,
          props.defaultValue || props.value || '',
          props.defaultLanguage || props.language || '',
          props.path || props.defaultPath || '',
        )

        if (model !== editorRef.value?.getModel()) {
          if (props.saveViewState) viewStates.set(oldPath, editorRef.value!.saveViewState())
          editorRef.value?.setModel(model)
          if (props.saveViewState) editorRef.value?.restoreViewState(viewStates.get(newPath)!)
        }
      }),
    )

    // value
    watch(
      () => props.value,
      whenMonacoIsReady<string>((newValue) => {
        if (!editorRef.value || newValue === undefined) return
        if (editorRef.value.getOption(monacoRef.value!.editor.EditorOption.readOnly)) {
          editorRef.value.setValue(newValue)
        } else if (newValue !== editorRef.value.getValue()) {
          preventTriggerChangeEvent.value = true
          editorRef.value.executeEdits('', [
            {
              range: editorRef.value.getModel()!.getFullModelRange(),
              text: newValue,
              forceMoveMarkers: true,
            },
          ])

          editorRef.value.pushUndoStop()
          preventTriggerChangeEvent.value = false
        }
      }),
    )

    // language
    watch(
      () => props.language,
      whenMonacoIsReady<string>((newLang) => {
        const model = editorRef.value?.getModel()
        if (model && newLang)
          monacoRef.value?.editor.setModelLanguage(model, newLang)
      }),
    )

    // line number
    watch(
      () => props.line,
      whenMonacoIsReady<number | undefined>((newLine) => {
        if (newLine !== undefined)
          editorRef.value?.revealLine(newLine)
      }),
    )

    const createEditor = () => {
      console.log(!containerRef.value, !monacoRef.value, editorRef.value)
      if (!containerRef.value || !monacoRef.value || editorRef.value) return

      emit('beforeMount', monacoRef.value)
      const autoCreatedModelPath = props.path || props.defaultPath

      const defaultModel = getOrCreateModel(
        monacoRef.value,
        props.value || props.defaultValue || '',
        props.language || props.defaultLanguage || '',
        autoCreatedModelPath || '',
      )

      editorRef.value = monacoRef.value?.editor.create(
        containerRef.value,
        {
          model: defaultModel,
          theme: props.theme,
          automaticLayout: true,
          autoIndent: 'brackets',
          formatOnPaste: true,
          formatOnType: true,
          ...props.options,
        },
        props.overrideServices,
      )
      editorRef.value?.onDidChangeModelContent((event) => {
        if (!preventTriggerChangeEvent.value) {
          const value = editorRef.value!.getValue()
          emit('update:value', value)
          emit('change', value, event)
        }
      })

      if (props.saveViewState) {
        const currentViewState = viewStates.get(autoCreatedModelPath)
        if (currentViewState) editorRef.value.restoreViewState(currentViewState)
      }

      if (props.line !== undefined)
        editorRef.value?.revealLine(props.line)

      emit('mount', editorRef.value, monacoRef.value)
    }

    onMounted(() => {
      const stop = watch(
        () => monacoRef.value,
        (newMonacoRef) => {
          console.log('containerRef', containerRef.value, newMonacoRef)
          if (containerRef.value && newMonacoRef) {
            nextTick(() => stop())
            createEditor()
          }
        },
        { immediate: true },
      )
    })

    onUnmounted(() => {
      disposeValidator.value?.()

      if (editorRef.value)
        disposeEditor()
      else
        unload()
    })

    function disposeEditor() {
      if (props.keepCurrentModel) {
        if (props.saveViewState) viewStates.set(props.path, editorRef.value!.saveViewState())
        else editorRef.value!.getModel()?.dispose()
      }

      editorRef.value?.dispose()
    }

    return render
  },
})
