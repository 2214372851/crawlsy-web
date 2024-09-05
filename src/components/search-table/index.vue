<template>
    <a-card title="节点管理" :header-style="{borderBottom: 'none'}">
        <a-form size="medium" auto-label-width :model="formValue">
            <a-grid :cols="3" :colGap="16" :rowGap="16" :collapsed="collapsed">
                <a-grid-item v-for="(item, index) in searchOptions" :key="index">
                    <a-form-item :field="item.field" :label="item.label">
                        <a-input
                            v-if="item.type === 'input'"
                            v-model="formValue[item.field]"
                            :placeholder="`请输入${item.label}`"/>
                        <a-select
                            v-else-if="item.type === 'select'"
                            v-model="formValue[item.field]"
                            :placeholder="`请选择${item.label}`"
                            :options="item.options ?? []"
                            :multiple="item.multiple ?? false"
                            scrollbar/>
                        <a-range-picker
                            v-else-if="item.type === 'dateRang'"
                            showTime
                            :time-picker-props="{ defaultValue:['00:00:00','00:00:00'] }"
                            v-model="formValue[item.field]"
                        />
                    </a-form-item>
                </a-grid-item>
            </a-grid>
            <a-form-item>
                <div style="margin-left: auto"/>
                <a-space>
                    <a-button type="primary">
                        <template #icon>
                            <icon-search/>
                        </template>
                        搜索
                    </a-button>
                    <a-button>
                        <template #icon>
                            <icon-refresh/>
                        </template>
                        重置
                    </a-button>
                </a-space>
            </a-form-item>
        </a-form>
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
                    <icon-refresh class="cursor" @click="refreshData" size="18"/>
                </a-tooltip>
                <a-dropdown @select="handleSelectDensity">
                    <a-tooltip content="密度">
                        <icon-line-height class="cursor" size="18"/>
                    </a-tooltip>
                    <template #content>
                        <a-doption
                            v-for="item in densityOptions"
                            :value="item.value"
                            :key="item.value">
                            {{ item.label }}
                        </a-doption>
                    </template>
                </a-dropdown>
                <a-tooltip content="列设置">
                    <icon-settings class="cursor" size="18"/>
                </a-tooltip>
            </a-space>
        </div>
        <a-table
            ref="tableRef"
            :row-key="rowKey"
            :columns="columns"
            :data="renderData"
            :row-selection="rowSelection"
            v-model:selectedKeys="selectedKeys"
            @page-change="handleChangePage"
            @page-size-change="handleChangePageSize"
            :size="tableSize"
            :loading="loading"
            :pagination="pagination"
            filterable>
            <template #optional="{ record }">
                <a-button @click="$modal.info({ title:'Name', content:record.name })">
                    view
                </a-button>
            </template>
        </a-table>
    </a-card>
</template>

<script lang="ts">
export default {
    name: 'SearchTable',
};
</script>

<script setup lang="ts">
import type {PaginationProps, SelectOptionData, TableData, TableRowSelection} from "@arco-design/web-vue"
import useLoading from '@/hooks/loading'
import {reactive, type Ref, ref, useTemplateRef} from "vue"


const formValue = ref<any>({
    name: '',
    dateRang: [],
})

interface SearchOption {
    label: string
    type: 'input' | 'select' | 'dateRang'
    multiple?: boolean
    field: string
    options?: SelectOptionData[]
}

withDefaults(defineProps<{
    rowKey?: string
}>(), {
    rowKey: 'key'
})
const {loading, setLoading, toggleLoading} = useLoading()
const selectedKeys = ref([])
const rowSelection = reactive<TableRowSelection>({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: true,
})
const tableSize = ref<'mini' | 'small' | 'medium' | 'large'>('medium')
const densityOptions = [
    {label: '迷你', value: 'mini'},
    {label: '偏小', value: 'small'},
    {label: '中等', value: 'medium'},
    {label: '偏大', value: 'large'}
]
const collapsed = ref(true)
const tableRef = useTemplateRef("tableRef")
const basePagination = {
    current: 1,
    pageSize: 5
}
const pagination: Ref<PaginationProps> = ref({
    showPageSize: true,
    pageSizeOptions: [5, 10, 15],
    size: 'mini',
    ...basePagination
})
const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Salary',
        dataIndex: 'salary',
    },
    {
        title: 'Address',
        dataIndex: 'address',
    },
    {
        title: 'Email',
        dataIndex: 'email',
    },
    {
        title: 'Optional',
        slotName: 'optional'
    }
]
const searchOptions: Ref<SearchOption[]> = ref([
    {
        label: '用户名',
        type: 'input',
        field: 'name',
    },
    {
        label: '用户名',
        type: 'input',
        field: 'name',
    },
    {
        label: '密码',
        type: 'select',
        multiple: true,
        field: 'name',
        options: [
            {label: '选项1', value: '1'},
            {label: '选项2', value: '2'},
        ],
    },
    {
        label: '日期范围',
        type: 'dateRang',
        field: 'dateRang',
    },
])
const renderData = ref<TableData[]>([]);
const fetchData = async (params: any = basePagination) => {
    setLoading(true);
    try {
        const data = []
        for (let i = 0; i < params.pageSize; i++) {
            data.push({
                key: i.toString(),
                name: `Edrward ${i} ${params.current}`,
                salary: Date.now(),
                address: `London Park no. ${i} ${params.current}`,
                email: `@ ${i} ${params.current}`,
            })
        }
        renderData.value = data as TableData[];
        pagination.value.current = params.current;
        pagination.value.total = 120;
    } catch (err) {
        console.error(err)
        // you can report use errorHandler or other
    } finally {
        setTimeout(() => setLoading(false), 2000)
    }
}
const handleSelectDensity = (val: string | number | Record<string, any> | undefined) => {
    tableSize.value = val as "small" | "mini" | "medium" | "large"
};
const handleChangePage = (current: number) => {
    pagination.value.current = current
    fetchData({...pagination.value, current})

}
const handleChangePageSize = (pageSize: number) => {
    pagination.value.pageSize = pageSize
}
const refreshData = async () => {
    setLoading(true)
    await fetchData({...pagination.value})
}
fetchData()
</script>


<style scoped lang="less">
.cursor {
    cursor: pointer;
}
</style>