<template>
  <a-input-tag
      :default-value="tags"
      @change="changeHandler"
      placeholder="请输入对象..."
      unique-value/>
</template>

<script setup lang="ts">
import {computed, ModelRef} from "vue";

const values = defineModel() as ModelRef<string>
const tags = computed(() => {
  if (!values.value) return []
  return values.value.split(';')
})

const changeHandler = (value: string[]) => {
  values.value = value.join(';')
}
</script>

<style scoped lang="less">

</style>