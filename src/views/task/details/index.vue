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

    <div v-if="taskCount.done+taskCount.running+taskCount.failed > 0">
      <a-divider :margin="40" orientation="left">任务状态</a-divider>
      <div class="status-number-container">
        <div class="done-number status-number">
          <a-statistic title="Done" :value="taskCount.done" show-group-separator/>
        </div>
        <div class="running-number status-number">
          <a-statistic title="Running" :value="taskCount.running" show-group-separator/>
        </div>
        <div class="failed-number status-number">
          <a-statistic title="Failed" :value="taskCount.failed" show-group-separator/>
        </div>
      </div>
    </div>
    <a-divider/>
    <div class="action-btn">
      <a-space>
        <a-button :loading="loading" @click="deploymentHandle" type="primary">
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
        <a-button :loading="loading" @click="stopHandle" status="danger">
          <template #icon>
            <icon-record-stop/>
          </template>
          终止
        </a-button>
        <a-tooltip content="刷新">
          <a-button @click="fetchData" :loading="loading">
            <template #icon>
              <icon-refresh size="18"/>
            </template>
          </a-button>
        </a-tooltip>
      </a-space>
    </div>
    <a-skeleton animation v-if="!renderData.status">
      <a-skeleton-line :rows="3" v-if="loading"/>
      <a-grid v-else :cols="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }" :colGap="16" :rowGap="16">
        <a-grid-item v-for="item in renderData.taskNodes" :key="item.id">
          <a-card>
            <a-space direction="vertical" fill>
              <a-card-meta>
                <template #title>
                  <div style="display: flex;justify-content: space-between">
                    <span>Node: {{ item.name }}</span>
                    <a-tag :color="Status[(item.status as StatusType)].color">
                      {{ Status[(item.status as StatusType)].msg }}
                    </a-tag>
                  </div>
                </template>
                <template #description>
                  <a-space direction="vertical">
                    <div style="cursor: pointer">
                      <a-tag color="blue" @click="lookNode(String(item.id))">{{ item.nodeUid }}</a-tag>
                    </div>
                  </a-space>
                </template>
              </a-card-meta>
              <a-button type="primary" @click="openLogDrawer" v-show="item.status === 1">查看日志</a-button>
            </a-space>

          </a-card>
        </a-grid-item>
      </a-grid>
    </a-skeleton>
    <a-drawer
        width="70%"
        :visible="logVisible"
        @ok="logHandleOk"
        @cancel="logHandleCancel"
        ok-text="连接"
        cancel-text="关闭"
        :cancel-button-props="{
          status: 'danger'
        }"
        unmountOnClose>
      <Logger v-model="logsValue" @close="wsClose"/>
    </a-drawer>
  </a-card>
</template>

<script setup lang="ts">

import WebSocketService from '@/utils/socket';
import useLoading from "@/hooks/loading";
import {type TaskDetailItem, taskInfoApi} from "@/api/modules/task";
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {Status, type StatusType} from "@/utils/enum";
import {schedulerDeployApi, schedulerReloadApi, schedulerStopApi} from "@/api/modules/scheduler";
import {Message} from "@arco-design/web-vue";
import Logger from "@/components/logger/index.vue";

const router = useRouter()
const logsValue = ref<string>('')
const route = useRoute();
const {loading, setLoading} = useLoading()
const logVisible = ref(false)
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
const taskCount = ref({
  done: 0,
  running: 0,
  failed: 0
})
let socket: WebSocketService | null = null

const openSpiderDetail = () => {
  router.push({path: '/spider/details', query: {id: renderData.value.taskSpider}})
}
const lookNode = (id: string) => {
  router.push({path: '/node/details', query: {id: id}})
}
const fetchData = async () => {
  setLoading(true);
  try {
    const {code, data} = await taskInfoApi(resourceId)
    if (code !== 0) return
    renderData.value = data;
    taskCount.value = {done: 0, running: 0, failed: 0}
    for (let i = 0; i < data.taskNodes.length; i++) {
      const status = data.taskNodes[i].status
      if (status === 2) {
        taskCount.value.done++
      } else if (status === 1) {
        taskCount.value.running++
      } else if (status & (4 | 16)) {
        taskCount.value.failed++
      }
    }

  } catch (err) {
    console.error(err)
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}
const deploymentHandle = async () => {
  setLoading(true);
  try {
    const {code} = await schedulerDeployApi(renderData.value.taskUid)
    if (code !== 0) return
    Message.success({
      content: "部署成功",
      duration: 5000
    })
    await fetchData()
  } catch (e) {
    console.log(e)
  } finally {
    setLoading(false)
  }
}
const reconstitutionHandle = async () => {
  setLoading(true);
  try {
    const {code} = await schedulerReloadApi(renderData.value.taskUid)
    if (code !== 0) return
    Message.success({
      content: "重构成功",
      duration: 5000
    })
    await fetchData()
  } catch (e) {
    console.log(e)
  } finally {
    setLoading(false)
  }
}
const stopHandle = async () => {
  setLoading(true);
  try {
    const {code} = await schedulerStopApi(renderData.value.taskUid)
    if (code !== 0) return
    Message.success({
      content: "停止成功",
      duration: 5000
    })
    await fetchData()
  } catch (e) {
    console.log(e)
  } finally {
    setLoading(false)
  }
}
const openLogDrawer = async () => {
  logsValue.value = ''
  logVisible.value = true

}
const logHandleOk = async () => {
  logsValue.value = '[等待连接中...]'
  // socket = new WebSocketService(`ws://${window.location.host}/logs/990a64ec-36f4-4efc-b744-8e08ee51513f/990a64ec-36f4-4efc-b744-8e08ee51513f/?ey`)
  try {
    socket = new WebSocketService(`ws://127.0.0.1:8001/logs/49d93c07-e1c4-4c4e-96c5-bbe813c79ae3/990a64ec-36f4-4efc-b744-8e08ee51513f/?ey`)
    socket.onMessage = wsOnMessage
    socket.onError = wsOnError
    socket.onOpen = wsOnOpen
    socket.onClose = wsOnClose
    socket.connect()

  } catch (e) {
    logsValue.value += `[连接失败: ${e}]`
    console.error(e)
    Message.error({
      content: "连接失败",
      duration: 5000
    })
  }
}
const logHandleCancel = async () => {
  socket?.close()
  logVisible.value = false
}
const wsClose = () => {
  socket?.close()
}
const wsOnMessage = (event: MessageEvent) => {
  logsValue.value += event.data
}
const wsOnError = (error: Event) => {
  console.error(error)
  Message.error({
    content: "Websocket 发生错误",
    duration: 5000
  })
}
const wsOnOpen = () => {
  logsValue.value += '\n[连接已建立]\n'
}
const wsOnClose = () => {
  logsValue.value += '\n[连接已断开]\n'
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

.status-number-container {
  display: flex;
  justify-content: flex-start;

  .status-number {
    padding: 3px 10px;
    margin-right: 16px;
    border-radius: 15px;
    min-width: 100px;
    width: 20%;
  }

  .running-number {
    background: var(--color-primary-light-1);
    border-left: 10px solid rgb(var(--primary-6))
  }

  .failed-number {
    background: var(--color-danger-light-1);
    border-left: 10px solid rgb(var(--danger-6))
  }

  .done-number {
    background: var(--color-success-light-1);
    border-left: 10px solid rgb(var(--success-6))
  }
}

</style>