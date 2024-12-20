<template>
  <a-card>

    <a-spin dot :loading="loading" style="width: 100%">
      <a-descriptions
          :column="3"
          :title="renderData.name"
          layout="inline-vertical"
          :label-style="{
            'margin-top': '16px'
          }">
        <a-descriptions
            :column="2"
            layout="inline-vertical"
            :label-style="{
            'margin-top': '16px'
          }">
          <a-descriptions-item label="节点状态">
            <a-tag :color="renderData.status ? 'green' : 'red'">
              {{ renderData.status ? '可用' : '不可用' }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="节点标识">
            <a-tag>
              {{ renderData.nodeUid }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="创建时间">
            <a-tag color="arcoblue">{{ renderData.createTime }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="更新时间">
            <a-tag color="arcoblue">{{ renderData.updateTime }}</a-tag>
          </a-descriptions-item>
        </a-descriptions>
      </a-descriptions>
    </a-spin>
    <a-divider :margin="40" orientation="left">节点任务状态</a-divider>
    <a-grid v-if="renderData.monitor[renderData.monitor.length - 1]?.tasks.length > 0"
            :cols="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }" :colGap="16"
            :rowGap="16">
      <a-grid-item v-for="item in renderData.monitor[renderData.monitor.length - 1]?.tasks" :key="item.taskUid">
        <a-tooltip :content="`${Status[item.status as StatusType].msg}`">
          <div class="status-card">
            <span class="title">
              {{ item.taskUid }}
            </span>
            <span :class="`status ${Status[item.status as StatusType].color}`"></span>
          </div>
        </a-tooltip>
      </a-grid-item>
    </a-grid>

    <a-divider :margin="40" orientation="left">节点监控</a-divider>

    <a-grid :cols="{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }" :colGap="16" :rowGap="16">
      <a-grid-item>
        <Chart height="300px" :options="optionCpu"/>
      </a-grid-item>
      <a-grid-item>
        <Chart height="300px" :option="optionRam"/>
      </a-grid-item>
      <a-grid-item>
        <Chart height="300px" :option="optionBand"/>
      </a-grid-item>
      <a-grid-item>
        <Chart height="300px" :option="optionLoad"/>
      </a-grid-item>
    </a-grid>
  </a-card>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import useLoading from "@/hooks/loading";
import {onMounted, onUnmounted, ref} from "vue";
import {type NodeDetailData, nodeInfoApi, type NodeStatus} from "@/api/modules/node";
import Chart from "@/components/chart/index.vue";
import useChartOption from "@/hooks/chart-option";
import {use} from "echarts/core";
import {GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent} from "echarts/components";
import {LineChart, PieChart} from "echarts/charts";
import {CanvasRenderer} from "echarts/renderers";
import {Status, type StatusType} from "@/utils/enum";

use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
  LineChart,
  PieChart,
  CanvasRenderer,
])
const ramData = ref<[string, number][]>([])
const load1mData = ref<[string, number][]>([])
const load5mData = ref<[string, number][]>([])
const load15mData = ref<[string, number][]>([])
const cpuData = ref<[string, number][]>([])
const recvData = ref<[string, number][]>([])
const sentData = ref<[string, number][]>([])
const tooltipFormat = (params: any) => {
  let relVal = params[0].name;
  for (let i = 0; i < params.length; i++) {
    relVal += params[i].marker + params[i].seriesName + ' : ' + params[i].value[1] + '<br/>'
  }
  return relVal
}
const optionCpu = useChartOption((isDark) => {
  return {
    title: {
      text: 'CPU使用率(%)',
      left: 'left',
      top: 'top',
      textStyle: {
        color: isDark ? 'rgb(166,166,166)' : '#000',
        fontSize: 16,
        fontWeight: 500
      }
    },
    backgroundColor: '',
    color: 'rgb(0, 29,255)',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: 'rgba(73,145,251)'
        }
      },
      formatter: tooltipFormat
    },
    grid: {
      left: '3%',
      right: '6%',
      bottom: '4%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'time',
        boundaryGap: false,
        axisLabel: {rotate: 30},
        nameTextStyle: {
          color: isDark ? '#fff' : '#000'
        },
        axisLine: {
          lineStyle: {
            color: isDark ? '#fff' : '#000'
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        nameTextStyle: {
          color: isDark ? '#fff' : '#000'
        },
        axisLine: {
          lineStyle: {
            color: isDark ? '#fff' : '#000'
          }
        },
      }
    ],
    series: [
      {
        name: 'CPU使用率',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 2,
        },
        showSymbol: false,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0.4,
                color: 'rgb(177,185,248)'
              },
              {
                offset: 1,
                color: 'rgba(177, 185, 248, 0)'
              }
            ],
            global: false
          }
        },
        emphasis: {
          focus: 'series'
        },
        data: cpuData.value
      }
    ]
  }
})
const optionRam = useChartOption((isDark) => {
  return {
    title: {
      text: '内存使用率(%)',
      left: 'left',
      top: 'top',
      textStyle: {
        color: isDark ? '#fff' : '#000',
        fontSize: 16,
        fontWeight: 500
      }
    },
    backgroundColor: '',
    color: 'rgb(0, 29,255)',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: 'rgba(73,145,251)'
        }
      },
      formatter: tooltipFormat
    },
    grid: {
      left: '3%',
      right: '6%',
      bottom: '4%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'time',
        boundaryGap: false,
        axisLabel: {rotate: 30},
        nameTextStyle: {
          color: isDark ? '#fff' : '#000'
        },
        axisLine: {
          lineStyle: {
            color: isDark ? '#fff' : '#000'
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        nameTextStyle: {
          color: isDark ? '#fff' : '#000'
        },
        axisLine: {
          lineStyle: {
            color: isDark ? '#fff' : '#000'
          }
        },
        scale: true
      }
    ],
    series: [
      {
        name: '内存使用率',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 2
        },
        showSymbol: false,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0.4,
                color: 'rgb(177,185,248)'
              },
              {
                offset: 1,
                color: 'rgba(177, 185, 248, 0)'
              }
            ],
            global: false
          }
        },
        emphasis: {
          focus: 'series'
        },
        data: ramData.value
      }
    ]
  }
})
const optionBand = useChartOption((isDark) => {
  return {
    title: {
      text: '带宽(MB/S)',
      left: 'left',
      top: 'top',
      textStyle: {
        color: isDark ? '#fff' : '#000',
        fontSize: 16,
        fontWeight: 500
      }
    },
    backgroundColor: '',
    color: ['rgb(0, 29,255)', 'rgb(255, 118, 100)'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: 'rgba(73,145,251)'
        }
      },
      formatter: tooltipFormat
    },
    grid: {
      left: '3%',
      right: '6%',
      bottom: '4%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'time',
        boundaryGap: false,
        axisLabel: {rotate: 30},
        nameTextStyle: {
          color: isDark ? '#fff' : '#000'
        },
        axisLine: {
          lineStyle: {
            color: isDark ? '#fff' : '#000'
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        nameTextStyle: {
          color: isDark ? '#fff' : '#000'
        },
        axisLine: {
          lineStyle: {
            color: isDark ? '#fff' : '#000'
          }
        },
        axisLabel: {
          formatter: function (value: number) {
            return value + ' MB';  // 在这里设置单位，例如 '单位'
          }
        }
      }
    ],
    series: [
      {
        name: '下行速度',
        type: 'line',
        // stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 2
        },
        showSymbol: false,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0.4,
                color: 'rgb(177, 185, 248)'
              },
              {
                offset: 1,
                color: 'rgba(177, 185, 248, 0)'
              }
            ],
            global: false
          }
        },
        emphasis: {
          focus: 'series'
        },
        data: recvData.value
      },
      {
        name: '上行速度',
        type: 'line',
        // stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 2
        },
        showSymbol: false,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0.4,
                color: 'rgb(244, 167, 157)'
              },
              {
                offset: 1,
                color: 'rgba(177, 185, 248, 0)'
              }
            ],
            global: false
          }
        },
        emphasis: {
          focus: 'series'
        },
        data: sentData.value
      },
    ]
  }
})
const optionLoad = useChartOption((isDark) => {
  return {
    title: {
      text: '负载',
      left: 'left',
      top: 'top',
      textStyle: {
        color: isDark ? '#fff' : '#000',
        fontSize: 16,
        fontWeight: 500
      }
    },
    backgroundColor: '',
    color: ['rgb(0, 29,255)', 'rgb(255, 118, 100)', 'rgb( 73,166,119)'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: 'rgba(73,145,251)'
        }
      },
      formatter: tooltipFormat
    },
    grid: {
      left: '3%',
      right: '6%',
      bottom: '4%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'time',
        boundaryGap: false,
        axisLabel: {rotate: 30},
        nameTextStyle: {
          color: isDark ? '#fff' : '#000'
        },
        axisLine: {
          lineStyle: {
            color: isDark ? '#fff' : '#000'
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        nameTextStyle: {
          color: isDark ? '#fff' : '#000'
        },
        axisLine: {
          lineStyle: {
            color: isDark ? '#fff' : '#000'
          }
        },
      }
    ],
    series: [
      {
        name: 'Load 1m',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 2
        },
        showSymbol: false,
        emphasis: {
          focus: 'series'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0.4,
                color: 'rgb(177, 185, 248)'
              },
              {
                offset: 1,
                color: 'rgba(177, 185, 248, 0)'
              }
            ],
            global: false
          }
        },

        data: load1mData.value
      },
      {
        name: 'Load 5m',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 2
        },
        showSymbol: false,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0.4,
                color: 'rgb(244, 167, 157)'
              },
              {
                offset: 1,
                color: 'rgba(177, 185, 248, 0)'
              }
            ],
            global: false
          }
        },
        emphasis: {
          focus: 'series'
        },
        data: load5mData.value
      },
      {
        name: 'Load 15m',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 2
        },
        showSymbol: false,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0.4,
                color: 'rgb(152,227,183)'
              },
              {
                offset: 1,
                color: 'rgba(177, 185, 248, 0)'
              }
            ],
            global: false
          }
        },
        emphasis: {
          focus: 'series'
        },
        data: load15mData.value
      },
    ]
  }
})

const route = useRoute();
const {loading, setLoading} = useLoading()
const resourceId = route.query?.id as string
const renderData = ref<NodeDetailData>({
  monitor: [],
  id: 0,
  name: "",
  nodeLoad: 0,
  nodeUid: "",
  status: false,
  createTime: "",
  updateTime: ""
})
const fetchData = async () => {
  setLoading(true);
  try {
    const {code, data} = await nodeInfoApi(resourceId)
    if (code !== 0) return
    renderData.value = data as NodeDetailData;
    const ram: [string, number][] = []
    const cpu: [string, number][] = []
    const recv: [string, number][] = []
    const sent: [string, number][] = []
    const load1m: [string, number][] = []
    const load5m: [string, number][] = []
    const load15m: [string, number][] = []
    for (let i = 0; i < (data?.monitor.length as number); i++) {
      const item = data?.monitor[i] as NodeStatus
      const time = timestampToTime(item.time)
      ram.push([time, item.memory_usage])
      cpu.push([time, item.cpu_usage])
      recv.push([time, item.recv])
      sent.push([time, item.sent])
      load1m.push([time, item.load[0]])
      load5m.push([time, item.load[1]])
      load15m.push([time, item.load[2]])
    }
    ramData.value = ram
    cpuData.value = cpu
    recvData.value = recv
    sentData.value = sent
    load1mData.value = load1m
    load5mData.value = load5m
    load15mData.value = load15m
  } catch (err) {
    console.error(err)
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}
const timestampToTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  const s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return Y + M + D + h + m + s;
}
const interval = setInterval(async () => {
  await fetchData()
}, 15000)
setLoading(true)
onMounted(async () => {
  await fetchData()
})
onUnmounted(() => {
  clearInterval(interval)
})
</script>

<style scoped lang="less">
.status-card {
  padding: 10px;
  border-radius: 10px;
  background: rgba(34, 34, 39, 1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #8aa7df;

  .title {
    color: white;
    font-size: 15px;
    font-weight: 600;

  }

  .status {
    width: 15px;
    height: 15px;
    border-radius: 50%;
  }

  .green {
    background: #39e439;
  }

  .arcoblue {
    background: #48c1ff;
  }

  .red {
    background: #ff4d4f;
  }

  .gray {
    background: #8c8c8c;
  }
}
</style>