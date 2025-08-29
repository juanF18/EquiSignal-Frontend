import { ref, watch, type Ref } from "vue";

export function useDebounce<T>(value: Ref<T>, delay = 500) {
    const debounced = ref<T>(value.value) as Ref<T>;
    let timeout: number | undefined;

    watch(value, (newVal) => {
        if (timeout) clearTimeout(timeout);
        timeout = window.setTimeout(() => {
            debounced.value = newVal;
        }, delay);
    });

    return debounced;
}
