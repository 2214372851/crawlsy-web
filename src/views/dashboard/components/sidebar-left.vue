<template>
    <a-space :size="16" direction="vertical">
        <a-card :style="{ width: '100%' }" title="平台公告">
            <template #extra>
                <a-link>查看更多</a-link>
            </template>
            <a-list size="small" :bordered="false">
                <a-list-item v-for="(item, index) in platformMsg" :key="index">
                    <a-tag color="blue">消息</a-tag>
                    {{ item }}
                    <template #actions>
                        <icon-edit/>
                        <icon-delete/>
                    </template>
                </a-list-item>
            </a-list>
        </a-card>
        <a-card :style="{ width: '100%' }" title="快捷操作">
            <template #extra>
                <a-link>管理</a-link>
            </template>
            <a-row>
                <a-col :span="8">
                    <a-link href="#" target="_blank" icon>Help</a-link>
                </a-col>
                <a-col :span="8">
                    <a-link href="https://gitee.com" target="_blank" icon>Gitee</a-link>
                </a-col>
                <a-col :span="8">
                    <a-link href="https://github.com" target="_blank" icon>Github</a-link>
                </a-col>
            </a-row>
        </a-card>
        <a-card :style="{ width: '100%' }" title="最近访问">
            <a-grid :cols="{ xs: 1, sm: 2}" :colGap="24" :rowGap="16">
                <a-grid-item v-for="(item, index) in appStore.recentlyVisitedRoutes"
                             :key="index">
                    <a-link :href="item.path" target="_blank" icon>{{ item.name }}</a-link>
                </a-grid-item>
            </a-grid>
        </a-card>
    </a-space>
</template>

<script setup lang="ts">
import useAppStore from "@/stores/modules/app";
import {ref} from "vue";

const appStore = useAppStore()
const platformMsg = ref([
    '长相思兮长相忆',
    '断相思兮无穷极',
    '为天地立心',
    '为生民立命',
    '为往圣继绝学',
    '为万世开太平',
])
</script>

<style scoped lang="less">

</style>