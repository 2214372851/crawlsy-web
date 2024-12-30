<template>

  <a-space direction="vertical" size="medium" :style="{ width: '100%' }">
    <!-- 系统概览卡片 -->
    <a-card>
      <a-grid :cols="{ xs: 2, sm: 2, md: 4, lg: 4 }" :colGap="12">
        <a-grid-item>
          <a-statistic title="节点总数" :value="statistics.nodeCount" :value-style="{ color: '#0fbf60' }">
            <template #suffix>
              <icon-robot/>
            </template>
          </a-statistic>
        </a-grid-item>
        <a-grid-item>
          <a-statistic title="任务总数" :value="statistics.taskCount" :value-style="{ color: '#3370ff' }">
            <template #suffix>
              <icon-schedule/>
            </template>
          </a-statistic>
        </a-grid-item>
        <a-grid-item>
          <a-statistic title="爬虫总数" :value="statistics.spiderCount" :value-style="{ color: '#ee4d38' }">
            <template #suffix>
              <icon-bug/>
            </template>
          </a-statistic>
        </a-grid-item>
        <a-grid-item>
          <a-statistic title="告警总数" :value="statistics.alertCount" :value-style="{ color: '#ff7d00' }">
            <template #suffix>
              <icon-notification/>
            </template>
          </a-statistic>
        </a-grid-item>
      </a-grid>
    </a-card>

    <!-- 节点状态监控 -->
    <a-card title="节点状态监控">
      <a-grid :cols="{ xs: 2, sm: 2, md: 3, lg: 4 }" :colGap="16" :rowGap="16">
        <a-grid-item v-for="node in monitorData" :key="node.nodeUid">
          <a-card class="node-card" :class="{ 'node-inactive': !isNodeActive(node) }">
            <template #title>
              <a-space align="center">
                <a-tooltip :content="node.nodeUid">
                  <span class="node-title">
                    {{ node.nodeUid }}
                  </span>
                </a-tooltip>
                <a-tag :color="isNodeActive(node) ? 'green' : 'red'" size="small">
                  {{ isNodeActive(node) ? '在线' : '离线' }}
                </a-tag>
              </a-space>
            </template>
            <a-space direction="vertical" fill>
              <a-row justify="space-between">
                <span>运行任务数：</span>
                <a-tag color="arcoblue">{{ getRunningTaskCount(node) }}</a-tag>
              </a-row>
              <a-row justify="space-between">
                <span>CPU使用率：</span>
                <a-tag :color="getCpuColor(getLatestCpuUsage(node) as number)">
                  {{ getLatestCpuUsage(node) }}%
                </a-tag>
              </a-row>
              <a-row justify="space-between">
                <span>内存使用率：</span>
                <a-tag :color="getMemoryColor(getLatestMemoryUsage(node) as number)">
                  {{ getLatestMemoryUsage(node) }}%
                </a-tag>
              </a-row>
            </a-space>
          </a-card>
        </a-grid-item>
      </a-grid>
    </a-card>

    <!-- 任务状态分布 & 节点负载排行 -->
    <a-grid :cols="{ xs: 1, sm: 1, md: 2 }" :colGap="16">
      <a-grid-item>
        <a-card title="任务状态分布">
          <Chart height="300px" :option="taskStatusOption"/>
        </a-card>
      </a-grid-item>
      <a-grid-item>
        <a-card title="节点负载排行">
          <a-table :data="nodeLoadRanking" :pagination="false">
            <template #columns>
              <a-table-column title="节点" data-index="nodeUid"/>
              <a-table-column title="负载" data-index="load">
                <template #cell="{ record }">
                  <a-tag>{{ record.load[0] }}</a-tag>
                  |
                  <a-tag>{{ record.load[1] }}</a-tag>
                  |
                  <a-tag>{{ record.load[2] }}</a-tag>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </a-card>
      </a-grid-item>
    </a-grid>
  </a-space>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {use} from 'echarts/core';
import {monitorApi, type MonitorData} from '@/api/modules/monitor';
import {alertListApi} from '@/api/modules/alert';
import {nodeListApi} from '@/api/modules/node';
import {taskListApi} from '@/api/modules/task';
import {spiderListApi} from '@/api/modules/spider';
import {PieChart} from 'echarts/charts';
import {LegendComponent, TitleComponent, TooltipComponent} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';
import Chart from '@/components/chart/index.vue';

// 注册必需的组件
use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer
]);

// 添加任务状态的枚举
enum TaskStatus {
  PENDING = 0,
  RUNNING = 1,
  COMPLETED = 2,
  FAILED = 3,
  STOPPED = 4
}

// 统计数据
const statistics = ref({
  nodeCount: 0,
  taskCount: 0,
  spiderCount: 0,
  alertCount: 0,
});

// 监控数据
const monitorData = ref<MonitorData[]>([]);

// 添加工具函数
const isNodeActive = (node: MonitorData) => {
  if (!node.monitor || node.monitor.length === 0) return false;
  const latestTime = node.monitor[node.monitor.length - 1].time;
  const now = Math.floor(Date.now() / 1000);
  return now - latestTime < 30; // 30秒内有数据则认为节点在线
};

const getRunningTaskCount = (node: MonitorData) => {
  if (!node.monitor || node.monitor.length === 0) return 0;
  const latestData = node.monitor[node.monitor.length - 1];
  return latestData.tasks.filter(task => task.status === TaskStatus.RUNNING).length;
};

const getLatestCpuUsage = (node: MonitorData) => {
  if (!node.monitor || node.monitor.length === 0) return 0;
  return node.monitor[node.monitor.length - 1].cpu_usage.toFixed(1);
};

const getLatestMemoryUsage = (node: MonitorData) => {
  if (!node.monitor || node.monitor.length === 0) return 0;
  return node.monitor[node.monitor.length - 1].memory_usage.toFixed(1);
};

const getCpuColor = (usage: number) => {
  if (usage >= 90) return 'red';
  if (usage >= 70) return 'orange';
  return 'green';
};

const getMemoryColor = (usage: number) => {
  if (usage >= 90) return 'red';
  if (usage >= 70) return 'orange';
  return 'green';
};

// 获取统计数据
const fetchStatistics = async () => {
  // noinspection TypeScriptValidateTypes
  const [nodeRes, taskRes, spiderRes, alertRes] = await Promise.all([
    nodeListApi({pageSize: 1}),
    taskListApi({pageSize: 1}),
    spiderListApi({pageSize: 1}),
    alertListApi({pageSize: 1}),
  ]);

  statistics.value = {
    nodeCount: nodeRes.data?.total ?? 0,
    taskCount: taskRes.data?.total ?? 0,
    spiderCount: spiderRes.data?.total ?? 0,
    alertCount: alertRes.data?.total ?? 0,
  };
};

// 添加图表配置
const taskStatusOption = computed(() => {
  const statusCount = {
    running: 0,
    stopped: 0,
    pending: 0,
    failed: 0,
  };

  monitorData.value.forEach(node => {
    if (!node.monitor?.length) return;
    node.monitor[node.monitor.length - 1].tasks.forEach(task => {
      switch (task.status) {
        case TaskStatus.RUNNING:
          statusCount.running++;
          break;
        case TaskStatus.STOPPED:
          statusCount.stopped++;
          break;
        case TaskStatus.PENDING:
          statusCount.pending++;
          break;
        case TaskStatus.FAILED:
          statusCount.failed++;
          break;
      }
    });
  });

  return {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: '0',
      left: 'center'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          {value: statusCount.running, name: '运行中', itemStyle: {color: '#52c41a'}},
          {value: statusCount.stopped, name: '已停止', itemStyle: {color: '#ff4d4f'}},
          {value: statusCount.pending, name: '等待中', itemStyle: {color: '#faad14'}},
          {value: statusCount.failed, name: '失败', itemStyle: {color: '#ff7a45'}}
        ]
      }
    ]
  };
});

// 节点负载排行
const nodeLoadRanking = computed(() => {
  return monitorData.value
      .map(node => {
        const latestData = node.monitor[0];
        return {
          nodeUid: node.nodeUid,
          load: latestData.load
        };
      })
      .sort((a, b) => b.load[0] - a.load[0])
      .slice(0, 5);
});

// 修改 fetchMonitorData 和定时器
const fetchMonitorData = async () => {
  const {code, data} = await monitorApi();
  if (code === 0) {
    monitorData.value = data as MonitorData[];
  }
};

// 修改 onMounted
onMounted(async () => {
  try {
    await Promise.all([
      fetchStatistics(),
      fetchMonitorData()
    ]);
  } catch (error) {
    console.error('Failed to fetch initial data:', error);
  }
});
</script>

<style scoped lang="less">
.arco-card {
  border-radius: 4px;
}

.arco-statistic {
  text-align: center;
}

.node-card {
  transition: all 0.3s;

  &.node-inactive {
    opacity: 0.6;
  }

  :deep(.arco-card-header) {
    padding: 12px 16px;
  }

  :deep(.arco-card-body) {
    padding: 12px 16px;
  }

  .arco-row {
    align-items: center;
  }

  .node-title {
    cursor: pointer;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;

    &:hover {
      color: rgb(var(--primary-6));
    }
  }
}
</style>