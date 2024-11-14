<template>
  <a-select
      v-model="formValue.data.taskNodes"
      :options="options"
      :field-names="{label: 'name', value: 'id'}"
      value-key="name"
      multiple
      placeholder="请选择节点...">
    <template #header>
      <div style="padding: 6px 12px;">
        <a-checkbox v-model:value="selectAll" @change="changeHandle">全选</a-checkbox>
      </div>
    </template>
  </a-select>
</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";
import type {SelectOptionData} from "@arco-design/web-vue";

const selectAll = ref(false)
const formValue = defineModel<any>()
const props = defineProps<{ options: SelectOptionData[] }>()
const changeHandle = (value: boolean | (string | number | boolean)[]) => {
  const keys = []
  for (let i = 0; i < props.options.length; i++) {
    keys.push(props.options[i].id)
  }
  formValue.value.data.taskNodes = value ? keys : []
}
onMounted(()=>{
  formValue.value.data.taskNodes = formValue.value.data.taskNodes.map(item=>item.id)
})
</script>

<style scoped lang="less">

</style>