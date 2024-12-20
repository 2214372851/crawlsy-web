<template>
  <div>
    <div style="height: 300px;">
      <Chart :option="cpuOption"/>
    </div>
    <div style="height: 300px;" v-if="memoryOption">
      <Chart :option="memoryOption"/>
    </div>
    <div style="height: 300px;" v-if="sentOption">
      <Chart :option="sentOption"/>
    </div>
    <div style="height: 300px;" v-if="recvOption">
      <Chart :option="recvOption"/>
    </div>
    <div style="height: 300px;" v-if="loadOption">
      <Chart :option="loadOption"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {use} from "echarts/core";
import {GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent} from "echarts/components";
import {LineChart, PieChart} from "echarts/charts";
import {CanvasRenderer} from "echarts/renderers";
import Chart from "@/components/chart/index.vue";
import useChartOption from "@/hooks/chart-option";
import {onMounted, onUnmounted, ref} from "vue";
import {monitorApi, type MonitorData} from "@/api/modules/monitor";

use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
  LineChart,
  PieChart,
  CanvasRenderer
])
const renderData = ref<MonitorData[]>([])
const cpuOption = useChartOption((isDark) => {
  return {
    title: {
      text: 'CPU占用率',
      left: 'center',  // 确保标题居中
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: renderData.value.map(node => node.nodeUid),
      bottom: '0%',  // 将图例放置在图表底部
    },
    xAxis: {
      type: 'category',
      data: renderData.value[0]?.monitor.map(item => new Date(item.time * 1000).toLocaleString()),
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      name: 'CPU占用率 (%)',
    },
    series: renderData.value.map(node => {
      return {
        name: node.nodeUid,
        type: 'line',
        data: node.monitor.map(item => ({
          name: new Date(item.time * 1000).toLocaleString(), // 转换时间戳为本地时间
          value: item.cpu_usage
        })),
        smooth: true, // 平滑曲线
      };
    }),
  };
});
const memoryOption = useChartOption((isDark) => {
  return {
    title: {
      text: '内存占用率',
      left: 'center',  // 确保标题居中
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: renderData.value.map(node => node.nodeUid),
      bottom: '0%',  // 将图例放置在图表底部
    },
    xAxis: {
      type: 'category',
      data: renderData.value[0]?.monitor.map(item => new Date(item.time * 1000).toLocaleString()),
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      name: '内存占用率 (%)',
    },
    series: renderData.value.map(node => {
      return {
        name: node.nodeUid,
        type: 'line',
        data: node.monitor.map(item => ({
          name: new Date(item.time * 1000).toLocaleString(),
          value: item.memory_usage
        })),
        smooth: true,
      };
    }),
  };
});

const sentOption = useChartOption((isDark) => {
  return {
    title: {
      text: '上行流量',
      left: 'center',  // 确保标题居中
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: renderData.value.map(node => node.nodeUid),
      bottom: '0%',  // 将图例放置在图表底部
    },
    xAxis: {
      type: 'category',
      data: renderData.value[0]?.monitor.map(item => new Date(item.time * 1000).toLocaleString()),
    },
    yAxis: {
      type: 'value',
      name: '流量 (MB)',
    },
    series: renderData.value.map(node => ({
      name: node.nodeUid,
      type: 'line',
      stack: '上行流量',
      data: node.monitor.map(item => item.sent),
      smooth: true,
      areaStyle: {
        color: 'rgba(0, 0, 255, 0.3)'  // 使用半透明的蓝色填充面积
      }
    })),
  };
});

const recvOption = useChartOption((isDark) => {
  return {
    title: {
      text: '下行流量',
      left: 'center',  // 确保标题居中
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: renderData.value.map(node => node.nodeUid),
      bottom: '0%',  // 将图例放置在图表底部
    },
    xAxis: {
      type: 'category',
      data: renderData.value[0]?.monitor.map(item => new Date(item.time * 1000).toLocaleString()),
    },
    yAxis: {
      type: 'value',
      name: '流量 (MB)',
    },
    series: renderData.value.map(node => ({
      name: node.nodeUid,
      type: 'line',
      stack: '下行流量',
      data: node.monitor.map(item => item.recv),
      smooth: true,
      areaStyle: {
        color: 'rgba(255, 0, 0, 0.3)'  // 使用半透明的红色填充面积
      }
    })),
  };
});

const loadOption = useChartOption((isDark) => {
  return {
    title: {
      text: '负载情况',
      left: 'center',  // 确保标题居中
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: renderData.value.map(node => node.nodeUid),
      bottom: '0%',  // 将图例放置在图表底部
    },
    xAxis: {
      type: 'category',
      data: renderData.value[0]?.monitor.map(item => new Date(item.time * 1000).toLocaleString()),
    },
    yAxis: {
      type: 'value',
      name: '负载值',
    },
    series: renderData.value.map(node => {
      return {
        name: node.nodeUid,
        type: 'line',
        data: node.monitor.map(item => ({
          name: new Date(item.time * 1000).toLocaleString(),
          value: item.load[1]
        })),
        smooth: true,
      };
    }),
  };
});

async function fetchData() {
  const {code, data} = await monitorApi()
  if (code != 0) return []
  renderData.value = data as MonitorData[]


}
const interval = setInterval(async () => {
  await fetchData()
}, 15000)
onMounted(async () => {
  await fetchData()
})
onUnmounted(() => {
  clearInterval(interval)
})
</script>

<style scoped lang="less">
</style>