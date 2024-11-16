<template>
  <a-card :title="`${name}管理`" :header-style="{borderBottom: 'none'}">
    <Search :loading="loading" :collapsed="collapsed" :search-options="searchOptions" v-model="formValue"
            @reset="resetData"
            @submit="fetchData"/>
    <a-divider/>
    <a-grid :cols="{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }" :colGap="12" :rowGap="16" class="table-toolbar">
      <a-grid-item :span="1">
        <a-space size="medium">
          <a-button
              type="primary"
              @click="addStartHandle"
              v-permission="[
                  {
                    permission: `${permission}-create`,
                    method: 'POST'
                  }
                ]">
            <template #icon>
              <icon-plus/>
            </template>
            新建
          </a-button>
          <a-button
              status="danger"
              @click="deleteBatchHandle"
              v-permission="[
                  {
                    permission: `${permission}-delete`,
                    method: 'DELETE'
                  }
                ]">
            <template #icon>
              <icon-delete/>
            </template>
            删除
          </a-button>
        </a-space>
      </a-grid-item>
      <a-grid-item suffix style="margin-left: auto">
        <a-space size="medium">
          <!--          <a-button>-->
          <!--            <template #icon>-->
          <!--              <icon-download/>-->
          <!--            </template>-->
          <!--            下载-->
          <!--          </a-button>-->
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
      <template #user="{ record }">
        <a-tag>{{ record.founderUser.username }}</a-tag>
      </template>
      <template #isTiming="{ record }">
        <a-tag color="green" v-if="record.isTiming">是</a-tag>
        <a-tag color="red" v-else>否</a-tag>
      </template>
      <template #severity="{ record }">
        <a-tag color="arcoblue" v-if="record.severity == 'info'">通知</a-tag>
        <a-tag color="orange" v-else-if="record.severity == 'warning'">警告</a-tag>
        <a-tag color="red" v-else>严重</a-tag>
      </template>
      <template #status="{ record }">
        <a-tag color="green" v-if="record.status">可用</a-tag>
        <a-tag color="red" v-else>不可用</a-tag>
      </template>
      <template #createTime="{ record }">
        <a-tag color="arcoblue">{{ record.createTime }}</a-tag>
      </template>
      <template #lastTriggerTime="{ record }">
        <a-tag color="arcoblue">{{ record.lastTriggerTime? record.lastTriggerTime: '未触发' }}</a-tag>
      </template>
      <template #updateTime="{ record }">
        <a-tag color="arcoblue">{{ record.updateTime }}</a-tag>
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button
              v-if="isLook"
              type="primary"
              status="normal"
              @click="lookHandle?.(record.uid ?? record.id)"
              v-permission="[
                  {
                    permission: `${permission}-detail`,
                    method: 'GET'
                  }
                ]">
            查看
          </a-button>
          <a-button
              status="normal"
              @click="editStartHandle(record.uid ?? record.id)"
              v-permission="[
                  {
                    permission: `${permission}-update`,
                    method: 'PUT'
                  }
                ]">
            修改
          </a-button>
          <a-popconfirm content="确认删除吗?" type="warning" @ok="deleteHandle(record.uid ?? record.id)">
            <a-button
                status="danger"
                v-permission="[
                  {
                    permission: `${permission}-delete`,
                    method: 'DELETE'
                  }
                ]">
              删除
            </a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>
    <a-modal
        :title="`${name}编辑`"
        width="600px"
        v-model:visible="editVisible"
        @cancel="editHandleCancel"
        :on-before-ok="editHandleBeforeOk"
        unmountOnClose>
      <slot name="edit-content" :data="editFormValue" @update-data="editUpdateData"/>
    </a-modal>
    <a-modal
        :title="`${name}新建`"
        width="600px"
        v-model:visible="addVisible"
        @cancel="addHandleCancel"
        :on-before-ok="addHandleBeforeOk" unmountOnClose>
      <slot name="add-content" :data="addFormValue" @update-data="addUpdateData"/>
    </a-modal>
  </a-card>
</template>


<script setup lang="ts">
import type {PaginationProps, TableData, TableRowSelection} from "@arco-design/web-vue"
import {Message} from "@arco-design/web-vue";
import useLoading from '@/hooks/loading'
import {onMounted, reactive, type Ref, ref, useTemplateRef} from "vue"
import Search from "@/components/search/index.vue";
import type {AnyObject, ApiListResponse, ApiResponse, SearchOption} from "@/types/global";


const formValue = ref<Record<string, any>>({})
const editFormValue = ref<Record<string, any>>({})
const addFormValue = ref<Record<string, any>>({})
const editItemKey = ref('')
const editVisible = ref(false)
const addVisible = ref(false)
const {
  rowKey = 'id',
  isLook = false,
  permission,
  dataApi,
  editApi,
  infoApi,
  addApi,
  delApi,
  editFormRef,
  addFormRef
} = defineProps<{
  name: string,
  permission: string,
  isLook?: boolean,
  lookHandle?: (id: string) => void
  rowKey?: string,
  searchOptions: SearchOption[],
  columns: { title: string, dataIndex?: string, slotName?: string }[],
  dataApi: (params: any) => Promise<ApiResponse<ApiListResponse<any>>>
  editApi: (id: string, data: any) => Promise<ApiResponse<any>>
  infoApi: (id: string) => Promise<ApiResponse<any>>
  addApi: (data: any) => Promise<ApiResponse<any>>
  delApi: (id: string) => Promise<ApiResponse<any>>
  editFormRef: any
  addFormRef: any
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
    const {current, pageSize} = params
    const {code, data} = await dataApi({...formValue.value, page: current, pageSize})
    if (code !== 0) return
    renderData.value = data?.list as TableData[];
    pagination.value.current = params.current;
    pagination.value.total = data?.total;
  } catch (err) {
    console.error(err)
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}
const refreshData = async () => {
  setLoading(true)
  await fetchData(pagination.value)
}
const resetData = () => {
  setLoading(true)
  formValue.value = {}
  fetchData(pagination.value)
}
const editStartHandle = async (id: string) => {
  setLoading(true)
  try {
    const {code, data} = await infoApi(id)
    if (code !== 0) return
    editVisible.value = true;
    editItemKey.value = id;
    editFormValue.value = data;
  } finally {
    setLoading(false)
  }
}
const deleteHandle = async (id: string) => {
  setLoading(true)
  try {
    const {code} = await delApi(id)
    if (code !== 0) return
    await fetchData(pagination.value)
    Message.success({
      content: "删除成功",
      duration: 5000
    })
  } finally {
    setLoading(false)
  }
}
const deleteBatchHandle = async () => {
  console.log(selectedKeys.value)
  if (!selectedKeys.value.length) {
    Message.warning({
      content: "请选择要删除的数据",
      duration: 5000
    })
    return
  }
  setLoading(true)
  try {
    for (const id of selectedKeys.value) {
      const {code} = await delApi(id)
      if (code !== 0) return
    }
    await fetchData(pagination.value)
    Message.success({
      content: "删除成功",
      duration: 5000
    })
    selectedKeys.value = []
  } finally {
    setLoading(false)
  }
}
const editHandleCancel = () => {
  editVisible.value = false;
  editFormValue.value = {}
}
const editHandleBeforeOk = async () => {
  try {
    const {code, data} = await editApi(editItemKey.value, editFormValue.value)
    if (code === 3) {
      const fieldsValid: AnyObject = {}
      for (const key in data) {
        fieldsValid[key] = {
          status: 'error',
          message: data[key][0]
        }
      }
      editFormRef.setFields(fieldsValid)
    }
    if (code !== 0) return false
    await fetchData(pagination.value)
    editFormValue.value = {}
    Message.success({
      content: "修改成功",
      duration: 5000
    })
    return true;
  } catch (e) {
    return false;
  }
}
const editUpdateData = (newValue: Record<string, any>) => {
  editFormValue.value = newValue;
};
const addStartHandle = async () => {
  addVisible.value = true;
}
const addHandleCancel = () => {
  addVisible.value = false;
  addFormValue.value = {}
}
const addHandleBeforeOk = async () => {
  try {
    const {code, data} = await addApi(addFormValue.value)
    if (code === 3) {
      const fieldsValid: AnyObject = {}
      for (const key in data) {
        fieldsValid[key] = {
          status: 'error',
          message: data[key][0]
        }
      }
      addFormRef.setFields(fieldsValid)
    }
    if (code !== 0) return false
    await fetchData(pagination.value)
    addFormValue.value = {}
    Message.success({
      content: "添加成功",
      duration: 5000
    })
    return true;
  } catch (e) {
    return false;
  }
}
const addUpdateData = (newValue: Record<string, any>) => {
  addFormValue.value = newValue;
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

:deep(.arco-divider-horizontal) {
  margin-top: 0;
  margin-bottom: 16px;
}
</style>