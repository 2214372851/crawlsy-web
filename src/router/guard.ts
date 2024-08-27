import type {Router} from "vue-router";


export default (router: Router) => {
    // 前置
    router.beforeEach((to, from) => {
        console.log(to, from)
        if (to.path === '/') {
            return '/dashboard/console'
        }
        if (to.name === undefined) {
            return '/NotFound'
        }
        document.title = to.meta.title
        return true
    })


}