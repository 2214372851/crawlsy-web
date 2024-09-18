<template>
  <a-card :title="`${name}管理`" :header-style="{borderBottom: 'none'}">
    <Search :collapsed="collapsed" :search-options="searchOptions" v-model="formValue" @reset="refreshData"
            @submit="fetchData"/>
    <a-divider/>
    <a-grid :cols="{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }" :colGap="12" :rowGap="16" class="table-toolbar">
      <a-grid-item :span="1">
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
      </a-grid-item>
      <a-grid-item suffix style="margin-left: auto">
        <a-space size="medium">
          <a-button>
            <template #icon>
              <icon-download/>
            </template>
            下载
          </a-button>
          <a-tooltip content="刷新">
            <icon-refresh class="cursor" @click="refreshData" size="18" :disabled="loading"/>

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
          <a-tooltip content="折叠搜索栏">
            <icon-to-bottom class="cursor" size="18" v-if="collapsed" @click="collapsed = !collapsed"/>
            <icon-to-top class="cursor" size="18" v-else @click="collapsed = !collapsed"/>
          </a-tooltip>
        </a-space>
      </a-grid-item>
    </a-grid>
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
        :bordered="{cell:true}"
        column-resizable
        stripe
        filterable>
      <template #status="{ record }">
        <a-tag color="green" v-if="record.status">正常</a-tag>
        <a-tag color="red" v-else>禁用</a-tag>
      </template>
      <template #createTime="{ record }">
        <a-tag color="arcoblue">{{ record.createTime }}</a-tag>
      </template>
      <template #updateTime="{ record }">
        <a-tag color="arcoblue">{{ record.updateTime }}</a-tag>
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button status="normal" @click="editStartHandle(record.uid ?? record.id)">
            修改
          </a-button>
          <a-button status="danger">
            删除
          </a-button>
        </a-space>
      </template>
    </a-table>
    <a-modal
        :title="`${name}编辑`"
        width="600px"
        v-model:visible="editVisible"
        @cancel="editHandleCancel"
        :on-before-ok="editHandleBeforeOk" unmountOnClose>
      <slot name="edit-content" :data="editFormValue" @update-data="updateData"/>
    </a-modal>
  </a-card>
</template>


<script setup lang="ts">
import type {PaginationProps, TableData, TableRowSelection} from "@arco-design/web-vue"
import useLoading from '@/hooks/loading'
import {onMounted, reactive, type Ref, ref, useTemplateRef} from "vue"
import Search from "@/components/search/index.vue";
import type {ApiListResponse, SearchOption} from "@/types/global";
import {Message} from "@arco-design/web-vue";
import type {ApiResponse} from "@/types/global";


const formValue = ref<Record<string, any>>({})
const editFormValue = ref<Record<string, any>>({})
const editItemKey = ref('')
const editVisible = ref(false)
const {rowKey = 'key', dataApi, editApi, infoApi} = defineProps<{
  name: string,
  rowKey?: string,
  searchOptions: SearchOption[],
  columns: { title: string, dataIndex?: string, slotName?: string }[],
  dataApi: (params: Record<string, any>) => Promise<ApiResponse<ApiListResponse<any>>>
  editApi: (id: string, data: Record<string, any>) => Promise<ApiResponse<any>>
  infoApi: (id: string) => Promise<ApiResponse<any>>
}>()
const {loading, setLoading} = useLoading()
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
const renderData = ref<TableData[]>([]);
const handleSelectDensity = (val: string | number | Record<string, any> | undefined) => {
  tableSize.value = val as "small" | "mini" | "medium" | "large"
};
const handleChangePageSize = (pageSize: number) => {
  const lastSize = pagination.value.pageSize as number
  pagination.value.pageSize = pageSize
  if (pagination.value.current === 1 && lastSize < pageSize) {
    fetchData(pagination.value)
  }
}
const handleChangePage = (current: number) => {
  pagination.value.current = current
  fetchData({...pagination.value, current})
}
const fetchData = async (params: any = basePagination) => {
  setLoading(true);
  try {
    const res = await dataApi({...formValue.value, ...params})
    if (!res.data) return
    renderData.value = res.data.list;
    pagination.value.current = params.current;
    pagination.value.total = res.data?.total;
  } catch (err) {
    console.error(err)
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}
const refreshData = async () => {
  setLoading(true)
  await fetchData({...pagination.value})
}
const editStartHandle = async (id: string) => {
  const {code, data} = await infoApi(id)
  if (code !== 0) return
  editVisible.value = true;
  editItemKey.value = id;
  editFormValue.value = data;
}
const editHandleCancel = () => {
  editVisible.value = false;
}
const editHandleBeforeOk = async () => {
  try {
    const {code} = await editApi(editItemKey.value, editFormValue.value)
    await fetchData(pagination.value)
    Message.success({
      content: "修改成功",
      duration: 5000
    })
    return code === 0;
  } catch (e) {
    return false;
  }
}
const updateData = (newValue: Record<string, any>) => {
  editFormValue.value = newValue;
};
onMounted(async () => await fetchData(pagination.value))
</script>

<script lang="ts">
export default {
  name: 'SearchTable',
};
</script>

<style scoped lang="less">
.cursor {
  cursor: pointer;
}
.table-toolbar {
  margin-bottom: 12px;
}
</style>