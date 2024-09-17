<template>
  <div>
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
        <a-select v-model="language" :options="langOptions" :style="{width:'140px'}" placeholder="选择语言" allow-search/>
      </a-tooltip>
    </a-space>
    <a-split
        class="ide-box"
        v-model:size="splitSize">
      <template #first>
        <a-tree
            :data="treeData"
            :blockNode="true"
            size="medium"
            style="margin-right: 20px;">
          <template #icon>
            <IconStar/>
          </template>
        </a-tree>
      </template>
      <template #second>
        <a-tabs type="card" v-model:active-key="tabKey" justify :editable="true" @delete="handleDelete" @change="handleTabChange">
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
import {h, ref} from "vue";
import type {IdeTabItem} from "@/types/global";
import {IconDriveFile} from "@arco-design/web-vue/es/icon";
import MonacoEditor from "@/components/monacoEditor/index.vue";

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
const codeVals = ref<IdeTabItem[]>([
  {
    key: "main",
    name: "对酒当歌人生几何.js",
    value: "const a = 1\n\nconsole.log(a)",
  },
  {
    key: "2024",
    name: "Java是世界上最好的语言.py",
    value: "import requests\n\nres = requests.get('https://www.baidu.com')\n\nprint(res.text)",
  },
])

const treeData = [
  {
    title: 'Trunk',
    key: 'node1',
    children: [
      {
        title: 'Leaf',
        key: 'node2',
      },
    ],
  },
  {
    title: 'Trunk',
    key: 'node3',
    children: [
      {
        title: 'Leaf',
        key: 'node4',
        icon: () => h(IconDriveFile),
      },
      {
        title: 'Leaf',
        key: 'node5',
        icon: () => h(IconDriveFile),
      },
      {
        title: 'Leaf',
        key: 'node6',
        icon: () => h(IconDriveFile),
      },
      {
        title: 'Leaf',
        key: 'node7',
        icon: () => h(IconDriveFile),
      },
      {
        title: 'Leaf',
        key: 'node8',
        icon: () => h(IconDriveFile),
      },
      {
        title: 'Leaf',
        key: 'node9',
        icon: () => h(IconDriveFile),
      },
    ],
  },
];

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
  height: 400px;
  margin-top: 10px;
}

:deep(.arco-tabs-content) {
  padding: 0 !important;
}
</style>