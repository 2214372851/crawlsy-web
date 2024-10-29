<template>
  <a-card>
    <div class="action-btn">
      <a-space>
        <a-button type="primary" @click="openIde">
          <template #icon>
            <icon-code-square/>
          </template>
          打开于 WEB IDE
        </a-button>
        <a-button @click="rebuildTask" :loading="loading">
          <template #icon>
            <icon-sync/>
          </template>
          重构
        </a-button>
        <a-button @click="fetchData" :loading="loading">
          刷新
        </a-button>
        <a-button @click="closeTask" :loading="loading">
          终止
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
          <a-button type="primary" status="normal" @click="lookTask(record.id)">
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
import {Message, type TableColumnData, type TableRowSelection} from "@arco-design/web-vue";
import router from "@/router";
import {type SpiderTaskItem, spiderTaskListApi} from "@/api/modules/spider";
import useLoading from "@/hooks/loading";

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
    width: 160
  }
]
const renderData = ref<SpiderTaskItem>({
  createTime: "",
  founderUser: {uid: "", username: ""},
  id: 0,
  name: "",
  resources: "",
  spiderUid: "",
  status: "",
  taskmodel_set: [],
  updateTime: ""
});
const searchVal = ref('')
const openIde = () => {
  router.push({path: '/webIde', query: {id: resourceId}})
}
let cacheData = []
const searchTask = () => {
  renderData.value.taskmodel_set = !searchVal.value ? cacheData : cacheData.filter(item => item.name.includes(searchVal.value))
}
const fetchData = async () => {
  setLoading(true);
  searchVal.value = ''
  try {
    const {data} = await spiderTaskListApi(resourceId)
    if (!data) return
    renderData.value = data;
    cacheData = data.taskmodel_set
  } catch (err) {
    console.error(err)
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}
const rebuildTask = () => {
  Message.success(`任务已重构 ${JSON.stringify(selectedKeys.value)}`)
}
const closeTask = () => {
  Message.success(`任务已关闭 ${JSON.stringify(selectedKeys.value)}`)
}
const lookTask = (id: string) => {
  Message.success(`任务 ${id}`)
}
onMounted(async () => {
  await fetchData()
})
</script>

<style scoped lang="less">
.action-btn {
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
}
</style>