import type * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api'

export type Monaco = typeof monacoEditor
export type State = Record<string, any>
export type Selector = (state: State) => State
export type ChangeGetter = (state: State) => State
export type GetState = (selector?: Selector) => State
export type SetState = (change: State | ChangeGetter) => void
export type StateUpdateHandler = (update: State) => any
export type FieldUpdateHandler = (update: any) => any
export type Handlers = Record<string, FieldUpdateHandler>
declare global {

  interface Window {
    monaco: Monaco;
  }
}
export interface CancelablePromise<T> extends Promise<T> {
  cancel: () => void;
}
