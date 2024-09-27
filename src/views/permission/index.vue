<template>
  <SearchTable
      name="权限"
      :search-options="searchOptions"
      :columns="columns"
      :addFormRef="addFormRef"
      :editFormRef="editFormRef"
      :info-api="permissionInfoApi"
      :add-api="permissionAddApi"
      :edit-api="permissionUpdateApi"
      :data-api="permissionListApi"
      :del-api="permissionDelApi">
    <template #edit-content="formValue">
      <a-form ref="editFormRef" :model="formValue">
        <a-form-item field="name" label="名称">
          <a-input
              v-model="formValue.data.name"
              placeholder="请输入名称..."/>
        </a-form-item>
        <a-form-item field="path" label="路径">
          <a-input
              v-model="formValue.data.path"
              placeholder="请选择路径..."/>
        </a-form-item>
        <a-form-item field="method" label="方法">
          <a-select
              v-model="formValue.data.method"
              :options="options"
              :field-names="{label: 'name', value: 'name'}"
              value-key="name"
              placeholder="请选择方法..."/>
        </a-form-item>
        <a-form-item field="menu" label="菜单">
          <a-select
              v-model="formValue.data.menu"
              :options="menuOptions"
              :field-names="{label: 'name', value: 'id'}"
              value-key="name"
              placeholder="请选择菜单..."/>
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
        <a-form-item field="path" label="路径">
          <a-input
              v-model="formValue.data.path"
              placeholder="请选择路径..."/>
        </a-form-item>
        <a-form-item field="method" label="方法">
          <a-select
              v-model="formValue.data.method"
              :options="options"
              :field-names="{label: 'name', value: 'name'}"
              value-key="name"
              placeholder="请选择方法..."/>
        </a-form-item>
        <a-form-item field="menu" label="菜单">
          <a-select
              v-model="formValue.data.menu"
              :options="menuOptions"
              :field-names="{label: 'name', value: 'id'}"
              value-key="name"
              placeholder="请选择菜单..."/>
        </a-form-item>
      </a-form>
    </template>
  </SearchTable>
</template>

<script setup lang="ts">
import SearchTable from "@/components/search-table/index.vue";
import {
  permissionAddApi,
  permissionDelApi,
  permissionInfoApi,
  permissionListApi,
  permissionUpdateApi
} from "@/api/modules/permission";
import {onMounted, ref, type Ref, useTemplateRef} from "vue";
import type {SearchOption} from "@/types/global";
import {menuOptionApi} from "@/api/modules/menu";

const editFormRef = useTemplateRef('editFormRef')
const addFormRef = useTemplateRef('addFormRef')
const options = [
  {
    name: 'GET'
  },
  {
    name: 'POST'
  },
  {
    name: 'PUT'
  },
  {
    name: 'DELETE'
  }
]
const menuOptions = ref([])
const statusOptions = [
  {
    label: 'GET',
    value: 'GET'
  },
  {
    label: 'POST',
    value: 'POST'
  },
  {
    label: 'PUT',
    value: 'PUT'
  },
  {
    label: 'DELETE',
    value: 'DELETE'
  }
]
const searchOptions: Ref<SearchOption[]> = ref([
  {
    label: '名称',
    type: 'input',
    field: 'name',
  },
  {
    label: '方法',
    type: 'select',
    // multiple: true,
    field: 'method',
    options: statusOptions,
  }
])
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '方法',
    dataIndex: 'method',
  },
  {
    title: '路径',
    dataIndex: 'path',
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
const getMenuOption = async () => {
  const {data, code} = await menuOptionApi()
  if (code === 0) {
    menuOptions.value = data.list
  }
}
onMounted(async () => {
  await getMenuOption()
})
</script>

<style scoped lang="less">

</style>