import loader from '@vue-monaco/loader'

import MonacoDiffEditor from './DiffEditor'
import MonacoEditor from './Editor'

type Options = Parameters<typeof loader.config>[0]

export function install(app: any, options?: Options) {
  if (options)
    loader.config(options)

  app.component(MonacoEditor.name, MonacoEditor)
  app.component(MonacoDiffEditor.name, MonacoDiffEditor)
}

export { loader, MonacoDiffEditor, MonacoEditor }
export { useMonaco } from './hooks/useMonaco'

export * from './types'
