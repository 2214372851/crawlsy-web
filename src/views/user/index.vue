<template>
  <SearchTable
      name="用户"
      row-key="uid"
      :search-options="searchOptions"
      :columns="columns"
      :addFormRef="addFormRef"
      :editFormRef="editFormRef"
      :info-api="userInfoApi"
      :add-api="userAddApi"
      :edit-api="userUpdateApi"
      :data-api="userListApi"
      :del-api="userDelApi">
    <template #edit-content="formValue">
      <a-form ref="editFormRef" :model="formValue">
        <a-form-item field="username" label="用户名">
          <a-input
              v-model="formValue.data.username"
              placeholder="请输入用户名..."/>
        </a-form-item>
        <a-form-item field="email" label="邮箱">
          <a-input
              v-model="formValue.data.email"
              placeholder="请输入邮箱..."/>
        </a-form-item>
        <a-form-item field="password" label="密码">
          <a-input-password
              v-model="formValue.data.password"
              placeholder="请输入密码..."/>
        </a-form-item>
        <a-form-item field="status" label="状态">
          <a-select
              v-model="formValue.data.status"
              :options="statusOptions"
              placeholder="请选择状态..."/>
        </a-form-item>
        <a-form-item field="role" label="角色">
          <a-select
              v-model="formValue.data.role"
              :options="options"
              :field-names="{label: 'name', value: 'id'}"
              value-key="name"
              multiple
              placeholder="请选择角色..."/>
        </a-form-item>
      </a-form>
    </template>
    <template #add-content="formValue">
      <a-form ref="addFormRef" :model="formValue">
        <a-form-item field="username" label="用户名">
          <a-input
              v-model="formValue.data.username"
              placeholder="请输入用户名..."/>
        </a-form-item>
        <a-form-item field="email" label="邮箱">
          <a-input
              v-model="formValue.data.email"
              placeholder="请输入邮箱..."/>
        </a-form-item>
        <a-form-item field="password" label="密码">
          <a-input-password
              v-model="formValue.data.password"
              placeholder="请输入密码..."/>
        </a-form-item>
        <a-form-item field="role" label="角色">
          <a-select
              v-model="formValue.data.role"
              :options="options"
              :field-names="{label: 'name', value: 'id'}"
              value-key="name"
              multiple
              placeholder="请选择角色..."/>
        </a-form-item>
      </a-form>
    </template>
  </SearchTable>
</template>

<script setup lang="ts">
import SearchTable from "@/components/search-table/index.vue";
import {userAddApi, userDelApi, userInfoApi, userListApi, userUpdateApi} from "@/api/modules/user";
import {ref, type Ref, type ShallowRef, useTemplateRef} from "vue";
import type {SearchOption} from "@/types/global";

const editFormRef: Readonly<ShallowRef<unknown | null>> = useTemplateRef('editFormRef')
const addFormRef = useTemplateRef('addFormRef')
// TODO 从数据库获取
const options = [
  {
    name: '管理员',
    id: 1
  },
  {
    name: '普通用户',
    id: 2
  }
]
const statusOptions = [
  {
    label: '正常',
    value: true
  },
  {
    label: '禁用',
    value: false
  }
]
const searchOptions: Ref<SearchOption[]> = ref([
  {
    label: '用户名',
    type: 'input',
    field: 'username',
  },
  {
    label: '邮箱',
    type: 'input',
    field: 'email',
  },
  {
    label: '状态',
    type: 'select',
    // multiple: true,
    field: 'status',
    options: statusOptions,
  },
])
const columns = [
  {
    title: '用户名',
    dataIndex: 'username',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
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
    width: 160
  }
]
</script>

<style scoped lang="less">

</style>