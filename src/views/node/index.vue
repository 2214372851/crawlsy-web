<template>
  <a-card id="show" :bordered="true" :header-style="{borderBottom: 'none'}" title="节点管理">
    <Search :loading="loading" :collapsed="false" :search-options="searchOptions" v-model="formValue"
            @reset="refreshData" @submit="fetchData"/>
    <a-divider/>
    <a-space direction="vertical" size="medium" style="width: 100%">
      <a-grid :cols="{ xs: 1, sm: 4, md: 4, lg: 4, xl: 4, xxl: 4 }" :colGap="16" :rowGap="16" style="">
        <a-grid-item :span="2">
          <a-tabs type="rounded" @change="handleTabChange" v-model:active-key="tabKey" style="height: 32px;width: 100%">
            <a-tab-pane key="all" title="全部"/>
            <a-tab-pane key="run" title="运行中"/>
            <a-tab-pane key="stop" title="不可用"/>
          </a-tabs>
        </a-grid-item>
        <a-grid-item suffix>
          <div style="display:flex;justify-content: end;">
            <a-space>
              <a-button
                  type="primary"
                  @click="addStartHandle"
                  v-permission="[
                    {
                      permission: 'node-create',
                      method: 'POST'
                    }
                  ]">
                <template #icon>
                  <icon-plus/>
                </template>
                新建
              </a-button>
              <a-tooltip content="刷新">
                <a-button
                    @click="refreshData"
                    v-permission="[
                      {
                        permission: 'node-list',
                        method: 'GET'
                      }
                    ]">
                  <template #icon>
                    <icon-refresh/>
                  </template>
                </a-button>
              </a-tooltip>
              <a-tooltip content="切换布局">
                <a-button @click="isList = !isList">
                  <template #icon>
                    <icon-list v-if="isList"/>
                    <icon-apps v-else/>
                  </template>
                </a-button>
              </a-tooltip>
            </a-space>
          </div>
        </a-grid-item>
      </a-grid>
      <a-spin style="width: 100%" :loading="loading">
        <a-empty v-if="renderData.length == 0"/>
        <div v-else>
          <a-grid v-if="!isList" :cols="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 3 }" :colGap="16" :rowGap="16">
            <card-layout :render-data="renderData" @edit="editStartHandle" @look="lookHandle" @delete="deleteHandle"/>
          </a-grid>
          <a-list :loading="loading" v-else>
            <list-layout :render-data="renderData" @edit="editStartHandle" @look="lookHandle" @delete="deleteHandle"/>
          </a-list>
        </div>
      </a-spin>
      <div style="display:flex;justify-content: end;">
        <a-pagination
            size="mini"
            simple v-model:current="pagination.current"
            v-model:pageSize="pagination.pageSize"
            v-model:page-size-options="pagination.pageSizeOptions as number[]"
            v-model:total="pagination.total as number"
            @change="handleChangePage"
            @page-size-change="handleChangePageSize"
            show-page-size/>
      </div>
    </a-space>
    <a-modal
        title="节点新建"
        width="600px"
        v-model:visible="addNodeVisible"
        @cancel="addHandleCancel"
        :on-before-ok="addHandleBeforeOk" unmountOnClose>
      <a-form ref="addFormRef" :model="addFormValue">
        <a-form-item field="name" label="节点名称">
          <a-input-search
              v-model="addFormValue.name"
              placeholder="请输入节点名称..."
              button-text="填充"
              @search="fillNodeName"
              search-button/>
        </a-form-item>
        <a-form-item field="nodeUid" label="节点">
          <a-select
              v-model="addFormValue.nodeUid"
              :options="searchNodeOptions"
              :field-names="{label: 'node_name', value: 'node_uid'}"
              value-key="name"
              placeholder="请选择节点..."/>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
        title="节点修改"
        width="600px"
        v-model:visible="editNodeVisible"
        @cancel="editHandleCancel"
        :on-before-ok="editHandleBeforeOk" unmountOnClose>
      <a-form ref="editFormRef" :model="editFormValue">
        <a-form-item field="name" label="节点名称">
          <a-input
              v-model="editFormValue.name"
              placeholder="请输入节点名称..."/>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script setup lang="ts">

import {onMounted, type Ref, ref, useTemplateRef} from "vue";
import useLoading from "@/hooks/loading";
import {
  nodeAddApi,
  nodeDelApi, type NodeDetailData,
  nodeInfoApi,
  type NodeItem,
  nodeListApi,
  nodeUpdateApi,
  searchNodeApi,
  type searchNodeItem
} from "@/api/modules/node";
import {Message, type PaginationProps} from "@arco-design/web-vue";
import Search from "@/components/search/index.vue";
import type {AnyObject, SearchOption} from "@/types/global";
import CardLayout from "@/views/node/components/cardLayout.vue";
import ListLayout from "@/views/node/components/listLayout.vue";
import router from "@/router";

const addFormRef = useTemplateRef<any>('addFormRef')
const editFormRef = useTemplateRef<any>('editFormRef')
const {loading, setLoading} = useLoading();
const searchNodeOptions = ref<searchNodeItem[]>([])
const searchOptions = ref<SearchOption[]>([
  {
    label: '名称',
    type: 'input',
    field: 'name',
  },
  {
    label: '节点标识',
    type: 'input',
    field: 'nodeUid',
  }
])
const basePagination = {
  current: 1,
  pageSize: 5
}
const pagination: Ref<PaginationProps> = ref({
  showPageSize: true,
  pageSizeOptions: [5, 10, 15],
  size: 'mini',
  total: 0,
  ...basePagination
})
const formValue = ref<any>({})
const renderData = ref<NodeItem[]>([])
const isList = ref(true);
const editItemKey = ref<string>('');
const addNodeVisible = ref(false)
const editNodeVisible = ref(false)
const tabKey = ref('all')
const addFormValue = ref({
  name: '',
  nodeUid: ''
})
const editFormValue = ref({
  name: ''
})

const fillNodeName = () => {
  const item = searchNodeOptions.value.filter(item => item.node_uid == addFormValue.value.nodeUid)
  if (item.length > 0) {
    addFormValue.value.name = item[0].node_name
  } else {
    Message.info({
      content: '请先选择节点',
      duration: 5000
    })
  }
}
const getSearchNodeOption = async () => {
  const {data, code} = await searchNodeApi()
  if (code === 0) {
    searchNodeOptions.value = data?.list as searchNodeItem[]
  }
}
const addHandleCancel = () => {
  addNodeVisible.value = false
  addFormValue.value = {
    name: '',
    nodeUid: ''
  }
}
const addHandleBeforeOk = async () => {
  try {
    const {code, data} = await nodeAddApi(addFormValue.value)
    if (code === 3) {
      const fieldsValid: AnyObject = {}
      for (const key in data as any) {
        fieldsValid[key] = {
          status: 'error',
          message: (data as any)[key][0]
        }
      }
      addFormRef.value.setFields(fieldsValid)
    }
    if (code !== 0) return false
    addFormValue.value = {
      name: '',
      nodeUid: ''
    }
    await fetchData(pagination.value)
    Message.success({
      content: "添加成功",
      duration: 5000
    })
    return true;
  } catch (e) {
    return false;
  }
}
const editHandleBeforeOk = async () => {
  try {
    const {code, data} = await nodeUpdateApi(editItemKey.value, editFormValue.value)
    if (code === 3) {
      const fieldsValid: AnyObject = {}
      for (const key in data) {
        fieldsValid[key] = {
          status: 'error',
          message: (data as any)[key][0]
        }
      }
      editFormRef.value.setFields(fieldsValid)
    }
    if (code !== 0) return false
    await fetchData(pagination.value)
    editFormValue.value = {name: ''}
    Message.success({
      content: "修改成功",
      duration: 5000
    })
    return true;
  } catch (e) {
    return false;
  }
}
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
const addStartHandle = async () => {
  await getSearchNodeOption()
  addNodeVisible.value = true
}
const editStartHandle = async (id: string) => {
  const {code, data} = await nodeInfoApi(id)
  if (code !== 0) return
  editFormValue.value.name = (data as NodeDetailData).name
  editItemKey.value = id
  editNodeVisible.value = true

}
const editHandleCancel = () => {
  editNodeVisible.value = false
  editFormValue.value = {
    name: ''
  }
}
const handleTabChange = async (key: string | number) => {
  switch (key) {
    case 'all':
      delete formValue.value.status
      break
    case 'run':
      formValue.value.status = true
      break
    case 'stop':
      formValue.value.status = false
      break
  }
  await fetchData(pagination.value)
};
const refreshData = async () => {
  setLoading(true)
  formValue.value = {}
  tabKey.value = 'all'
  await fetchData(pagination.value)
}
const fetchData = async (params: any = basePagination) => {
  setLoading(true);
  try {
    const {current, pageSize} = params
    const {code, data} = await nodeListApi({...formValue.value, page: current, pageSize})
    if (code !== 0) return
    renderData.value = data?.list as NodeItem[];
    pagination.value.current = params.current;
    pagination.value.total = data?.total;
  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false)
  }
}
const lookHandle = (id: string) => {
  router.push({path: '/node/details', query: {id: id}})
}
const deleteHandle = async (id: string) => {
  setLoading(true)
  try {
    const {code} = await nodeDelApi(id)
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
onMounted(async () => await fetchData(pagination.value))
</script>

<style scoped lang="less">
.wrapper {
  position: relative;
  width: 100%;
  height: 100%;

  #show {
    overflow-y: auto;
  }
}
</style>