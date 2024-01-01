import type { PropType } from 'vue'
import type { editor as Editor } from 'monaco-editor'
import type { Theme } from '..'

export const diffEditorProps = {
  /**
   * The original source (left one) value
   */
  original: {
    type: String,
    default: '',
  },

  /**
   * The modified source (right one) value
   */
  modified: {
    type: String,
    default: '',
  },

  /**
   * Language for the both models - original and modified
   */
  language: {
    type: String,
  },

  /**
   * This prop gives you the opportunity to specify the language of the
   * original source separately, otherwise, it will get the value of the language property
   */
  originalLanguage: {
    type: String,
  },

  /**
   * This prop gives you the opportunity to specify the language of the
   * modified source separately, otherwise, it will get the value of language property
   */
  modifiedLanguage: {
    type: String,
  },

  /**
   * Path for the "original" model
   * Will be passed as a third argument to `.createModel` method
   * `monaco.editor.createModel(..., ..., monaco.Uri.parse(originalModelPath))`
   */
  originalModelPath: {
    type: String,
  },

  /**
   * Path for the "modified" model
   * Will be passed as a third argument to `.createModel` method
   * `monaco.editor.createModel(..., ..., monaco.Uri.parse(modifiedModelPath))`
   */
  modifiedModelPath: {
    type: String,
  },

  /**
   * Indicator whether to dispose the current original model when the DiffEditor is unmounted or not
   * @default false
   */
  keepCurrentOriginalModel: {
    type: Boolean,
  },

  /**
   * Indicator whether to dispose the current modified model when the DiffEditor is unmounted or not
   * @default false
   */
  keepCurrentModifiedModel: {
    type: Boolean,
    default: false,
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
   * IDiffEditorConstructionOptions
   */
  options: {
    type: Object as PropType<Editor.IDiffEditorConstructionOptions>,
    default: () => ({}),
  },

  /**
   * Width of the editor wrapper
   * @default "100%"
   */
  width: {
    type: [Number, String],
    default: '100%',
  },

  /**
   * Height of the editor wrapper
   * @default "100%"
   */
  height: {
    type: [Number, String],
    default: '100%',
  },

  /**
   * Class name for the editor container
   */
  className: {
    type: String,
  },
}
