<template>
  <a-card>
    <a-skeleton animation>
      <a-skeleton-line :rows="5" v-if="loading"/>
      <a-descriptions
          v-else
          :column="3"
          :title="renderData.name"
          layout="inline-vertical"
          :label-style="{
            'margin-top': '16px'
          }">
        <a-descriptions-item label="名称">
          {{ renderData.name }}
        </a-descriptions-item>
        <a-descriptions-item label="描述">
          {{ renderData.description }}
        </a-descriptions-item>
        <a-descriptions-item label="监控指标">
          <a-tag>
            {{ renderData.mertric }} {{ renderData.condition }} {{ renderData.threshold }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="间隔">
          <a-tag>
            {{ renderData.interval }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag :color="renderData.status ? 'green' : 'red'">
            {{ renderData.status ? '可用' : '不可用' }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="级别">
          <a-tag color="arcoblue" v-if="renderData.severity == 'info'">通知</a-tag>
          <a-tag color="orange" v-else-if="renderData.severity == 'warning'">警告</a-tag>
          <a-tag color="red" v-else>严重</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="上次触发时间" v-if="renderData.lastTriggerTime">
          <a-tag color="arcoblue">{{ renderData.lastTriggerTime }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">
          <a-tag color="arcoblue">{{ renderData.createTime }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="更新时间">
          <a-tag color="arcoblue">{{ renderData.updateTime }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="飞书 WebHook" v-if="renderData.feishuWebhook">
          <a-tag color="arcoblue">{{ renderData.feishuWebhook }}</a-tag>
        </a-descriptions-item>
      </a-descriptions>
    </a-skeleton>
    <div class="action-btn">
      <a-button :loading="loading" @click="handleAlertTest">
        <template #icon>
          <icon-lark-color/>
        </template>
        测试通知
      </a-button>
    </div>
    <a-table
        row-key="id"
        :columns="columns"
        :loading="loading"
        :data="renderRecordData"
        :pagination="false"
        v-permission="[
              {
                permission: 'alertRecord-list',
                method: 'GET'
              }
            ]">
      <template #metric="{ record }">
        <a-tag>{{ record.metric }}</a-tag>
      </template>
      <template #value="{ record }">
        <a-tag color="arcoblue">{{ record.value }}</a-tag>
      </template>
      <template #triggerTime="{ record }">
        <a-tag color="arcoblue">{{ record.triggerTime }}</a-tag>
      </template>
    </a-table>
    <div style="display:flex;justify-content: end;">
      <a-pagination
          size="mini"
          simple v-model:current="pagination.current"
          v-model:pageSize="pagination.pageSize"
          v-model:page-size-options="pagination.pageSizeOptions as number[]"
          v-model:total="pagination.total as number"
          @change="handleChangePage"
          @page-size-change="handleChangePageSize"
          show-page-size/>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import {onMounted, Ref, ref} from "vue";
import {Message, PaginationProps, type TableColumnData} from "@arco-design/web-vue";
import useLoading from "@/hooks/loading";
import {alertInfoApi, AlertItem, AlertRecordItem, alertRecordListApi, alertTestApi} from "@/api/modules/alert";

const route = useRoute();
const {loading, setLoading} = useLoading();
const resourceId = route.query?.id as string

const columns: TableColumnData[] = [
  {
    title: '监控指标',
    dataIndex: 'metric',
  },
  {
    title: '监控值',
    slotName: 'value',
  },
  {
    title: '触发时间',
    slotName: 'triggerTime',
  }
]
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

const renderData = ref<AlertItem>({
  condition: "",
  createTime: "",
  description: "",
  feishuWebhook: "",
  id: 0,
  interval: 0,
  lastTriggerTime: '',
  mertric: "",
  name: "",
  severity: "",
  status: false,
  target: "",
  threshold: 0,
  updateTime: ""
});
const renderRecordData = ref<AlertRecordItem[]>([]);

const fetchData = async () => {
  setLoading(true);
  try {
    const {code, data} = await alertInfoApi(resourceId)
    if (code !== 0) return
    renderData.value = data as AlertItem;
  } catch (err) {
    console.error(err)
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}
const fetchRecordData = async (params: any = basePagination) => {
  setLoading(true);
  try {
    const {current, pageSize} = params
    const {code, data} = await alertRecordListApi({id: resourceId, page: current, pageSize})
    if (code !== 0) return
    renderRecordData.value = data?.list as AlertRecordItem[];
  } catch (err) {
    console.error(err)
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}
const handleChangePage = (current: number) => {
  pagination.value.current = current
  fetchRecordData({...pagination.value, current})
}
const handleChangePageSize = (pageSize: number) => {
  const lastSize = pagination.value.pageSize as number
  pagination.value.pageSize = pageSize
  if (pagination.value.current === 1 && lastSize < pageSize) {
    fetchRecordData(pagination.value)
  }
}
const handleAlertTest = async () => {
  setLoading(true);
  try {
    const {code} = await alertTestApi(resourceId)
    if (code !== 0) return
    Message.success({
      content: '发送成功',
      duration: 5000
    })
    await fetchRecordData()
  } catch (err) {
    console.error(err)
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}
onMounted(async () => {
  await fetchData()
  await fetchRecordData()
})
</script>

<style scoped lang="less">
.action-btn {
  margin: 16px 0;
  display: flex;
  justify-content: flex-end;
}
</style>