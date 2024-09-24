import {defineStore} from "pinia";
import {ref} from "vue";
import {
    type LoginResponse,
    logoutApi,
    type MenuData,
    type PermissionData,
    refreshApi,
    type RoleData
} from "@/api/modules/login";
import router from "@/router";

const useUserStore = defineStore('user', () => {
    const username = ref('');
    const email = ref('');
    const refreshToken = ref('');
    const accessToken = ref('');
    const permissions = ref<PermissionData>({});
    const menus = ref<MenuData>([]);
    const role = ref<RoleData>([]);

    const setUserInfo = (data: LoginResponse) => {
        username.value = data.username;
        refreshToken.value = data.refreshToken;
        accessToken.value = data.accessToken;
        email.value = data.email;
        permissions.value = data.permissions;
        menus.value = data.menus;
        role.value = data.role;
    }

    const clearUserInfo = () => {
        username.value = '';
        refreshToken.value = '';
        accessToken.value = '';
        email.value = '';
        permissions.value = {};
        menus.value = [];
        role.value = [];
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

    return {
        username, refreshToken, accessToken,
        email, permissions, menus, role,
        setUserInfo, clearUserInfo, logout, refresh
    };
}, {
    persist: {
        storage: localStorage,
        paths: ['username', 'refreshToken', 'accessToken', 'email', 'permissions', 'menus', 'role'],
    }
});

export default useUserStore