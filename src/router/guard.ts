import type {Router} from "vue-router";


export default (router: Router) => {
    // 前置
    router.beforeEach((to, from) => {
        if (to.path === '/') {
            return '/dashboard/console'
        }
        if (to.name === undefined) {
            return '/NotFound'
        }
        if (from) {
            return true
        }
        document.title = to.meta.title as string
        return true
    })


}