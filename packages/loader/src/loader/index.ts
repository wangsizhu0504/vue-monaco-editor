/**
 * loader module
 * @module src/loader
 *
 * the module aims to setup monaco-editor
 * into your browser by using its `loader` script
 */

import type * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api'
import defaultConfig from '../config'
import { validators } from '../validators'
import { compose, deepMerge, makeCancelable } from '../utils'
import { createState } from '../state'
import type { CancelablePromise } from '../type'

type Monaco = typeof monacoEditor

/** the local state of the module */
const [getState, setState] = createState({
  config: defaultConfig,
  isInitialized: false,
  resolve: null,
  reject: null,
  monaco: null,
})

const wrapperPromise = new Promise((resolve, reject) => setState({ resolve, reject }))

/**
 * set the loader configuration
 * @param {object} globalConfig - the configuration object
 */
function config(globalConfig: Record<string, any>) {
  const { monaco, ...otherConfig } = validators.config(globalConfig)

  setState(_state => ({
    config: deepMerge(
      _state.config,
      otherConfig,
    ),
    monaco,
  }))
}

/**
 * handles the initialization of the monaco-editor
 * @return {Promise} - returns an instance of monaco (with a cancelable promise)
 */
function init(): CancelablePromise<Monaco> {
  const state = getState(({ monaco, isInitialized, resolve }) => ({ monaco, isInitialized, resolve }))

  if (!state.isInitialized) {
    setState({ isInitialized: true })

    if (state.monaco) {
      state.resolve(state.monaco)
      return makeCancelable(wrapperPromise)
    }

    if (window.monaco && window.monaco.editor) {
      storeMonacoInstance(window.monaco)
      state.resolve(window.monaco)
      return makeCancelable(wrapperPromise)
    }

    compose(
      injectScripts,
      getMonacoLoaderScript,
    )(configureLoader)
  }

  return makeCancelable(wrapperPromise)
}

/**
 * injects provided scripts into the document.body
 * @param {object} script - an HTML script element
 * @return {object} - the injected HTML script element
 */
function injectScripts(script: Node): Node {
  return document.body.appendChild(script)
}

/**
 * creates an HTML script element with/without provided src
 * @param {string} [src] - the source path of the script
 * @return {object} - the created HTML script element
 */
function createScript(src: string): Record<string, any> {
  const script = document.createElement('script')
  return (src && (script.src = src), script)
}

/**
 * creates an HTML script element with the monaco loader src
 * @return {object} - the created HTML script element
 */
function getMonacoLoaderScript(configLoader: (...args: any[]) => void): Record<string, any> {
  const state = getState(({ config, reject }) => ({ config, reject }))

  const loaderScript = createScript(`${state.config.paths.vs}/loader.js`)
  loaderScript.onload = () => configLoader()

  loaderScript.onerror = state.reject

  return loaderScript
}

/**
 * configures the monaco loader
 */
function configureLoader() {
  const state = getState(({ config, resolve, reject }) => ({ config, resolve, reject }))

  const require = window.require as any

  require.config(state.config)
  require(
    ['vs/editor/editor.main'],
    (monaco: Monaco) => {
      storeMonacoInstance(monaco)
      state.resolve(monaco)
    },
    (error: Error) => {
      state.reject(error)
    },
  )
}

/**
 * store monaco instance in local state
 */
function storeMonacoInstance(monaco: Monaco) {
  if (!getState().monaco)
    setState({ monaco })
}

/**
 * internal helper function
 * extracts stored monaco instance
 * @return {object | null} - the monaco instance
 */
function getMonacoInstance(): Monaco | null {
  return getState(({ monaco }: any) => monaco) as Monaco
}

export default { config, init, getMonacoInstance }
