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
        <a-descriptions-item label="创建时间">
          <a-tag color="arcoblue">{{ renderData.createTime }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="更新时间">
          <a-tag color="arcoblue">{{ renderData.updateTime }}</a-tag>
        </a-descriptions-item>
      </a-descriptions>
    </a-skeleton>

    <a-divider/>

    <div class="action-btn">
      <a-space>
        <a-button :loading="loading" @click="openSpiderDetail" type="primary">
          <template #icon>
            <icon-play-arrow/>
          </template>
          部署
        </a-button>
        <a-button :loading="loading" @click="reconstitutionHandle" type="primary">
          <template #icon>
            <icon-sync/>
          </template>
          重构
        </a-button>
        <a-button :loading="loading" @click="fetchData">
          刷新
        </a-button>
        <a-button :loading="loading" @click="stopHandle" status="danger">
          终止
        </a-button>
      </a-space>
    </div>
    <a-skeleton animation v-if="!renderData.status">
      <a-skeleton-line :rows="3" v-if="loading"/>
      <a-grid v-else :cols="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 4, xxl: 4 }" :colGap="16" :rowGap="16">
        <a-grid-item v-for="item in renderData.taskNodes" :key="item.id">
          <a-card>
            <a-space direction="vertical" fill>
              <a-card-meta>
                <template #title>
                  <div style="display: flex;justify-content: space-between">
                    <span>Node: {{ item.name }}</span>
                    <a-tag :color="Status[item.status].color">
                      {{ Status[item.status].msg }}
                    </a-tag>
                  </div>
                </template>
                <template #description>
                  <a-space direction="vertical">
                    <div style="cursor: pointer">
                      <a-tag color="blue" @click="lookNode(item.id)">{{ item.nodeUid }}</a-tag>
                    </div>
                  </a-space>
                </template>
              </a-card-meta>

              <div style="width: 100%; display: flex;justify-content: end;">
                <a-progress size="large" :percent="0.4" show-text/>
              </div>
            </a-space>

          </a-card>
        </a-grid-item>
      </a-grid>
    </a-skeleton>
  </a-card>
</template>

<script setup lang="ts">

import useLoading from "@/hooks/loading";
import {type TaskDetailItem, taskInfoApi} from "@/api/modules/task";
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {Status} from "@/utils/enum";

const router = useRouter()
const route = useRoute();
const {loading, setLoading} = useLoading()
const resourceId = route.query?.id as string
const renderData = ref<TaskDetailItem>({
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
const lookNode = (id: string) => {
  router.push({path: '/node/details', query: {id: id}})
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
const deploymentHandle = () => {
  // TODO: 调度器部署任务
}
const reconstitutionHandle = () => {
  // TODO: 调度器重构任务
}
const stopHandle = () => {
  // TODO: 调度器终止任务
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