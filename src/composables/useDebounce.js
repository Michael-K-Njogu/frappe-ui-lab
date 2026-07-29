import { ref, watch, onUnmounted } from 'vue'

export function useDebounce(source, delay = 300) {
    const debounced = ref(source.value)

    let timeoutId = null

    watch(source, (newValue) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            debounced.value = newValue
        }, delay)
    })
    
    onUnmounted(() => {
        clearTimeout(timeoutId)
    })

    return debounced
}
