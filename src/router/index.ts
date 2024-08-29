import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'
import guard from "@/router/guard";
import type {MetaType} from "@/types";


const pages: Record<string, MetaType> = import.meta.glob('../views/**/page.ts', {
    eager: true,
    import: 'default'
});
console.log(pages)
const comps = import.meta.glob('../views/**/index.vue');

const routes: ReadonlyArray<RouteRecordRaw> = Object.entries(pages).map(([path, meta]) => {
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
