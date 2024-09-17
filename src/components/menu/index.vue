<template>
    <a-menu
        :style="{ width: '200px', height: '100%' }"
        :default-selected-keys="[selectKey]"
        show-collapse-button
        breakpoint="xl"
        @menu-item-click="onClickMenuItem"
        @collapse="onCollapse">
        <template v-for="(menu, index) in newMenus" :key="'top' + index">
            <a-menu-item v-if="!menu.children.length" :key="menu.path">
                <template #icon>
                    <component :is="menu.icon"/>
                </template>
                {{ menu.name }}
            </a-menu-item>
            <a-sub-menu v-else :key="menu.path">
                <template #icon>
                    <component :is="menu.icon"/>
                </template>
                <template #title>{{ menu.name }}</template>
                <a-menu-item v-for="subMenu in menu.children" :key="subMenu.path">
                    {{ subMenu.name }}
                </a-menu-item>

            </a-sub-menu>

        </template>


    </a-menu>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import type {MenuItem} from "@/types/global";

const router = useRouter()
const selectKey = router.currentRoute.value.path
const emits = defineEmits(['collapse'])


const menus = [
    {
        "id": 1,
        "createTime": "2024-07-07 14:08:03",
        "updateTime": "2024-07-07 14:08:03",
        "parent": null,
        "name": "仪表板",
        "icon": "IconApps",
        "path": "/dashboard"
    },
    {
        "id": 2,
        "createTime": "2024-07-07 14:08:03",
        "updateTime": "2024-07-07 14:08:03",
        "parent": null,
        "name": "节点管理",
        "icon": "iconStorage",
        "path": "/node"
    },
    {
        "id": 5,
        "createTime": "2024-07-07 14:08:03",
        "updateTime": "2024-07-07 14:08:03",
        "parent": null,
        "name": "爬虫管理",
        "icon": "IconBug",
        "path": "/spider"
    },
]


const onClickMenuItem = (key: string) => {
    router.push({path: key})
}
const onCollapse = (value: boolean) => {
    emits('collapse', value)
}
const buildMenuTree = (menus: MenuItem[]) => {
    const topLevelMenus = menus.filter(menu => menu.parent === null);
    const buildTree = (menu: MenuItem) => {
        const children: MenuItem[] = [];
        menus.forEach(child => {
            if (child.parent === menu.id) {
                children.push(buildTree(child));
            }
        });
        return {...menu, children};
    };
    return topLevelMenus.map(menu => buildTree(menu));
}

const newMenus = buildMenuTree(menus)
</script>

<style scoped lang="less">

</style>