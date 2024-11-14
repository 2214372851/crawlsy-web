<template>
  <MonacoEditor
      theme="vs-dark"
      v-model="logs"
      :options="options"/>
</template>

<script setup lang="ts">
import MonacoEditor from "@/components/monacoEditor/index.vue";
import {onMounted, onUnmounted, ref} from "vue";
import type {Options} from "@/components/monacoEditor/index";
import WebSocketService from "@/utils/socket";

const options = ref<Options>({
  automaticLayout: false,
  foldingStrategy: 'indentation',
  fontSize: 14,
  minimap: {enabled: false},
  overviewRulerBorder: false,
  readOnly: false,
  renderLineHighlight: 'none',
  scrollBeyondLastLine: false,
  selectOnLineNumbers: false
})

const logs = defineModel<string>()
const emit = defineEmits<(e: 'close') => void>()
onUnmounted(() => {
  emit('close')
})
</script>

<script lang="ts">
export default {
  name: "Logger"
}
</script>

<style scoped lang="less">
.code-cursor {
  cursor: text;
  height: 100%;
}
</style>