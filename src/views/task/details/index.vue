<template>
  <a-card>
    <a-spin style="width: 100%" :loading="loading">
      <a-descriptions
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
        <a-descriptions-item label="任务标识">
          <a-tag color="blue">
            {{ renderData.taskUid }}
          </a-tag>
        </a-descriptions-item>
      </a-descriptions>
    </a-spin>

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
        <a-button
            :loading="loading"
            @click="deploymentHandle"
            type="primary"
            v-permission="[
              {
                permission: 'scheduler',
                method: 'POST'
              }
            ]">
          <template #icon>
            <icon-play-arrow/>
          </template>
          部署
        </a-button>
        <a-button
            :loading="loading"
            @click="reconstitutionHandle"
            type="primary"
            v-permission="[
              {
                permission: 'scheduler',
                method: 'PUT'
              }
            ]">
          <template #icon>
            <icon-sync/>
          </template>
          重构
        </a-button>
        <a-button
            :loading="loading"
            @click="stopHandle"
            status="danger"
            v-permission="[
              {
                permission: 'scheduler',
                method: 'DELETE'
              }
            ]">
          <template #icon>
            <icon-record-stop/>
          </template>
          终止
        </a-button>
        <a-tooltip content="刷新">
          <a-button
              @click="fetchData"
              :loading="loading"
              v-permission="[
                {
                  permission: 'task-detail',
                  method: 'GET'
                }
              ]">
            <template #icon>
              <icon-refresh size="18"/>
            </template>
          </a-button>
        </a-tooltip>
      </a-space>
    </div>
    <a-spin style="width: 100%" :loading="loading">
      <a-grid :cols="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }" :colGap="16" :rowGap="16">
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
              <div v-show="item.status & (2 | 1 | 4)">
                <div
                    v-permission="[
                      {
                        permission: 'schedulerExtend',
                        method: 'GET'
                      }
                    ]">
                  <a-descriptions :style="{padding: '10px 0'}" size="mini" :column="1" :data="extendJson"
                                  v-if="extendJson.length > 0" bordered/>
                  <div class="extend-info" v-else-if="extendInfo">
                    {{ extendInfo }}
                  </div>
                </div>
                <a-space>
                  <a-button type="primary" @click="openLogDrawer(item.nodeUid)">
                    查看日志
                  </a-button>
                  <a-button
                      type="primary"
                      @click="openExtend(item.nodeUid)"
                      v-permission="[
                        {
                          permission: 'schedulerExtend',
                          method: 'GET'
                        }
                      ]">
                    查看拓展
                  </a-button>
                </a-space>
              </div>
            </a-space>
          </a-card>
        </a-grid-item>
      </a-grid>
    </a-spin>
    <result-table :id="resourceId"/>
    <a-drawer
        width="80%"
        title="日志查看器"
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
import {type TaskDetailItem, taskExtendApi, taskInfoApi} from "@/api/modules/task";
import {onMounted, onUnmounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {Status, type StatusType} from "@/utils/enum";
import {schedulerDeployApi, schedulerReloadApi, schedulerStopApi} from "@/api/modules/scheduler";
import {Message} from "@arco-design/web-vue";
import Logger from "@/components/logger/index.vue";
import useUserStore from "@/stores/modules/user";
import ResultTable from "@/views/task/components/resultTable.vue";

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
const userStore = useUserStore()
const logNodeUid = ref('')
const extendInfo = ref('')
const extendJson = ref<{ label: string, value: string }[]>([])
let timer: number | null = null
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
    renderData.value = data as TaskDetailItem;
    taskCount.value = {done: 0, running: 0, failed: 0}
    const node_length: number = data?.taskNodes.length as number
    for (let i = 0; i < node_length; i++) {
      const status = data?.taskNodes[i].status
      if (status === 2) {
        taskCount.value.done++
      } else if (status === 1) {
        taskCount.value.running++
      } else if (status == 4) {
        taskCount.value.failed++
      }
    }
    if (taskCount.value.running === 0) {
      clearInterval(timer as number)
      timer = null
    } else if (!timer) {
      timer = setInterval(async () => {
        await fetchData()
      }, 15000)
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
const openLogDrawer = async (nodeUid: string) => {
  logsValue.value = ''
  logVisible.value = true
  logNodeUid.value = nodeUid
}
const logHandleOk = async () => {
  logsValue.value = '[等待连接中...]'
  try {
    socket = new WebSocketService(`${import.meta.env.VITE_WS_URL}/logs/${logNodeUid.value}/${renderData.value.taskUid}/?${userStore.accessToken}`)
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
const openExtend = async (nodeUid: string) => {
  const {code, data} = await taskExtendApi(renderData.value.taskUid, nodeUid)
  if (code !== 0) {
    Message.error({
      content: "获取拓展信息失败",
      duration: 5000
    })
    return
  }
  if (!data) {
    extendInfo.value = '暂无拓展信息'
    return
  }
  extendInfo.value = ''
  extendJson.value = []
  try {
    const jsonData = JSON.parse(data as string)
    const newJsonData = []
    for (const key in jsonData) {
      newJsonData.push({
        label: key,
        value: jsonData[key]
      })
    }
    extendJson.value = newJsonData
  } catch (e) {
    extendInfo.value = data as string
  }
}

onMounted(async () => {
  timer = setInterval(async () => {
    await fetchData()
  }, 15000)
  await fetchData()
})
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
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

.extend-info {
  padding: 16px;
  background: var(--color-fill-1);
  border-radius: 4px;
  margin: 16px 0;
}
</style>
