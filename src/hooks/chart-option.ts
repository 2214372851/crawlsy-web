import {computed} from "vue";
import useAppStore from "@/stores/modules/app";


interface optionsFn {
    (isDark: boolean): Object
}

const useChartOption = (sourceOption: optionsFn) => {
    const appStore = useAppStore()
    const isDark = computed(() => {
        return appStore.theme === 'dark'
    })
    const chartOption = computed<Object>(() => {
        return sourceOption(isDark.value)
    })
    return chartOption
}

export default useChartOption