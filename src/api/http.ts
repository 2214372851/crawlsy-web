import axios from "axios";
import { Notification } from '@arco-design/web-vue';
import router from "@/router";
import useUserStore from "@/stores/modules/user";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

const http = axios.create({
    baseURL: VITE_BASE_URL,
    timeout: 5000,
})
http.defaults.headers.post["Content-Type"] = "application/json";

http.interceptors.request.use(
    (config) => {
        const userStore = useUserStore()
        config.headers.token = userStore.accessToken || null
        if (config.url?.includes("refresh")) {
            config.headers.refreshToken = userStore.refreshToken || null
        }
        return config
    },
    (error) => {
        Notification.error({
            content: "请求失败，请稍后重试",
            duration: 5000
        })
        console.error("Request error:", error);
        throw new Error(error)
    }
)

http.interceptors.response.use(
    async (response) => {
        if (response.data.code !== 0) {
            if ([16].includes(response.data.code)) {
                const userStore = useUserStore()
                if (!userStore.refreshToken) {
                    router.push("/login")
                    return
                }
                try {
                    if (response.config.url?.includes("refresh")) return
                    userStore.accessToken = ''
                    await userStore.refresh()
                    return await http(response.config)
                } catch (e) {
                    userStore.clearUserInfo()
                    Notification.error({
                        content: "登录已过期，请重新登录",
                        duration: 5000
                    })
                    router.push("/login")
                    return
                }
            }
            Notification.error({
                content: response.data.msg,
                duration: 5000
            })
        }
        return response.data
    },
    (error) => {
        Notification.error({
            content: "请求失败，请稍后重试",
            duration: 5000
        })
        console.error("Response error:", error);
        throw new Error(error)
    }
)

export default http