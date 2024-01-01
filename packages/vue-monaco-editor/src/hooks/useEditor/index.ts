import type { SetupContext, ShallowRef, WatchCallback } from 'vue-demi'
import { computed, h, shallowRef, watch } from 'vue-demi'
import { useStyle } from '../useStyle'
import { useMonaco } from '../useMonaco'
import type { DiffEditorProps, EditorEmitsOptions, EditorProps } from '../../types'
import { getSlotHelper } from '../../utils'

export function useEditor(
  props: EditorProps | DiffEditorProps,
  ctx: SetupContext<EditorEmitsOptions>,
  editorRef: ShallowRef,
  key: string,
) {
  const { monacoRef, unload } = useMonaco()
  const containerRef = shallowRef<HTMLDivElement | null>(null)
  const isEditorReady = computed(() => !!monacoRef.value && !!editorRef.value)

  const { getWrapperStyle, getContainerStyle, getLoadingStyle } = useStyle({
    width: props.width,
    height: props.height,
  }, isEditorReady)

  function whenMonacoIsReady<V = any, OV = any>(callback: WatchCallback<V, OV>) {
    return function (...args: any[]) {
      // @ts-expect-error
      // eslint-disable-next-line ts/no-invalid-this
      if (isEditorReady.value) callback.apply(this, args)
    }
  }

  // theme
  watch(
    () => props.theme,
    whenMonacoIsReady<string>(newTheme => monacoRef.value?.editor.setTheme(newTheme)),
  )

  // options
  watch(
    () => props.options,
    newOptions => editorRef.value?.updateOptions(newOptions),
    { deep: true },
  )

  const render = () => {
    return h(
      'section',
      {
        style: getWrapperStyle.value,
      },
      [
        !isEditorReady.value
          && h(
            'div',
            {
              style: getLoadingStyle.value,
            },
            ctx.slots?.loading ? getSlotHelper(ctx.slots?.loading) : 'loading...',
          ),
        h('div', {
          ref: containerRef,
          key,
          style: getContainerStyle.value,
          class: props.className,
        }),
      ],
    )
  }

  return { render, monacoRef, containerRef, unload, whenMonacoIsReady }
}
