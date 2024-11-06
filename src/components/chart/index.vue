<template>
  <v-chart
      v-if="renderChart"
      :autoresize="autoresize"
      :style="{width, height}"
      :update-options="{lazyUpdate: true}"
      :option="options"/>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import {nextTick, ref} from "vue";


defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '100%'
  },
  autoresize: {
    type: Boolean,
    default: true
  },
  options: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const renderChart = ref(false)

nextTick(() => {
  renderChart.value = true
  console.log(renderChart.value, 'dd')
})
</script>

<style scoped lang="less">

</style>