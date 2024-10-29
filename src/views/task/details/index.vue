<template>
  <a-card>
    <a-skeleton animation>
      <a-skeleton-line :rows="5" v-if="loading" />
      <a-descriptions v-else :column="4" :title="renderData.name" layout="inline-vertical" bordered>
        <a-descriptions-item label="任务 UID">
          <a-button @click="openSpiderDetail">
            {{ renderData.taskUid }}
          </a-button>
        </a-descriptions-item>
        <a-descriptions-item label="创建用户">
          {{ renderData.founderUser.username }}
        </a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag :color="renderData.status ? 'green' : 'red'">
            {{ renderData.status ? '可用' : '不可用' }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="定时任务">
          <a-tag :color="renderData.isTiming ? 'green' : 'red'">
            {{ renderData.isTiming ? '是' : '否' }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="爬虫">
          <a-button @click="openSpiderDetail">
            {{ renderData.spiderName }}
          </a-button>
        </a-descriptions-item>
        <a-descriptions-item label="定时时间" v-if="renderData.isTiming">
          {{ renderData.cronExpression }}
        </a-descriptions-item>
        <a-descriptions-item label="节点">
          <a-space>
            <a-tag v-for="node in renderData.taskNodes" :key="node">{{ node }}</a-tag>
          </a-space>
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
        <a-button :loading="loading" type="primary">
          <template #icon>
            <icon-sync/>
          </template>
          重构
        </a-button>
        <a-button :loading="loading">
          刷新
        </a-button>
        <a-button :loading="loading">
          终止
        </a-button>
      </a-space>
    </div>
  </a-card>
</template>

<script setup lang="ts">

import useLoading from "@/hooks/loading";
import {taskInfoApi, type TaskItem} from "@/api/modules/task";
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

const router = useRouter()
const route = useRoute();
const {loading, setLoading} = useLoading()
const resourceId = route.query?.id as string
const renderData = ref<TaskItem>({
  spiderName: "",
  createTime: "",
  cronExpression: "",
  founderUser: {uid: "", username: ""},
  id: 0,
  isTiming: false,
  name: "",
  status: false,
  taskNodes: [],
  taskSpider: 0,
  taskUid: "",
  updateTime: ""
})
const openSpiderDetail = () => {
  router.push({path: '/spider/details', query: {id: renderData.value.taskSpider}})
}
const fetchData = async () => {
  setLoading(true);
  try {
    const {data} = await taskInfoApi(resourceId)
    if (!data) return
    renderData.value = data;
  } catch (err) {
    console.error(err)
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}
onMounted(async () => {
  await fetchData()
})

</script>

<style scoped lang="less">
.action-btn {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
}
</style>