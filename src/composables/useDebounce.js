import { ref, watch, onUnmounted } from 'vue'

export function useDebounce(source, delay = 300) {
    const debounced = ref(source.value)

    let timeoutId = null

    watch(source, (newValue, _, onCleanup) => {
    const timeoutId = setTimeout(() => {
        debounced.value = newValue
    }, delay)

    onCleanup(() => {
        clearTimeout(timeoutId)
    })
    })

    return debounced
}
