<template>
    <a-row :gutter="[16, 16]">
        <a-col :span="18">
            <a-space direction="vertical" size="medium" :style="{ width: '100%' }">
                <info/>
                <record/>
            </a-space>
        </a-col>
        <a-col :span="6">
            <sidebar-left/>
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
import Info from "@/views/dashboard/components/info.vue";
import Record from "@/views/dashboard/components/record.vue";
import SidebarLeft from "@/views/dashboard/components/sidebar-left.vue";


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
</script>

<style scoped lang="less">

</style>