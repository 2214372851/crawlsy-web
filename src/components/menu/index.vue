<script setup lang="ts">
import {defineEmits} from 'vue'

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
        "name": "首页",
        "icon": "Home",
        "path": "home"
    },
    {
        "id": 2,
        "createTime": "2024-07-07 14:08:03",
        "updateTime": "2024-07-07 14:08:03",
        "parent": 1,
        "name": "用户管理",
        "icon": "User",
        "path": "user"
    },
    {
        "id": 3,
        "createTime": "2024-07-07 14:08:03",
        "updateTime": "2024-07-07 14:08:03",
        "parent": null,
        "name": "角色管理",
        "icon": "Role",
        "path": "role"
    },
    {
        "id": 4,
        "createTime": "2024-07-07 14:08:03",
        "updateTime": "2024-07-07 14:08:03",
        "parent": 3,
        "name": "菜单管理",
        "icon": "Menu",
        "path": "menu"
    },
    {
        "id": 5,
        "createTime": "2024-07-07 14:08:03",
        "updateTime": "2024-07-07 14:08:03",
        "parent": 4,
        "name": "权限管理",
        "icon": "Permission",
        "path": "permission"
    }
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

<template>
    <a-menu
        :style="{ width: '200px', height: '100%' }"
        :default-open-keys="['0']"
        :default-selected-keys="['0_2']"
        show-collapse-button
        breakpoint="xl"
        @collapse="onCollapse">
        <a-sub-menu key="0">
            <template #icon>
                <icon-apps></icon-apps>
            </template>
            <template #title>仪表盘</template>
            <a-menu-item key="0_0">
                主控台
            </a-menu-item>
            <a-menu-item key="0_1">
                工作台
            </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="1">
            <template #icon>
                <icon-bug></icon-bug>
            </template>
            <template #title>Navigation 2</template>
            <a-menu-item key="1_0">Menu 1</a-menu-item>
            <a-menu-item key="1_1">Menu 2</a-menu-item>
            <a-menu-item key="1_2">Menu 3</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="2">
            <template #icon>
                <icon-bulb></icon-bulb>
            </template>
            <template #title>Navigation 3</template>
            <a-menu-item key="2_0">Menu 1</a-menu-item>
            <a-menu-item key="2_1">Menu 2</a-menu-item>
            <a-sub-menu key="2_2" title="Navigation 4">
                <a-menu-item key="2_2_0">Menu 1</a-menu-item>
                <a-menu-item key="2_2_1">Menu 2</a-menu-item>
            </a-sub-menu>
        </a-sub-menu>
    </a-menu>
</template>

<style scoped lang="less">

</style>