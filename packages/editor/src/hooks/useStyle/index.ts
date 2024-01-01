import { computed } from 'vue-demi'
import type { CSSProperties, Ref } from 'vue-demi'
import { processSize } from '../../utils'

interface ContainerProps {
  width: number | string
  height: number | string
}

export function useStyle(props: ContainerProps, isEditorReady: Ref<boolean>) {
  const getWrapperStyle = computed((): CSSProperties => {
    return {
      display: 'flex',
      position: 'relative',
      textAlign: 'initial',
      width: processSize(props.width),
      height: processSize(props.height),
    }
  })
  const getContainerStyle = computed((): CSSProperties => {
    const style: CSSProperties = {
      width: '100%',
    }
    if (!isEditorReady.value)
      style.display = 'none'

    return style
  })

  const getLoadingStyle = computed((): CSSProperties => {
    return {
      display: 'flex',
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    }
  })

  return { getWrapperStyle, getContainerStyle, getLoadingStyle }
}
