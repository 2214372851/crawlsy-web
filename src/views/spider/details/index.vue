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
        <a-descriptions-item label="创建用户">
          {{ renderData.founderUser.username }}
        </a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag :color="renderData.status ? 'green' : 'red'">
            {{ renderData.status ? '可用' : '不可用' }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="启动命令">
          <a-tag>
            {{ renderData.command ? renderData.command : '无' }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">
          <a-tag color="arcoblue">{{ renderData.createTime }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="更新时间">
          <a-tag color="arcoblue">{{ renderData.updateTime }}</a-tag>
        </a-descriptions-item>
      </a-descriptions>
    </a-skeleton>
    <div class="action-btn">
      <a-space>
        <a-button
            type="primary"
            @click="openIde"
            v-permission="[
              {
                permission: 'IdeManage',
                method: 'GET'
              }
            ]">
          <template #icon>
            <icon-code-square/>
          </template>
          打开于 WEB IDE
        </a-button>
        <a-button
            @click="fetchData"
            :loading="loading"
            v-permission="[
              {
                permission: 'spider-detail',
                method: 'GET'
              }
            ]">
          <template #icon>
            <icon-sync/>
          </template>
          刷新
        </a-button>
      </a-space>
      <a-input-search
          v-model="searchVal"
          @search="searchTask"
          :loading="loading"
          placeholder="请输入任务名称"
          style="width: 200px"/>
    </div>
    <a-table
        row-key="id"
        :columns="columns"
        :data="renderData.taskmodel_set"
        :loading="loading"
        :row-selection="rowSelection"
        :pagination="false"
        v-model:selectedKeys="selectedKeys">
      <template #isTiming="{ record }">
        <a-tag color="green" v-if="record.isTiming">是</a-tag>
        <a-tag color="red" v-else>否</a-tag>
      </template>
      <template #status="{ record }">
        <a-tag color="green" v-if="record.status">可用</a-tag>
        <a-tag color="red" v-else>不可用</a-tag>
      </template>
      <template #createTime="{ record }">
        <a-tag color="arcoblue">{{ record.createTime }}</a-tag>
      </template>
      <template #updateTime="{ record }">
        <a-tag color="arcoblue">{{ record.updateTime }}</a-tag>
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button
              type="primary"
              status="normal"
              @click="lookTask(record.id)"
              v-permission="[
                {
                  permission: 'task-detail',
                  method: 'GET'
                }
              ]">
            查看
          </a-button>
        </a-space>
      </template>
    </a-table>
  </a-card>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import {type TableColumnData, type TableRowSelection} from "@arco-design/web-vue";
import router from "@/router";
import {type SpiderTaskItem, spiderTaskListApi} from "@/api/modules/spider";
import useLoading from "@/hooks/loading";
import type {TaskRelated} from "@/api/modules/task";

const route = useRoute();
const {loading, setLoading} = useLoading();
const resourceId = route.query?.id as string
const selectedKeys = ref([]);
const rowSelection: TableRowSelection = {
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: true,
};

const columns: TableColumnData[] = [
  {
    title: '任务名称',
    dataIndex: 'name',
  },
  {
    title: '任务状态',
    slotName: 'status',
  },
  {
    title: '定时任务',
    slotName: 'isTiming',
  },
  {
    title: '运行时间',
    dataIndex: 'address',
  },
  {
    title: '创建用户',
    dataIndex: 'founderUser.username',
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
  }
]
const renderData = ref<SpiderTaskItem>({
  command: "",
  createTime: "",
  founderUser: {uid: "", username: ""},
  id: 0,
  name: "",
  spiderUid: "",
  status: "",
  updateTime: "",
  taskmodel_set: []
});
const searchVal = ref('')
const openIde = () => {
  router.push({path: '/webIde', query: {id: resourceId}})
}
let cacheData: TaskRelated[] = []
const searchTask = () => {
  renderData.value.taskmodel_set = !searchVal.value ? cacheData : cacheData.filter(item => item.name.includes(searchVal.value))
}
const fetchData = async () => {
  setLoading(true);
  searchVal.value = ''
  try {
    const {code, data} = await spiderTaskListApi(resourceId)
    if (code !== 0) return
    renderData.value = data as SpiderTaskItem;
    cacheData = (data as SpiderTaskItem).taskmodel_set
  } catch (err) {
    console.error(err)
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}
const lookTask = (id: string) => {
  router.push({path: '/task/details', query: {id}})
}
onMounted(async () => {
  await fetchData()
})
</script>

<style scoped lang="less">
.action-btn {
  margin: 16px 0;
  display: flex;
  justify-content: space-between;
}
</style>