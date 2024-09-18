<template>
  <SearchTable
      name="用户"
      :search-options="searchOptions"
      :columns="columns"
      :info-api="userInfoApi"
      :edit-api="userUpdateApi"
      :data-api="userListApi">
    <template #edit-content="formValue">
      <a-form :model="formValue">
            <a-form-item field="username" label="用户名">
              <a-input v-model="formValue.data.username" placeholder="please enter..." />
            </a-form-item>
            <a-form-item field="email" label="邮箱">
              <a-input v-model="formValue.data.email" placeholder="please enter..." />
            </a-form-item>
            <a-form-item field="password" label="密码">
              <a-input v-model="formValue.data.password" placeholder="please enter..." />
            </a-form-item>
            <a-form-item field="status" label="状态">
              <a-select v-model="formValue.data.status" :options="statusOptions" placeholder="please enter..." />
            </a-form-item>
            <a-form-item field="role" label="角色">
              <a-select
                  v-model="formValue.data.role"
                  :options="options"
                  :field-names="{label: 'name', value: 'id'}"
                  value-key="name"
                  multiple
                  placeholder="please enter..." />
            </a-form-item>
      </a-form>
      {{formValue.data}}
    </template>
  </SearchTable>
</template>

<script setup lang="ts">
import SearchTable from "@/components/search-table/index.vue";
import {userListApi, userUpdateApi, userInfoApi} from "@/api/modules/user";
import {ref, type Ref} from "vue";
import type {SearchOption} from "@/types/global";
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
    slotName: 'optional'
  }
]
</script>

<style scoped lang="less">

</style>