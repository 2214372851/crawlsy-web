<template>
    <a-card title="节点管理" :header-style="{borderBottom: 'none'}">
        <TableHeader :collapsed="collapsed"/>
        <a-divider/>
        <div style="display: flex;justify-content: space-between;margin-bottom: 18px;">
            <a-space size="medium">
                <a-button type="primary">
                    <template #icon>
                        <icon-plus/>
                    </template>
                    新建
                </a-button>
                <a-button>
                    批量导入
                </a-button>
            </a-space>
            <a-space size="medium">
                <a-button>
                    <template #icon>
                        <icon-download/>
                    </template>
                    下载
                </a-button>
                <a-tooltip content="刷新">
                    <icon-refresh size="18"/>
                </a-tooltip>


                <a-dropdown>
                    <a-tooltip content="密度">
                        <icon-line-height size="18"/>
                    </a-tooltip>
                    <template #content>
                        <a-doption>迷你</a-doption>
                        <a-doption>偏小</a-doption>
                        <a-doption>中等</a-doption>
                        <a-doption>偏大</a-doption>
                    </template>
                </a-dropdown>
                <a-tooltip content="列设置">
                    <icon-settings size="18"/>
                </a-tooltip>
            </a-space>

        </div>
        <Table/>
    </a-card>
</template>

<script setup lang="ts">
import TableHeader from "@/views/node/TableHeader.vue";
import Table from "@/views/node/Table.vue";
import {ref} from "vue";

const collapsed = ref(true)
</script>

<style scoped lang="less">

</style>