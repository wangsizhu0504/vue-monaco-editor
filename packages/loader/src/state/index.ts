import type {
  ChangeGetter,
  GetState,
  Handlers,
  SetState,
  State,
  StateUpdateHandler,
} from '../type'
import { compose, curry, isFunction } from '../utils'
import { validators } from '../validators'

function extractChanges(state: State, causedChanges: ChangeGetter) {
  return isFunction(causedChanges) ? causedChanges(state.current) : causedChanges
}

function updateState(state: State, changes: ChangeGetter) {
  state.current = { ...state.current, ...changes }

  return changes
}

function didStateUpdate(state: State, handler: StateUpdateHandler | Handlers, changes: ChangeGetter) {
  if (isFunction(handler))
    handler(state.current)
  else
    Object.keys(changes).forEach(field => handler[field]?.(state.current[field]))

  return changes
}

/**
 * the initial state and it should be a non-empty object
 * the handler, which can be function or object
 * if the handler is a function than it should be called immediately after every state update
 * if the handler is an object than the keys of that object should be a subset of the state
 * and the all values of that object should be functions, plus they should be called immediately
 * after every update of the corresponding field in the state
 */

export function createState(initial: State, handler: StateUpdateHandler | Handlers = {}): [GetState, SetState] {
  validators.initial(initial)
  validators.handler(handler)

  const state = { current: initial }

  const didUpdate = curry(didStateUpdate)(state, handler)
  const update = curry(updateState)(state)
  const validate = curry(validators.changes)(initial)
  const getChanges = curry(extractChanges)(state)

  function getState(selector = (_state: State) => _state) {
    validators.selector(selector)
    return selector(state.current)
  }

  function setState(causedChanges: State | ChangeGetter) {
    compose(
      didUpdate,
      update,
      validate,
      getChanges,
    )(causedChanges)
  }

  return [getState, setState]
}
