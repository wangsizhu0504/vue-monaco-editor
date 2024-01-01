import { onMounted, shallowRef } from 'vue-demi'
import loader from 'monaco-editor-loader'
import type { Monaco } from '../../types'

export function useMonaco() {
  const monacoRef = shallowRef<Monaco | null>(loader.getMonacoInstance())

  let cancelable: ReturnType<(typeof loader)['init']>

  onMounted(async () => {
    try {
      // Avoid duplicate initialization of instances
      if (monacoRef.value) return

      cancelable = loader.init()
      monacoRef.value = await cancelable
      console.log('monacoRef', monacoRef.value)
    } catch (error: any) {
      if (error?.type !== 'cancelation')
        console.error('Monaco initialization error:', error)
    }
  })

  // monaco mount
  const unload = () => cancelable?.cancel()

  return {
    monacoRef,
    unload,
  }
}
