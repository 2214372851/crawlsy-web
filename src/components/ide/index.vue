<template>
  <div style="height: 100%">
    <a-space>
      <a-tooltip content="展开/收缩文件栏">
        <a-button @click="handleCollapsed">
          <template #icon>
            <icon-to-left v-if="splitSize !== 0"/>
            <icon-to-right v-else/>
          </template>
        </a-button>
      </a-tooltip>
      <a-tooltip content="保存">
        <a-button :loading="saveLoading" @click="saveChange">
          <template #icon>
            <icon-save/>
          </template>
        </a-button>
      </a-tooltip>
      <a-tooltip content="语言">
        <a-select v-model="language" :options="langOptions" :style="{width:'140px'}" placeholder="选择语言"
                  allow-search/>
      </a-tooltip>
      <a-tooltip content="主题">
        <a-select v-model="theme" :options="themeOptions" :style="{width:'140px'}" placeholder="选择主题"
                  allow-search/>
      </a-tooltip>
    </a-space>
    <a-split
        class="ide-box"
        v-model:size="splitSize">
      <template #first>
        <a-tree
            :data="fileTreeOption"
            blockNode
            size="medium"
            :load-more="loadDir"
            @select="getFileContent as any"
            style="margin-right: 20px;"
            show-line>
          <template #title="nodeData">
            <a-dropdown trigger="contextMenu" alignPoint :style="{display:'block'}">
              <div style="overflow: hidden;white-space: nowrap">{{ nodeData?.title }}</div>
              <template #content>
                <a-doption @click="addChange(nodeData.key)">新建</a-doption>
                <a-doption @click="delChange(nodeData.key)">删除</a-doption>
                <a-doption @click="renameChange(nodeData.key)">重命名</a-doption>
              </template>
            </a-dropdown>

          </template>
        </a-tree>
      </template>
      <template #second>
        <a-spin :loading="loading" style="height: 100%;width: 100%" dot>
          <div style="height: 100%;display: flex;align-items: center" v-if="codeVals.length === 0">
            <a-empty/>
          </div>
          <a-tabs v-else type="card" v-model:active-key="tabKey" justify :editable="true" @delete="handleDelete">
            <a-tab-pane v-for="item in codeVals" :key="item.key">
              <template #title>
                <icon-code/>
                {{ item.name }}
              </template>
              <div style="height: 100%;width: 100%;overflow:auto;">
                <MonacoEditor
                    :key="item.key"
                    :theme="theme"
                    v-model="item.value"
                    @save-change="saveChange"
                    :language="language"
                    width="100%"
                    height="100%"/>
              </div>
            </a-tab-pane>
          </a-tabs>
        </a-spin>
      </template>
    </a-split>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from "vue";
import type {ApiResponse, IdeTabItem} from "@/types/global";
import MonacoEditor from "@/components/monacoEditor/index.vue";
import {Modal, type TreeNodeData} from "@arco-design/web-vue";
import useLoading from "@/hooks/loading";

const {loading, setLoading} = useLoading()
const {fileTreeOption, loadFileApi, saveLoading = false} = defineProps<{
  saveLoading: boolean,
  fileTreeOption: TreeNodeData[],
  loadDir: (nodeData: TreeNodeData) => any,
  loadFileApi: (nodeData: string) => Promise<ApiResponse<string>>,
}>()
let lastSplitSize = 240
const tabKey = ref('')
const splitSize = ref(240)
const theme = ref<"vs" | "hc-black" | "vs-dark">('vs')
const themeOptions = [
  {
    label: 'vs',
    value: 'vs'
  },
  {
    label: 'hc-black',
    value: 'hc-black'
  },
  {
    label: 'vs-dark',
    value: 'vs-dark'
  }
]
const language = ref("python")
const langOptions = [
  "python",
  "json",
  "javascript",
  "html",
  "css",
  "yaml",
  "rust",
  "sql",
  "xml",
  "go",
  "java",
  "typescript",
  "scss",
  "less",
  "handlebars",
  "razor",

]
const codeVals = ref<IdeTabItem[]>([])
const emit = defineEmits(['save-change', 'del-change', 'add-change', 'rename-change'])
const handleCollapsed = () => {
  if (splitSize.value !== 0) {
    lastSplitSize = splitSize.value
    splitSize.value = 0
  } else {
    splitSize.value = lastSplitSize
  }
}
const handleDelete = (key: string | number) => {
  codeVals.value = codeVals.value.filter(item => item.key !== key)
};
watch(
    tabKey,
    newValue => {
      const fileName: string = codeVals.value.filter(item => item.key === newValue)[0].name
      if (fileName.endsWith(".py")) {
        language.value = "python"
      } else if (fileName.endsWith(".js")) {
        language.value = "javascript"
      } else if (fileName.endsWith(".rs")) {
        language.value = "rust"
      } else if (fileName.endsWith(".ts")) {
        language.value = "typescript"
      } else if (fileName.endsWith(".css")) {
        language.value = "css"
      } else if (fileName.endsWith(".go")) {
        language.value = "go"
      } else if (fileName.endsWith(".html")) {
        language.value = "html"
      } else {
        language.value = "python"
      }
    }
)
const getFileContent = async (seletcedKeys: string[], treeData: { node: TreeNodeData }) => {
  if (seletcedKeys.length === 0) return
  if (codeVals.value.filter(item => item.key === seletcedKeys[0]).length > 0) {
    tabKey.value = seletcedKeys[0]
    return
  }
  setLoading(true)
  try {
    const {code, data} = await loadFileApi(seletcedKeys[0])
    if (code !== 0) return
    codeVals.value.push({
      key: seletcedKeys[0],
      name: treeData.node.title as string,
      value: data as string
    })
    tabKey.value = seletcedKeys[0]
  } finally {
    setLoading(false)
  }
}
const saveChange = () => {
  if (!saveLoading) {
    emit('save-change', tabKey.value, codeVals.value.filter(item => item.key === tabKey.value)[0].value)
  }
}
const delChange = async (key: string) => {
  Modal.open({
    title: '操作通知',
    content: '确认删除资源吗？',
    onOk: async () => {
      emit('del-change', key)
    }
  });

}
const addChange = async (key: string) => {
  emit('add-change', key)
}
const renameChange = async (key: string) => {
  emit('rename-change', key)
}

onMounted(() => {
  window.onbeforeunload = function (e) {
    // @ts-ignore
    e = e || window.event;
    // 兼容IE8和Firefox 4之前的版本
    if (e) {
      e.returnValue = '关闭提示';
    }
    // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
    return '关闭提示';
  }
  const themeValue = document.body.getAttribute('arco-theme')
  if (!themeValue) {
    theme.value = 'vs'
  } else {
    theme.value = 'vs-dark'
  }
})
onUnmounted(() => {
  window.onbeforeunload = null
})
</script>

<script lang="ts">
export default {
  name: 'Ide'
}
</script>

<style scoped lang="less">
.ide-box {
  display: flex;
  width: 100%;
  min-height: 400px;
  height: 100%;
  margin-top: 10px;
}

:deep(.arco-tabs-content) {
  padding: 0 !important;
}

:deep(.arco-tree-node-title-text) {
  width: 100%;
}
</style>