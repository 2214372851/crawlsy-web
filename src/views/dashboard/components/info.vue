<template>
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
                    <a-statistic title="数据" :value="125670" show-group-separator animation>
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
                    <a-statistic title="日请求量" :value="189" show-group-separator animation>
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
                    <a-statistic title="运行中" :value="10" show-group-separator animation>
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
                    <a-statistic title="完成" :value="12" show-group-separator animation>
                        <template #suffix>
                            个
                        </template>
                    </a-statistic>
                </a-space>
            </a-col>
            <a-col :span="24">
                <a-card title="实时流量">
                    <Chart height="300px" :option="optionLine"/>
                </a-card>
            </a-col>
        </a-row>
    </a-card>
</template>

<script setup lang="ts">
import Chart from "@/components/chart/index.vue";
import useChartOption from "@/hooks/chart-option";
const optionLine = useChartOption((isDark) => {
    return {
        backgroundColor: '',
        color: 'rgb(73,145,251)',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: 'rgba(73,145,251)'
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
                boundaryGap: false,
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
                }
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
    }
})
</script>

<style scoped lang="less">

</style>