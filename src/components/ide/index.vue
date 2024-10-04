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
        <a-button>
          <template #icon>
            <icon-save/>
          </template>
        </a-button>
      </a-tooltip>
      <a-tooltip content="新建">
        <a-button>
          <template #icon>
            <icon-plus/>
          </template>
        </a-button>
      </a-tooltip>
      <a-tooltip content="删除">
        <a-button>
          <template #icon>
            <icon-delete/>
          </template>
        </a-button>
      </a-tooltip>
      <a-tooltip content="语言">
        <a-select v-model="language" :options="langOptions" :style="{width:'140px'}" placeholder="选择语言"
                  allow-search/>
      </a-tooltip>
    </a-space>
    <a-split
        class="ide-box"
        v-model:size="splitSize">
      <template #first>
        <a-tree
            :data="fileTreeOption"
            :blockNode="true"
            size="medium"
            :load-more="loadDir"
            @select="getFileContent as any"
            style="margin-right: 20px;"
            show-line>
        </a-tree>
      </template>
      <template #second>
        <div style="height: 100%;display: flex;align-items: center" v-if="codeVals.length === 0">
          <a-empty/>
        </div>
        <a-tabs v-else type="card" v-model:active-key="tabKey" justify :editable="true" @delete="handleDelete"
                @change="handleTabChange">
          <a-tab-pane v-for="item in codeVals" :key="item.key">
            <template #title>
              <icon-code/>
              {{ item.name }}
            </template>
            <div style="height: 100%;width: 100%;overflow:auto;">
              <MonacoEditor
                  v-model="item.value"
                  :language="language"
                  width="100%"
                  height="100%"/>
            </div>
          </a-tab-pane>
        </a-tabs>
      </template>
    </a-split>
  </div>
</template>

<script setup lang="ts">
import {h, ref, type VNode} from "vue";
import type {ApiResponse, IdeTabItem} from "@/types/global";
import MonacoEditor from "@/components/monacoEditor/index.vue";
import type {TreeNode} from "echarts/types/src/data/Tree";
import type {TreeNodeData} from "@arco-design/web-vue";
import * as diagnostics_channel from "node:diagnostics_channel";

const {fileTreeOption, loadFileApi} = defineProps<{
  fileTreeOption: { title: string, key: string, icon: () => VNode, isLeaf?: boolean }[],
  loadDir: (nodeData) => Promise<undefined>,
  loadFileApi: (nodeData) => Promise<ApiResponse<string>>,
}>()
let lastSplitSize = 240
const tabKey = ref('2024')
const splitSize = ref(240)
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
const handleTabChange = (key: string | number) => {
  const fileName: string = codeVals.value.filter(item => item.key === key)[0].name
  if (fileName.endsWith(".py")) {
    language.value = "python"
  } else if (fileName.endsWith(".js")) {
    language.value = "javascript"
  } else if (fileName.endsWith(".rs")) {
    language.value = "javascript"
  } else if (fileName.endsWith(".ts")) {
    language.value = "javascript"
  } else if (fileName.endsWith(".css")) {
    language.value = "javascript"
  } else if (fileName.endsWith(".go")) {
    language.value = "javascript"
  } else {
    language.value = "python"
  }
};
const getFileContent = async (seletcedKeys: string[], treeData: { node: TreeNodeData }) => {
  if (seletcedKeys.length === 0) return
  if (codeVals.value.filter(item => item.key === seletcedKeys[0]).length > 0) return
  const {code, data} = await loadFileApi(seletcedKeys[0])
  if (code !== 0) return
  codeVals.value.push({
    key: seletcedKeys[0],
    name: treeData.node.title as string,
    value: data
  })
  tabKey.value = seletcedKeys[0]
}
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
</style>