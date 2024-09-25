<template>
  <SearchTable
      name="任务"
      :search-options="searchOptions"
      :columns="columns"
      :data-api="taskListApi"
      :edit-api="taskUpdateApi"
      :info-api="taskInfoApi"
      :add-api="taskAddApi"
      :del-api="taskDelApi"
      :edit-form-ref="editFormRef"
      :add-form-ref="addFormRef">
    <template #edit-content="formValue">
      <a-form ref="addFormRef" :model="formValue">
        <a-form-item field="name" label="名称">
          <a-input
              v-model="formValue.data.name"
              placeholder="请输入名称..."/>
        </a-form-item>
        <a-form-item field="cronExpression" label="cron表达式">
          <a-input
              v-model="formValue.data.cronExpression"
              placeholder="请输入表达式..."/>
        </a-form-item>
        <a-form-item field="taskSpider" label="爬虫">
          <a-select
              v-model="formValue.data.taskSpider"
              :options="spiderOptions"
              placeholder="请选择爬虫..."/>
        </a-form-item>
        <a-form-item field="isTiming" label="定时">
          <a-select
              v-model="formValue.data.isTiming"
              :options="timingOptions"
              placeholder="请选择定时..."/>
        </a-form-item>
        <a-form-item field="status" label="状态">
          <a-select
              v-model="formValue.data.status"
              :options="statusOptions"
              placeholder="请选择状态..."/>
        </a-form-item>
        <a-form-item field="taskNodes" label="任务节点">
          <a-select
              v-model="formValue.data.taskNodes"
              :options="nodeOptions"
              placeholder="请选择节点..."/>
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
import {taskListApi, taskAddApi, taskDelApi, taskInfoApi, taskUpdateApi} from "@/api/modules/task";
import SearchTable from "@/components/search-table/index.vue";
import {ref, type Ref, useTemplateRef} from "vue";
import type {SearchOption} from "@/types/global";

const editFormRef = useTemplateRef('editFormRef')
const addFormRef = useTemplateRef('addFormRef')
// TODO: 获取爬虫列表
const spiderOptions: { label: string, value: string}[] = []
// TODO: 获取节点列表
const nodeOptions: { label: string, value: string}[] = []
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
const timingOptions = [
  {
    label: "是",
    value: true
  },
  {
    label: "否",
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
    label: '定时',
    type: 'select',
    field: 'isTiming',
    options: timingOptions
  },
])

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '创建用户',
    slotName: 'user',
  },
  {
    title: '爬虫',
    dataIndex: 'spider.name',
  },
  {
    title: '定时任务',
    slotName: 'isTiming',
  },
  {
    title: '状态',
    slotName: 'status',
  },
  {
    title: 'cron 表达式',
    dataIndex: 'cronExpression',
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
    width: 160
  }
]
</script>

<style scoped lang="less">

</style>