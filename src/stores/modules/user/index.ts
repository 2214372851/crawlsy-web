import {defineStore} from "pinia";
import {ref} from "vue";
import {logoutApi, refreshApi} from "@/api/modules/login";
import router from "@/router";

type UserState = {
    username: string;
    refreshToken: string;
    accessToken: string;
}

const useUserStore = defineStore('user', () => {
    const username = ref('admin');
    const refreshToken = ref('');
    const accessToken = ref('');

    const setUserInfo = (data: UserState) => {
        username.value = data.username;
        refreshToken.value = data.refreshToken;
        accessToken.value = data.accessToken;
    }

    const clearUserInfo = () => {
        username.value = '';
        refreshToken.value = '';
        accessToken.value = '';
    }

    const logout = async () => {
        await logoutApi();
        clearUserInfo();
        router.push('/login')
    }

    const refresh = async () => {
        const {code, data} = await refreshApi()
        if (code !== 0 || !data) {
            clearUserInfo();
            return;
        }
        accessToken.value = data.accessToken;
    }

    return {username, refreshToken, accessToken, setUserInfo, clearUserInfo, logout, refresh};
}, {
    persist: {
        storage: localStorage,
        paths: ['username', 'refreshToken', 'accessToken'],
    }
});

export default useUserStore