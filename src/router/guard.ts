import type {Router} from "vue-router";
import useAppStore from "@/stores/modules/app";


export default (router: Router) => {
    // 前置
    router.beforeEach((to, from) => {

        if (to.path === '/') {
            return '/dashboard'
        }
        if (to.name === undefined) {
            return '/NotFound'
        }
        console.log(from, to)
        const appStore = useAppStore()
        appStore.addVisitedRoute({
            name: to.name as string,
            path: to.path
        })
        document.title = to.meta.title as string
        return true
    })


}