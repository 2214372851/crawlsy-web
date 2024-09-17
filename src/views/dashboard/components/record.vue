<template>
    <a-grid :cols="{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }" :colGap="12" :rowGap="16">
        <a-card title="操作记录">
            <a-list size="medium" style="height: 300px" :bordered="false">
                <a-list-item v-for="(item, index) in operationRecord" :key="index">
                    {{ item }}
                </a-list-item>
            </a-list>
        </a-card>
        <a-card title="流量占比">
            <Chart :options="optionsPie" height="300px"/>
        </a-card>
    </a-grid>
</template>

<script setup lang="ts">
import Chart from "@/components/chart/index.vue";
import useChartOption from "@/hooks/chart-option";
import {ref} from "vue";


const operationRecord = ref([
    '2024/08/30 登录',
    '2024/08/30 添加爬虫',
    '2024/08/30 删除爬虫',
    '2024/08/30 删除用户',
    '2024/08/30 移除权限',
    '2024/08/30 添加菜单',
])
const optionsPie = useChartOption((isDark) => {
    return {
        backgroundColor: '',
        title: {
            text: '12312',
            left: 'center',
            top: 'center',
            textStyle: {
                color: isDark ? '#fff' : '#000'
            },
            subtext: '总数据量',
            subtextStyle: {
                color: isDark ? '#d4d0d0' : '#000'
            }
        },
        tooltip: {
            trigger: 'item',
        },
        legend: {
            bottom: '0%',
            left: 'center',
            textStyle: {
                color: isDark ? '#d4d0d0' : '#000'
            }
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['35%', '68%'],
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
    };
})
</script>

<style scoped lang="less">

</style>