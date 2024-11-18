<template>
  <SearchTable
      name="任务"
      permission="task"
      :search-options="searchOptions"
      :columns="columns"
      :is-look="true"
      :look-handle="lookHandle"
      :data-api="taskListApi"
      :edit-api="taskUpdateApi"
      :info-api="taskInfoApi"
      :add-api="taskAddApi"
      :del-api="taskDelApi"
      :edit-form-ref="editFormRef"
      :add-form-ref="addFormRef">
    <template #edit-content="formValue">
      <a-form ref="editFormRef" :model="formValue">
        <a-form-item field="name" label="名称">
          <a-input
              v-model="formValue.data.name"
              placeholder="请输入名称..."/>
        </a-form-item>
        <a-form-item field="status" label="状态">
          <a-switch v-model="formValue.data.status" />
        </a-form-item>
        <a-form-item field="isTiming" label="定时">
          <a-select
              v-model="formValue.data.isTiming"
              :options="timingOptions"
              placeholder="请选择定时..."/>
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
              :field-names="{label: 'name', value: 'id'}"
              value-key="name"
              placeholder="请选择爬虫..."/>
        </a-form-item>
        <a-form-item field="taskNodes" label="任务节点">
          <multiple-select
              :options="nodeOptions"
              v-model="formValue as any"
          />
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
        <a-form-item field="status" label="状态">
          <a-switch v-model="formValue.data.status" />
        </a-form-item>
        <a-form-item field="isTiming" label="定时任务">
          <a-select
              v-model="formValue.data.isTiming"
              :options="timingOptions"
              placeholder="请选择是否定时..."/>
        </a-form-item>
        <a-form-item field="cronExpression" label="cron表达式">
          <a-input
              v-model="formValue.data.cronExpression"
              placeholder="请输入定时表达式..."/>
        </a-form-item>
        <a-form-item field="taskSpider" label="爬虫">
          <a-select
              v-model="formValue.data.taskSpider"
              :options="spiderOptions"
              :field-names="{label: 'name', value: 'id'}"
              value-key="name"
              placeholder="请选择爬虫..."/>
        </a-form-item>
        <a-form-item field="taskNodes" label="任务节点">
          <multiple-select
              :options="nodeOptions"
              v-model="formValue.data as any"
          />
        </a-form-item>

      </a-form>
    </template>
  </SearchTable>
</template>

<script setup lang="ts">
import {taskAddApi, taskDelApi, taskInfoApi, taskListApi, taskUpdateApi} from "@/api/modules/task";
import SearchTable from "@/components/search-table/index.vue";
import {onMounted, ref, type Ref, useTemplateRef} from "vue";
import type {menuOptionData, SearchOption} from "@/types/global";
import {spiderOptionApi} from "@/api/modules/spider";
import {nodeOptionApi} from "@/api/modules/node";
import {useRouter} from "vue-router";
import MultipleSelect from "@/views/task/components/multipleSelect.vue";


const router = useRouter()
const editFormRef = useTemplateRef('editFormRef')
const addFormRef = useTemplateRef('addFormRef')
const spiderOptions = ref<menuOptionData[]>([])
const nodeOptions = ref<menuOptionData[]>([])
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
    minWidth: 90
  },
  {
    title: '创建用户',
    slotName: 'user',
  },
  {
    title: '爬虫',
    dataIndex: 'spiderName',
    minWidth: 90
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
const getSpiderOption = async () => {
  const {data, code} = await spiderOptionApi()
  if (code === 0) {
    spiderOptions.value = data?.list as menuOptionData[]
  }
}
const getNodeOption = async () => {
  const {data, code} = await nodeOptionApi()
  if (code === 0) {
    nodeOptions.value = data?.list as menuOptionData[]
  }
}
const lookHandle = (id: string) => {
  router.push({path: '/task/details', query: {id: id}})
}
onMounted(async () => {
  await getSpiderOption()
  await getNodeOption()
})
</script>

<style scoped lang="less">

</style>