import type {Router} from "vue-router";
import useAppStore from "@/stores/modules/app";
import useUserStore from "@/stores/modules/user";


export default (router: Router) => {
    // 前置
    router.beforeEach((to, from) => {
        const userStore = useUserStore()
        if (!userStore.accessToken && to.path !== '/login') {
            return '/login'
        }
        if (to.path === '/') {
            return '/dashboard'
        }
        if (to.name === undefined) {
            return '/NotFound'
        }
        const appStore = useAppStore()
        appStore.addVisitedRoute({
            name: to.name as string,
            path: to.path
        })
        document.title = to.meta.title as string
        return true
    })


}