<template>
  <a-grid :cols="{ xs: 1, sm: 1, md: 3, lg: 3, xl: 3, xxl: 3 }" :colGap="12" :rowGap="16">
    <a-grid-item :span="2">
      <a-space direction="vertical" size="medium" :style="{ width: '100%' }">
        <info/>
        <record/>
      </a-space>
    </a-grid-item>
    <a-grid-item>
      <sidebar-info/>
    </a-grid-item>
  </a-grid>
</template>

<script setup lang="ts">
import {use} from "echarts/core"
import {LineChart, PieChart} from "echarts/charts"
import {GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent} from "echarts/components"
import {CanvasRenderer} from "echarts/renderers"
import Info from "@/views/dashboard/components/info.vue";
import Record from "@/views/dashboard/components/record.vue";
import SidebarInfo from "@/views/dashboard/components/sidebar-info.vue";


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