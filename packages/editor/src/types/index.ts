import type { editor as Editor } from 'monaco-editor'
import type { ComponentPublicInstance, ExtractPropTypes } from 'vue'
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import type { diffEditorProps } from '../DiffEditor/props'
import type { editorProps } from '../Editor/props'

// Monaco

export type MonacoDiffEditor = Editor.IStandaloneDiffEditor

export type DiffOnMount = (editor: MonacoDiffEditor, monaco: Monaco) => void

export type DiffBeforeMount = (monaco: Monaco) => void

export type DiffEditorProps = ExtractPropTypes<typeof diffEditorProps>
export type DiffEditorInstance = ComponentPublicInstance<DiffEditorProps, EditorEmitsOptions>

export type EditorProps = ExtractPropTypes<typeof editorProps>
export type EditorInstance = ComponentPublicInstance<EditorProps, EditorEmitsOptions>

export type Monaco = typeof monaco

export { Editor }

// Default themes
export type Theme = 'vs-dark' | 'light'

export interface EditorEmitsOptions {
  'update:value': (value: string | undefined) => void
  beforeMount: (monaco: Monaco) => void
  mount: (editor: Editor.IStandaloneCodeEditor, monaco: Monaco) => void
  change: (value: string | undefined, event: Editor.IModelContentChangedEvent) => void
  validate: (markers: Editor.IMarker[]) => void
}
