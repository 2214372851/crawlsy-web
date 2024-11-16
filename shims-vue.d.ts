// vue-shims.d.ts
import {DefineComponent, Directive} from 'vue';
import {Method} from "axios";

declare module '*.vue' {
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

// 扩展 Vue 的类型
declare module 'vue/types/vue' {
    interface Vue {
        vPermission: Directive<HTMLElement, { permission: string; method: Method }[]>;
    }
}