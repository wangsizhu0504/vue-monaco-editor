import { onMounted, shallowRef } from 'vue-demi'
import loader from '@vue-monaco/loader'
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
