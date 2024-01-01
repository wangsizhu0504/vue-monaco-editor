import type { SetupContext, ShallowRef } from 'vue-demi'
import { nextTick, ref, watch } from 'vue-demi'
import type { editor } from 'monaco-editor'
import type { EditorEmitsOptions, Monaco } from '../../types'
import { noop } from '../../utils'

export function useValidator(
  emit: SetupContext<EditorEmitsOptions>['emit'],
  monacoRef: ShallowRef<Monaco | null>,
  editorRef: ShallowRef<editor.IStandaloneCodeEditor | null>,
) {
  const disposeValidator = ref<() => void>(noop)

  const stop = watch(
    () => [monacoRef, editorRef],
    () => {
      if (monacoRef.value && editorRef.value) {
        nextTick(() => stop())
        const changeMarkersListener = monacoRef.value.editor.onDidChangeMarkers((uris) => {
          const editorUri = editorRef.value?.getModel()?.uri
          if (editorUri) {
            const currentEditorHasMarkerChanges = uris.find(uri => uri.path === editorUri.path)
            if (currentEditorHasMarkerChanges) {
              const markers = monacoRef.value!.editor.getModelMarkers({
                resource: editorUri,
              })
              emit('validate', markers)
            }
          }
        })

        disposeValidator.value = () => changeMarkersListener?.dispose()
      }
    },
  )

  return { disposeValidator }
}
