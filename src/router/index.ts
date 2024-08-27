import {createRouter, createWebHistory} from 'vue-router'
import guard from "@/router/guard";

const pages = import.meta.glob('../views/**/page.ts', {
    eager: true,
    import: 'default'
});
const comps = import.meta.glob('../views/**/index.vue');

const routes = Object.entries(pages).map(([path, meta]) => {
    const compPath = path.replace('page.ts', 'index.vue')
    path = path.replace('../views', '').replace('/page.ts', '') || '/'
    if (meta.layout) {
        return {
            path,
            component: () => import('../layout/index.vue'),
            children: [
                {
                    path: '',
                    name: path.split('/').filter(Boolean).join('-'),
                    component: comps[compPath],
                    meta
                }
            ]
        }
    }
    return {
        path,
        name: path.split('/').filter(Boolean).join('-'),
        component: comps[compPath],
        meta
    }
})


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
})
guard(router)
export default router
