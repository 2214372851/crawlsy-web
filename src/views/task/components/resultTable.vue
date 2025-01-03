<template>
  <div style="margin-top: 20px">
    <a-divider :margin="40" orientation="left">任务结果</a-divider>
    <div style="display: flex; justify-content: flex-end;margin-bottom: 10px">
      <a-button
          @click="fetchData"
          :loading="loading"
          v-permission="[
                {
                  permission: 'result',
                  method: 'GET'
                }
              ]">
        <template #icon>
          <icon-refresh size="18"/>
        </template>
      </a-button>
    </div>
    <a-table
        :columns="columns"
        :data="renderData"
        :pagination="pagination"
        :bordered="{cell:true}"
        @page-change="handleChangePage"
        @page-size-change="handleChangePageSize"
        stripe
        column-resizable
        :loading="loading"/>
  </div>
</template>

<script setup lang="ts">
import {onMounted, type Ref, ref} from 'vue'
import {taskResultListApi} from "@/api/modules/result";
import useLoading from "@/hooks/loading";
import type {PaginationProps, TableColumnData} from "@arco-design/web-vue";

const {loading, setLoading} = useLoading()
const {id} = defineProps<{ id: string }>()
const columns = ref<TableColumnData[]>([])
const renderData = ref<Record<string, string>[]>([])
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

const fetchData = async (params: any = basePagination) => {
  setLoading(true)
  try {
    const {data, code} = await taskResultListApi(id, params.current, params.pageSize)
    if (code !== 0) return
    if (!data?.list?.length) return
    const allKeys = new Set();
    data.list.forEach(doc => {
      Object.keys(doc).forEach(key => key === '_id' ? null : allKeys.add(key));
    });
    columns.value = (Array.from(allKeys) as string[]).map(key => ({'title': key, 'dataIndex': key, 'minWidth': 100}))
    renderData.value = data.list as Record<string, string>[]
    pagination.value.total = data.total
  } catch (e) {
    console.log(e)
  } finally {
    setLoading(false)
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
onMounted(async () => {
  await fetchData()
})
</script>

<style scoped lang="less">

</style>