<template>
  <div style="height: calc(100vh - 134px);">
    <ide
        :file-tree-option="fileTreeOption"
        :loadDir="loadMore"
        :load-file-api="resourceLoadApi"/>
  </div>

</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import Ide from "@/components/ide/index.vue";
import {onMounted, ref} from "vue";
import {resourceLazyLoadApi, resourceListApi, resourceLoadApi} from "@/api/modules/ide";
import {Message} from '@arco-design/web-vue';

const route = useRoute();
const fileTreeOption = ref([])
const loadMore = (nodeData) => {
  nodeData.key

  return new Promise((resolve) => {
    resourceLazyLoadApi(nodeData.key).then(res => {
      const {code, data} = res
      if (code !== 0) {
        resolve()
        return
      }
      nodeData.children = data.map(item => {
        return {
          title: item.name,
          key: item.path,
          // icon: () => item.isFile ? h(IconFile) : h(IconFolder),
          isLeaf: item.isFile
        }
      })
      resolve()
    })
  });
};
const getResourceListData = async () => {
  const resourceId = route.query?.id as string
  if (!resourceId) {
    Message.error({
      content: "未识别到资源",
      duration: 5000
    })
    return
  }
  const {code, data} = await resourceListApi(parseInt(resourceId))
  if (code !== 0) return
  const fileTree = []
  for (const item of data) {
    fileTree.push({
      title: item.name,
      key: item.path,
      // icon: () => item.isFile ? h(IconFile) : h(IconFolder),
      isLeaf: item.isFile
    })
  }
  // 目录在前
  fileTree.sort((item => item.isLeaf ? 1 : -1))
  fileTreeOption.value = fileTree
}
onMounted(async () => {
  await getResourceListData()
})
</script>

<style scoped lang="less">

</style>