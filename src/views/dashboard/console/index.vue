<template>
    <a-row :gutter="[16, 16]">
        <a-col :span="18">
            <a-space direction="vertical" size="medium" :style="{ width: '100%' }">
                <a-card :style="{ width: '100%' }" title="欢迎回来！Admin">
                    <a-row :gutter="[16, 16]">
                        <a-col :span="12">
                            <a-space class="item-box">
                                <a-avatar :size="64">
                                    <img
                                        alt="avatar"
                                        src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
                                    />
                                </a-avatar>
                                <a-statistic title="数据" :value="125670" show-group-separator>
                                    <template #suffix>
                                        TB
                                    </template>
                                </a-statistic>
                            </a-space>
                        </a-col>
                        <a-col :span="12">
                            <a-space class="item-box">
                                <a-avatar :size="64">
                                    <img
                                        alt="avatar"
                                        src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
                                    />
                                </a-avatar>
                                <a-statistic title="日请求量" :value="189" show-group-separator>
                                    <template #suffix>
                                        W
                                    </template>
                                </a-statistic>
                            </a-space>
                        </a-col>
                        <a-col :span="12">
                            <a-space class="item-box">
                                <a-avatar :size="64">
                                    <img
                                        alt="avatar"
                                        src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
                                    />
                                </a-avatar>
                                <a-statistic title="运行中" :value="10" show-group-separator>
                                    <template #suffix>
                                        个
                                    </template>
                                </a-statistic>
                            </a-space>
                        </a-col>
                        <a-col :span="12">
                            <a-space class="item-box">
                                <a-avatar :size="64">
                                    <img
                                        alt="avatar"
                                        src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
                                    />
                                </a-avatar>
                                <a-statistic title="完成" :value="12" show-group-separator>
                                    <template #suffix>
                                        个
                                    </template>
                                </a-statistic>
                            </a-space>
                        </a-col>
                        <a-col :span="24">
                            <a-card title="实时流量">
                                <v-chart style="height: 300px;" :option="optionLine" :theme="'dark'"
                                         autoresize/>
                            </a-card>
                        </a-col>
                    </a-row>
                </a-card>
                <a-row :gutter="[16, 16]">
                    <a-col :span="12">
                        <a-card title="操作记录">
                            <a-list size="medium" style="height: 300px" :bordered="false">
                                <a-list-item v-for="(item, index) in operationRecord" :key="index">
                                    {{ item }}
                                </a-list-item>
                            </a-list>
                        </a-card>
                    </a-col>
                    <a-col :span="12">
                        <a-card title="流量占比">
                            <v-chart style="height: 300px" :option="optionsPie" :theme="'dark'" autoresize/>
                        </a-card>
                    </a-col>
                </a-row>
            </a-space>
        </a-col>
        <a-col :span="6">
            <a-space :size="16" direction="vertical">
                <a-card :style="{ width: '100%' }" title="平台公告">
                    <template #extra>
                        <a-link>查看更多</a-link>
                    </template>
                    <a-list size="small" :bordered="false">
                        <a-list-item v-for="(item, index) in platformMsg" :key="index">
                            <a-tag color="blue">消息</a-tag>
                            {{ item }}
                            <template #actions>
                                <icon-edit/>
                                <icon-delete/>
                            </template>
                        </a-list-item>
                    </a-list>
                </a-card>
                <a-card :style="{ width: '100%' }" title="快捷操作">
                    <template #extra>
                        <a-link>管理</a-link>
                    </template>
                    <a-row>
                        <a-col :span="8">
                            <a-link href="." target="_blank" icon>Help</a-link>
                        </a-col>
                        <a-col :span="8">
                            <a-link href="https://gitee.com" target="_blank" icon>Gitee</a-link>
                        </a-col>
                        <a-col :span="8">
                            <a-link href="https://github.com" target="_blank" icon>Github</a-link>
                        </a-col>
                    </a-row>
                </a-card>
            </a-space>
        </a-col>
    </a-row>
</template>

<script setup lang="ts">
import {use} from "echarts/core"
import {LineChart, PieChart} from "echarts/charts"
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    ToolboxComponent,
    GridComponent
} from "echarts/components"
import {CanvasRenderer} from "echarts/renderers"
import VChart from 'vue-echarts';
import {ref} from 'vue';

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
const platformMsg = ref([
    '长相思兮长相忆',
    '断相思兮无穷极',
    '为天地立心',
    '为生民立命',
    '为往圣继绝学',
    '为万世开太平',
])
const operationRecord = ref([
    '2024/08/30 登录',
    '2024/08/30 添加爬虫',
    '2024/08/30 删除爬虫',
    '2024/08/30 删除用户',
    '2024/08/30 移除权限',
    '2024/08/30 添加菜单',
])
const optionLine = ref({
    backgroundColor: '',
    color: 'rgb(73,145,251)',
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    grid: {
        left: '3%',
        right: '5%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: '流量',
            type: 'line',
            stack: 'Total',
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
                            offset: 0,
                            color: 'rgb(0,129,255)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(0,129,255, 0)'
                        }
                    ],
                    global: false
                }
            },
            emphasis: {
                focus: 'series'
            },
            data: [
                ['2019-10-10', 200],
                ['2019-10-11', 560],
                ['2019-10-12', 750],
                ['2019-10-13', 580],
                ['2019-10-14', 250],
                ['2019-10-15', 300],
                ['2019-10-16', 450],
                ['2019-10-17', 300],
                ['2019-10-18', 100]
            ]
        }
    ]
})

const optionsPie = ref({
    backgroundColor: '',
    title: {
        text: '12312',
        left: 'center',
        top: 'center',
        subtext: '总数据量'
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        bottom: '0%',
        left: 'center'
    },
    series: [
        {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: false,
                position: 'center'
            },
            labelLine: {
                show: false
            },
            data: [
                {value: 735, name: 'Direct'},
                {value: 580, name: 'Email'},
                {value: 484, name: 'Union Ads'},
                {value: 300, name: 'Video Ads'}
            ]
        }
    ]
})
</script>

<style scoped lang="less">

</style>