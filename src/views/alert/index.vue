<template>
  <SearchTable
      name="告警"
      row-key="id"
      permission="alert"
      :search-options="searchOptions"
      :columns="columns"
      :is-look="true"
      :look-handle="lookHandle"
      :addFormRef="addFormRef"
      :editFormRef="editFormRef"
      :info-api="alertInfoApi"
      :add-api="alertAddApi"
      :edit-api="alertUpdateApi"
      :data-api="alertListApi"
      :del-api="alertDelApi">
    <template #edit-content="formValue">
      <a-form ref="editFormRef" :model="formValue">
        <a-form-item field="name" label="名称">
          <a-input
              v-model="formValue.data.name"
              placeholder="请输入名称..."/>
        </a-form-item>

        <a-form-item field="description" label="描述">
          <a-input
              v-model="formValue.data.description"
              placeholder="请输入描述..."/>
        </a-form-item>
        <a-form-item field="mertric" label="指标">
          <a-input
              v-model="formValue.data.mertric"
              placeholder="请输入指标..."/>
        </a-form-item>
        <a-form-item field="condition" label="条件">
          <a-input
              v-model="formValue.data.condition"
              placeholder="请输入条件.."/>
        </a-form-item>
        <a-form-item field="threshold" label="阈值">
          <a-input-number
              v-model="formValue.data.threshold"
              placeholder="请输入阈值.."/>
        </a-form-item>
        <a-form-item field="severity" label="级别">
          <a-select
              v-model="formValue.data.severity"
              :options="severityOptions"
              placeholder="请选择级别..."/>
        </a-form-item>
        <a-form-item field="status" label="状态">
          <a-select
              v-model="formValue.data.status"
              :options="statusOptions"
              placeholder="请选择状态..."/>
        </a-form-item>
        <a-form-item field="interval" label="间隔">
          <a-input-number
              v-model="formValue.data.interval"
              placeholder="请输入级别..."/>
        </a-form-item>
        <a-form-item field="feishuWebhook" label="飞书 WebHook">
          <a-input
              v-model="formValue.data.feishuWebhook"
              placeholder="请输入URL..."/>
        </a-form-item>
        <a-form-item field="target" label="通知对象">
          <a-select :loading="loading" placeholder="请选择通知对象..." multiple
                    @search="handleSearch" :filter-option="false" v-model="formValue.data.target">
            <a-option v-for="item of userOptions" :value="item.id" :key="item.id">{{ item.username }}</a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </template>
    <template #add-content="formValue">
      <a-form ref="addFormRef" :model="formValue">
        <a-form-item field="name" label="名称" required>
          <a-input
              v-model="formValue.data.name"
              placeholder="请输入名称..."/>
        </a-form-item>

        <a-form-item field="description" label="描述" required>
          <a-input
              v-model="formValue.data.description"
              placeholder="请输入描述..."/>
        </a-form-item>
        <a-form-item field="mertric" label="指标" required>
          <a-input
              v-model="formValue.data.mertric"
              placeholder="请输入指标..."/>
        </a-form-item>
        <a-form-item field="condition" label="条件" required>
          <a-input
              v-model="formValue.data.condition"
              placeholder="请输入条件.."/>
        </a-form-item>
        <a-form-item field="threshold" label="阈值" required>
          <a-input-number
              v-model="formValue.data.threshold"
              placeholder="请输入阈值.."/>
        </a-form-item>
        <a-form-item field="severity" label="级别" required>
          <a-select
              v-model="formValue.data.severity"
              :options="severityOptions"
              placeholder="请选择级别..."/>
        </a-form-item>
        <a-form-item field="status" label="状态">
          <a-select
              v-model="formValue.data.status"
              :options="statusOptions"
              placeholder="请选择状态..."/>
        </a-form-item>
        <a-form-item field="interval" label="间隔" required>
          <a-input-number
              v-model="formValue.data.interval"
              placeholder="请输入级别..."/>
        </a-form-item>
        <a-form-item field="feishuWebhook" label="飞书 WebHook">
          <a-input
              v-model="formValue.data.feishuWebhook"
              placeholder="请输入URL..."/>
        </a-form-item>
        <a-form-item field="target" label="通知对象">
          <a-select :loading="loading" placeholder="请选择通知对象..." multiple
                    @search="handleSearch" :filter-option="false" v-model="formValue.data.target">
            <a-option v-for="item of userOptions" :value="item.id" :key="item.id">{{ item.username }}</a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </template>
  </SearchTable>
</template>

<script setup lang="ts">
import SearchTable from "@/components/search-table/index.vue";
import {onMounted, ref, type Ref, type ShallowRef, useTemplateRef} from "vue";
import type {SearchOption} from "@/types/global";
import {alertAddApi, alertDelApi, alertInfoApi, alertListApi, alertUpdateApi} from "@/api/modules/alert";
import useLoading from "@/hooks/loading";
import {userOptionApi, UserOptionData} from "@/api/modules/user";
import router from "@/router";

const userOptions = ref<UserOptionData[]>([])
const {loading, setLoading} = useLoading()
const editFormRef: Readonly<ShallowRef<unknown | null>> = useTemplateRef('editFormRef')
const addFormRef = useTemplateRef('addFormRef')
const severityOptions = [
  {
    label: '通知',
    value: 'info'
  },
  {
    label: '警告',
    value: 'warning'
  },
  {
    label: '严重',
    value: 'critical'
  }
]
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
    label: '级别',
    type: 'select',
    // multiple: true,
    field: 'severity',
    options: severityOptions,
  },
])
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    minWidth: 100
  },
  {
    title: '指标',
    dataIndex: 'mertric',
    minWidth: 100
  },
  {
    title: '条件',
    dataIndex: 'condition',
    minWidth: 60
  },
  {
    title: '间隔',
    dataIndex: 'interval',
    minWidth: 60
  },
  {
    title: '阈值',
    dataIndex: 'threshold',
    minWidth: 60
  },
  {
    title: '级别',
    slotName: 'severity',
  },
  {
    title: '状态',
    slotName: 'status',
  },
  {
    title: '最近触发',
    slotName: 'lastTriggerTime',
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
const handleSearch = async (value: string) => {
  setLoading(true)
  try {
    const {code, data} = await userOptionApi(value)
    if (code === 0) {
      userOptions.value = data?.list as UserOptionData[]
    }
  } catch (e) {
    console.error(e)
  } finally {
    setLoading(false)
  }
}
const lookHandle = (id: string) => {
  router.push({path: '/alert/details', query: {id: id}})
}
onMounted(async () => {
  await handleSearch('')
})
</script>

<style scoped lang="less">

</style>