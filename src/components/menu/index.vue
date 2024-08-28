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
import {defineEmits} from 'vue'
import {useRouter} from "vue-router";

const router = useRouter()
const selectKey = router.currentRoute.value.path
console.log(selectKey)
const onClickMenuItem = (key: String) => {
    router.push(key)
}
const emits = defineEmits(['collapse'])
const onCollapse = (value: boolean) => {
    emits('collapse', value)
}

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
        "parent": 1,
        "name": "主控台",
        "icon": "",
        "path": "/dashboard/console"
    },
    {
        "id": 3,
        "createTime": "2024-07-07 14:08:03",
        "updateTime": "2024-07-07 14:08:03",
        "parent": 1,
        "name": "仪表盘",
        "icon": "",
        "path": "/dashboard/workplace"
    },
    {
        "id": 4,
        "createTime": "2024-07-07 14:08:03",
        "updateTime": "2024-07-07 14:08:03",
        "parent": null,
        "name": "Login",
        "icon": "IconCode",
        "path": "/login"
    },
]

function buildMenuTree(menus) {
    const topLevelMenus = menus.filter(menu => menu.parent === null);
    const buildTree = (menu) => {
        const children = [];
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