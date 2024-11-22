<template>
  <SearchTable
      name="菜单"
      permission="menu"
      :search-options="searchOptions"
      :columns="columns"
      :data-api="menuListApi"
      :edit-api="menuUpdateApi"
      :info-api="menuInfoApi"
      :add-api="menuAddApi"
      :del-api="menuDelApi"
      :edit-form-ref="editFormRef"
      :add-form-ref="addFormRef">
    <template #edit-content="formValue">
      <a-form ref="editFormRef" :model="formValue">
        <a-form-item field="name" label="名称">
          <a-input
              v-model="formValue.data.name"
              placeholder="请输入名称..."/>
        </a-form-item>
        <a-form-item field="icon" label="图标">
          <a-input
              v-model="formValue.data.icon"
              placeholder="请输入图标..."/>
        </a-form-item>
        <a-form-item field="path" label="路径">
          <a-input
              v-model="formValue.data.path"
              placeholder="请输入菜单路径..."/>
        </a-form-item>
        <a-form-item field="parent" label="父级菜单">
          <a-select
              v-model="formValue.data.parent"
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
        <a-form-item field="icon" label="图标">
          <a-input
              v-model="formValue.data.icon"
              placeholder="请输入图标..."/>
        </a-form-item>
        <a-form-item field="path" label="路径">
          <a-input
              v-model="formValue.data.path"
              placeholder="请输入菜单路径..."/>
        </a-form-item>
        <a-form-item field="parent" label="父级菜单">
          <a-select
              v-model="formValue.data.parent"
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
import {menuListApi, menuAddApi, menuDelApi, menuInfoApi, menuUpdateApi, menuOptionApi} from "@/api/modules/menu"
import SearchTable from "@/components/search-table/index.vue";
import {onMounted, ref, type Ref, useTemplateRef} from "vue";
import type {menuOptionData, SearchOption} from "@/types/global";

const editFormRef = useTemplateRef('editFormRef')
const addFormRef = useTemplateRef('addFormRef')
const menuOptions = ref<menuOptionData[]>([])
const searchOptions: Ref<SearchOption[]> = ref([
  {
    label: '名称',
    type: 'input',
    field: 'name',
  },
])
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    minWidth: 90
  },
  {
    title: '图标',
    dataIndex: 'icon',
    minWidth: 90
  },
  {
    title: '菜单路径',
    dataIndex: 'path',
    minWidth: 90
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
const getMenuOption = async () => {
  const {data, code} = await menuOptionApi()
  if (code === 0) {
    menuOptions.value = data?.list as menuOptionData[]
  }
}
onMounted(async () => {
  await getMenuOption()
})
</script>

<style scoped lang="less">

</style>