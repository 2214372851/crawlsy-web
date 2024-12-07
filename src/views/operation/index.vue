<template>
  <SearchTable
      name="操作"
      row-key="id"
      permission="operation"
      :search-options="searchOptions"
      :columns="columns"
      :data-api="operationListApi"
      :del-api="operationDelApi">
  </SearchTable>
</template>

<script setup lang="ts">
import SearchTable from "@/components/search-table/index.vue";
import {operationDelApi, operationListApi} from "@/api/modules/operation";
import {ref, type Ref} from "vue";
import type {SearchOption} from "@/types/global";
const searchOptions: Ref<SearchOption[]> = ref([
  {
    label: '用户名',
    type: 'input',
    field: 'username',
  },
  {
    label: '操作类型',
    type: 'input',
    field: 'operation_type',
  },
])
const columns = [
  {
    title: '用户名',
    dataIndex: 'user.username',
  },
  {
    title: '操作类型',
    dataIndex: 'operation_type',
  },
  {
    title: '详情',
    dataIndex: 'description',
  },
  {
    title: 'IP',
    slotName: 'ip_address',
  },
  {
    title: '操作时间',
    slotName: 'operation_time',
  },
  {
    title: '状态',
    slotName: 'status',
  },
  {
    title: '操作',
    slotName: 'optional',
    fixed: 'right',
    maxWidth: 160,
  }
]
</script>

<style scoped lang="less">

</style>