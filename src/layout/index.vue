<template>
    <a-layout class="layout">
        <a-layout-header class="layout-header">
            <a-page-header :show-back="false">
                <template #title>
                    <a-space>
                        <img src="/icon.png" alt="icon" style="height: 24px">
                        <span>Spider Manager</span>
                    </a-space>
                </template>
                <template #subtitle>
                    <a-breadcrumb :routes="breadcrumbs">
                        <template #item-render="item">
                            <a-link>
                                {{ item.route.label }}
                            </a-link>
                        </template>
                    </a-breadcrumb>
                </template>
                <template #extra>
                    <a-space size="medium">
                        <a-button @click="()=>{console.log('hello')}">
                            <template #icon>
                                <icon-search/>
                            </template>
                        </a-button>
                        <a-button @click="handleFullScreen">
                            <template #icon>
                                <icon-fullscreen v-if="!fullscreen"/>
                                <icon-fullscreen-exit v-else/>
                            </template>
                        </a-button>
                        <a-popover
                            :content-style="{ padding:'3px', margin: '0px' }">
                            <a-button>
                                <template #icon>
                                    <icon-sun-fill v-if="appStore.theme === 'light'"/>
                                    <icon-moon-fill v-else-if="appStore.theme === 'dark'"/>
                                    <icon-desktop v-else/>
                                </template>
                            </a-button>
                            <template #content>
                                <a-radio-group
                                    direction="vertical"
                                    type="button"
                                    v-model:model-value="appStore.theme"
                                    @change="appStore.toggleTheme">
                                    <a-grid :cols="1">
                                        <a-grid-item>
                                            <a-radio value="light">亮色主题</a-radio>
                                        </a-grid-item>
                                        <a-grid-item>
                                            <a-radio value="dark">暗色主题</a-radio>
                                        </a-grid-item>
                                        <a-grid-item>
                                            <a-radio value="auto">跟随系统</a-radio>
                                        </a-grid-item>
                                    </a-grid>
                                </a-radio-group>
                            </template>
                        </a-popover>
                        <a-avatar :style="{ backgroundColor: '#14a9f8' }">Arco</a-avatar>
                    </a-space>
                </template>
            </a-page-header>
        </a-layout-header>

        <a-layout>
            <a-layout-sider
                hide-trigger
                collapsible
                :collapsed="collapsed">
                <Menu @collapse="onCollapse"/>
            </a-layout-sider>

            <a-layout>
                <a-scrollbar style="overflow: auto;height: calc(100vh - 55px);width: 100%;">
                    <a-layout-content style="padding: 24px;">
                        <RouterView/>
                    </a-layout-content>
                </a-scrollbar>

            </a-layout>
        </a-layout>
    </a-layout>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {useRoute} from "vue-router";
import Menu from "@/components/menu/index.vue"
import type {BreadcrumbItem} from "@/types/global";
import useAppStore from "@/stores/modules/app";


const route = useRoute()
const appStore = useAppStore()
const fullscreen = ref(false)
const collapsed = ref(window.innerWidth < 1200)
document.addEventListener('resize', () => {
    collapsed.value = window.innerWidth < 1200
})
const breadcrumbs = computed(() => {
    let paths = route.path.split('/')
    let crumbList: BreadcrumbItem[] = []
    for (let i = 0; i < paths.length; i++) {
        crumbList.push({label: paths[i], path: paths[i]});
    }
    return crumbList
})
const onCollapse = (value: boolean) => {
    collapsed.value = value
}
const handleFullScreen = () => {
    let element = document.documentElement
    if (fullscreen.value) {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else {
            alert('浏览器不支持')
        }
    } else {
        if (element.requestFullscreen) {
            element.requestFullscreen()
        }
    }
    fullscreen.value = !fullscreen.value

}

onMounted(() => {
})
</script>

<script lang="ts">
export default {
    name: "Layout"
}
</script>

<style lang="less" scoped>
.layout {
    height: 100vh;

    .layout-header {
        padding-left: 20px;
        border-bottom: 1px solid var(--color-border)
    }

    :deep(.arco-layout-header) {
        padding-left: 0 !important;
    }

    :deep(.arco-page-header) {
        padding: 7px 0 !important;
    }
}


</style>