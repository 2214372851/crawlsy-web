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
      textStyle: {
        color: isDark ? '#fff' : '#000',
      }
    },
    color: '#3760D1',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#3760D1'
        }
      },
    },
    grid: {
      left: '3%',
      right: '6%',
      bottom: '8%',
      containLabel: true
    },
    legend: {
      data: renderData.value.map(node => node.nodeUid),
      bottom: '0%',  // 将图例放置在图表底部
    },
    xAxis: {
      type: 'category',
      data: renderData.value[0]?.monitor.map(item => new Date(item.time * 1000).toLocaleString()),
      boundaryGap: false,
      nameTextStyle: {
        color: isDark ? '#fff' : '#000'
      },
      axisLine: {
        lineStyle: {
          color: isDark ? '#fff' : '#000'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: 'CPU占用率 (%)',
      nameTextStyle: {
        color: isDark ? '#fff' : '#000'
      },
      axisLine: {
        lineStyle: {
          color: isDark ? '#fff' : '#000'
        }
      }
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
        lineStyle: {
          width: 2,
        },
        showSymbol: false,
        areaStyle: {
          color: '#DEE3F1'
        },
        emphasis: {
          focus: 'series'
        },
      };
    }),
  };
});
const memoryOption = useChartOption((isDark) => {
  return {
    title: {
      text: '内存占用率',
      left: 'center',  // 确保标题居中
      textStyle: {
        color: isDark ? '#fff' : '#000',
      },
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#5541B8'
        }
      },
    },
    color: '#5541B8',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#5541B8'
        }
      },
    },
    legend: {
      data: renderData.value.map(node => node.nodeUid),
      bottom: '0%',  // 将图例放置在图表底部
    },
    grid: {
      left: '3%',
      right: '6%',
      bottom: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: renderData.value[0]?.monitor.map(item => new Date(item.time * 1000).toLocaleString()),
      boundaryGap: false,
      nameTextStyle: {
        color: isDark ? '#fff' : '#000'
      },
      axisLine: {
        lineStyle: {
          color: isDark ? '#fff' : '#000'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '内存占用率 (%)',
      nameTextStyle: {
        color: isDark ? '#fff' : '#000'
      },
      axisLine: {
        lineStyle: {
          color: isDark ? '#fff' : '#000'
        }
      },
      scale: true
    },
    series: renderData.value.map(node => {
      return {
        name: node.nodeUid,
        showSymbol: false,
        areaStyle: {
          color: '#E2DFEE'
        },
        lineStyle: {
          width: 2
        },
        emphasis: {
          focus: 'series'
        },
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
      textStyle: {
        color: isDark ? '#fff' : '#000'
      }
    },
    color: '#DB9145',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: 'rgba(73,145,251)'
        }
      },
    },
    grid: {
      left: '3%',
      right: '6%',
      bottom: '8%',
      containLabel: true
    },
    legend: {
      data: renderData.value.map(node => node.nodeUid),
      bottom: '0%',  // 将图例放置在图表底部
    },
    xAxis: {
      type: 'category',
      data: renderData.value[0]?.monitor.map(item => new Date(item.time * 1000).toLocaleString()),
      nameTextStyle: {
        color: isDark ? '#fff' : '#000'
      },
      axisLine: {
        lineStyle: {
          color: isDark ? '#fff' : '#000'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '流量 (MB)',
      nameTextStyle: {
        color: isDark ? '#fff' : '#000'
      },
      axisLine: {
        lineStyle: {
          color: isDark ? '#fff' : '#000'
        }
      }
    },
    series: renderData.value.map(node => ({
      name: node.nodeUid,
      type: 'line',
      stack: '上行流量',
      data: node.monitor.map(item => item.sent),
      smooth: true,
      showSymbol: false,
      emphasis: {
        focus: 'series'
      },
      areaStyle: {
        color: '#E6DDD5'  // 使用半透明的蓝色填充面积
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
    color: '#A45BD4',
    legend: {
      data: renderData.value.map(node => node.nodeUid),
      bottom: '0%',  // 将图例放置在图表底部
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: 'rgba(73,145,251)'
        }
      },
    },
    grid: {
      left: '3%',
      right: '6%',
      bottom: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: renderData.value[0]?.monitor.map(item => new Date(item.time * 1000).toLocaleString()),
      nameTextStyle: {
        color: isDark ? '#fff' : '#000'
      },
      axisLine: {
        lineStyle: {
          color: isDark ? '#fff' : '#000'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '流量 (MB)',
      nameTextStyle: {
        color: isDark ? '#fff' : '#000'
      },
      axisLine: {
        lineStyle: {
          color: isDark ? '#fff' : '#000'
        }
      }
    },
    series: renderData.value.map(node => ({
      name: node.nodeUid,
      type: 'line',
      stack: '下行流量',
      data: node.monitor.map(item => item.recv),
      smooth: true,
      emphasis: {
        focus: 'series'
      },
      showSymbol: false,
      areaStyle: {
        color: '#ECE2F2'  // 使用半透明的红色填充面积
      }
    })),
  };
});

const loadOption = useChartOption((isDark) => {
  return {
    title: {
      text: '负载情况',
      left: 'center',  // 确保标题居中
      textStyle: {
        color: isDark ? '#fff' : '#000',
      }
    },
    color:'rgb(255, 118, 100)',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: 'rgb(255, 118, 100)'
        }
      },
    },
    grid: {
      left: '3%',
      right: '6%',
      bottom: '8%',
      containLabel: true
    },
    legend: {
      data: renderData.value.map(node => node.nodeUid),
      bottom: '0%',  // 将图例放置在图表底部
    },
    xAxis: {
      type: 'category',
      data: renderData.value[0]?.monitor.map(item => new Date(item.time * 1000).toLocaleString()),
      nameTextStyle: {
        color: isDark ? '#fff' : '#000'
      },
      axisLine: {
        lineStyle: {
          color: isDark ? '#fff' : '#000'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '负载值',
      nameTextStyle: {
        color: isDark ? '#fff' : '#000'
      },
      axisLine: {
        lineStyle: {
          color: isDark ? '#fff' : '#000'
        }
      }
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
        showSymbol: false,
        emphasis: {
          focus: 'series'
        },
        areaStyle: {
          color: 'rgba(244,167,157,0.3)'
        }
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