import type { ChangeGetter, Handlers, Selector, State, StateUpdateHandler } from '../type'
import { curry, hasOwnProperty, isEmpty, isFunction, isObject } from '../utils'

export const errorMessages: Record<string, string> = {
  initialIsRequired: 'initial state is required',
  initialType: 'initial state should be an object',
  initialContent: 'initial state shouldn\'t be an empty object',
  handlerType: 'handler should be an object or a function',
  handlersType: 'all handlers should be a functions',
  selectorType: 'selector should be a function',
  changeType: 'provided value of changes should be an object',
  changeField: 'it seams you want to change a field in the state which is not specified in the "initial" state',

  configIsRequired: 'the configuration object is required',
  configType: 'the configuration object should be an object',
  default: 'An unknown error occurred',

  deprecation: `Deprecation warning!
    You are using deprecated way of configuration.

    Instead of using
      monaco.config({ urls: { monacoBase: '...' } })
    use
      monaco.config({ paths: { vs: '...' } })
  `,
}
/**
 * logs deprecation message
 */
function informAboutDeprecation() {
  console.warn(errorMessages.deprecation)
}

function throwError(message: Record<string, string>, type: string) {
  throw new Error(message[type] || errorMessages.default)
}

export const errorHandler = curry(throwError)(errorMessages)

/**
 * validates the configuration object and informs about deprecation
 * @param {object} config - the configuration object
 * @return {object} config - the validated configuration object
 */
function validateConfig(config: Record<string, any>): Record<string, any> {
  if (!config) errorHandler('configIsRequired')
  if (!isObject(config)) errorHandler('configType')
  if (config.urls) {
    informAboutDeprecation()
    return { paths: { vs: config.urls.monacoBase } }
  }

  return config
}

function validateChanges(initial: Record<string, any>, changes: State | ChangeGetter) {
  if (!isObject(changes)) errorHandler('changeType')
  if (Object.keys(changes).some(field => !hasOwnProperty(initial, field))) errorHandler('changeField')

  return changes
}

function validateSelector(selector: Selector) {
  if (!isFunction(selector)) errorHandler('selectorType')
}

function validateHandler(handler: StateUpdateHandler | Handlers) {
  if (!(isFunction(handler) || isObject(handler))) errorHandler('handlerType')
  if (isObject(handler) && Object.values(handler).some(_handler => !isFunction(_handler))) errorHandler('handlersType')
}

function validateInitial(initial: Record<string, any>) {
  if (!initial) errorHandler('initialIsRequired')
  if (!isObject(initial)) errorHandler('initialType')
  if (isEmpty(initial)) errorHandler('initialContent')
}

export const validators = {
  config: validateConfig,
  changes: validateChanges,
  selector: validateSelector,
  handler: validateHandler,
  initial: validateInitial,
}
