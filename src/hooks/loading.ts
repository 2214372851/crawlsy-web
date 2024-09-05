import {ref} from "vue";

const useLoading = (state: boolean = false) => {
    const loading = ref(state);
    const setLoading = (state: boolean) => loading.value = state;

    const toggleLoading = () => loading.value = !loading.value;

    return {loading, setLoading, toggleLoading}
}

export default useLoading