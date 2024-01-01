import type { PropType } from 'vue'
import type { editor } from 'monaco-editor'
import type { Theme } from '..'

export const editorProps = {
  /**
   * Default value of the current model
   */
  defaultValue: {
    type: String,
  },

  /**
   * Default language of the current model
   */
  defaultLanguage: {
    type: String,
  },

  /**
   * Default path of the current model
   * Will be passed as the third argument to `.createModel` method
   * `monaco.editor.createModel(..., ..., monaco.Uri.parse(defaultPath))`
   */
  defaultPath: {
    type: String,
  },

  /**
   * Value of the current model
   */
  value: {
    type: String,
    value: '',
  },

  /**
   * Language of the current model
   */
  language: {
    type: String,
    default: 'javascript',
  },

  /**
   * Path of the current model
   * Will be passed as the third argument to `.createModel` method
   * `monaco.editor.createModel(..., ..., monaco.Uri.parse(defaultPath))`
   */
  path: {
    type: String,
    default: '',
  },

  /**
   * The theme for the monaco
   * Available options "vs-dark" | "light"
   * Define new themes by `monaco.editor.defineTheme`
   * @default "light"
   */
  theme: {
    type: String as PropType<Theme | string>,
    default: 'light',
  },

  /**
   * The line to jump on it
   */
  line: {
    type: Number,
  },

  /**
   * IStandaloneEditorConstructionOptions
   */
  options: {
    type: Object as PropType<editor.IStandaloneEditorConstructionOptions>,
    default: () => ({}),
  },

  /**
   * IEditorOverrideServices
   */
  overrideServices: {
    type: Object as PropType<editor.IEditorOverrideServices>,
  },

  /**
   * Indicator whether to save the models' view states between model changes or not
   * Defaults to true
   */
  saveViewState: {
    type: Boolean,
    default: true,
  },

  /**
   * Indicator whether to dispose the current model when the Editor is unmounted or not
   * @default false
   */
  keepCurrentModel: {
    type: Boolean,
    default: false,
  },

  /**
   * Width of the editor wrapper
   * @default "100%"
   */
  width: {
    type: [Number, String] as PropType<number | string>,
    default: '100%',
  },

  /**
   * Height of the editor wrapper
   * @default "100%"
   */
  height: {
    type: [Number, String] as PropType<number | string>,
    default: '100%',
  },

  /**
   * Class name for the editor container
   */
  className: {
    type: String,
  },
}
