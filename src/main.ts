import './assets/main.css'

import {createApp} from 'vue'
import pinia from "@/stores";
import ArcoVue from "@arco-design/web-vue";
// @ts-ignore
import App from './App.vue'
import router from './router'
import '@arco-design/web-vue/dist/arco.css'
import * as ArcoIconsVue from '@arco-design/web-vue/es/icon';

const app = createApp(App)
for (const [key, component] of Object.entries(ArcoIconsVue)) {
    app.component(key, component)
}

app.use(ArcoVue, {
    componentPrefix: 'arco'
})
app.use(pinia)
app.use(router)

app.mount('#app')
