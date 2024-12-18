<template>
  <SearchTable
      name="爬虫"
      permission="spider"
      :search-options="searchOptions"
      :columns="columns"
      :data-api="spiderListApi"
      :edit-api="spiderUpdateApi"
      :info-api="spiderInfoApi"
      :add-api="spiderAddApi"
      :del-api="spiderDelApi"
      :is-look="true"
      :look-handle="lookHandle"
      :edit-form-ref="editFormRef"
      :add-form-ref="addFormRef">
    <template #edit-content="formValue">
      <a-form ref="addFormRef" :model="formValue">
        <a-form-item field="name" label="名称">
          <a-input
              v-model="formValue.data.name"
              placeholder="请输入名称..."/>
        </a-form-item>
        <a-form-item field="status" label="状态">
          <a-select
              v-model="formValue.data.status"
              :options="statusOptions"
              placeholder="请选择状态..."/>
        </a-form-item>
        <a-form-item field="command" label="状态">
          <a-input
              v-model="formValue.data.command"
              placeholder="请输入启动命令..."/>
        </a-form-item>
      </a-form>
    </template>
    <template #add-content="formValue">
      <a-form ref="addFormRef" :model="formValue">
        <a-form-item field="name" label="名称">
          <a-input
              v-model="formValue.data.name"
              placeholder="请输入名称..."/>
        </a-form-item>
      </a-form>
    </template>
  </SearchTable>

</template>

<script setup lang="ts">
import SearchTable from "@/components/search-table/index.vue";
import {spiderAddApi, spiderDelApi, spiderInfoApi, spiderUpdateApi, spiderListApi} from "@/api/modules/spider";
import {ref, type Ref, useTemplateRef} from "vue";
import type {SearchOption} from "@/types/global";
import {useRouter} from "vue-router";

const router = useRouter()
const editFormRef = useTemplateRef('editFormRef')
const addFormRef = useTemplateRef('addFormRef')
const statusOptions = [
  {
    label: "可用",
    value: true
  },
  {
    label: "不可用",
    value: false
  }
]
const searchOptions: Ref<SearchOption[]> = ref([
  {
    label: '名称',
    type: 'input',
    field: 'name',
  },
  {
    label: '创建人',
    type: 'input',
    field: 'founder',
  },
  {
    label: '状态',
    type: 'select',
    field: 'status',
    options: statusOptions
  },
  {
    label: '爬虫任务ID',
    type: 'input',
    field: 'spiderUid',
  },
])
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    minWidth: 90
  },
  {
    title: '爬虫标识',
    slotName: 'spiderUid'
  },
  {
    title: '创建用户',
    slotName: 'user',
  },
  {
    title: '状态',
    slotName: 'status',
  },
  {
    title: '创建时间',
    slotName: 'createTime',
  },
  {
    title: '修改时间',
    slotName: 'updateTime',
  },
  {
    title: '操作',
    slotName: 'optional',
    fixed: 'right',
    maxWidth: 160,
  }
]
const lookHandle = (id: string) => {
  router.push({path: '/spider/details', query: {id: id}})
}
</script>

<style scoped lang="less">

</style>