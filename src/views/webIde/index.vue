<template>
  <div style="height: calc(100vh - 134px);">
    <ide
        :file-tree-option="fileTreeOption"
        :loadDir="loadMore"
        :load-file-api="resourceLoadApi"
        @save-change="saveResourceData"
        @rename-change="renameResource"
        @del-change="delResource"
        @add-change="addResource"/>
    <a-modal v-model:visible="visible" title="资源" @cancel="handleCancel" @before-ok="handleBeforeOk">
      <a-input v-model="form.name"/>
    </a-modal>
  </div>

</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import Ide from "@/components/ide/index.vue";
import {onMounted, ref} from "vue";
import {
  resourceCreateApi,
  type resourceData, resourceDeleteApi,
  resourceLazyLoadApi,
  resourceListApi,
  resourceLoadApi, resourceRenameApi,
  resourceWriteApi
} from "@/api/modules/ide";
import {Message, type TreeNodeData} from '@arco-design/web-vue';


const form = ref({
  name: '',
  path: '',
  isRename: true
})
const visible = ref(false)
const route = useRoute();
const fileTreeOption = ref<TreeNodeData[]>([])
const handleCancel = () => {
  visible.value = false;
}
const handleBeforeOk = async () => {
  try {
    const {path, name, isRename} = form.value
    const {code, data} = isRename ? await resourceRenameApi(path, name) : await resourceCreateApi(path, name)
    if (code !== 0) return false
    Message.success({
      content: isRename ? "修改成功" : "创建成功",
      duration: 5000
    })
    if (isRename) {
      fileTreeOption.value = updateTreeOption(fileTreeOption.value, path, 'rename', data)
    } else {
      fileTreeOption.value = updateTreeOption(fileTreeOption.value, path, 'add', data)
    }
    form.value = {
      name: '',
      path: '',
      isRename: true
    }
    return true
  } catch (e) {
    console.error(e)
    return false
  }

}
const loadMore = (nodeData: TreeNodeData) => {
  return new Promise((resolve) => {
    resourceLazyLoadApi(nodeData.key as string).then(res => {
      const {code, data} = res
      if (code !== 0) {
        return resolve(undefined)
      }
      nodeData.children = data as resourceData[]
      nodeData.children.sort((item => item.isLeaf ? 1 : -1))
      return resolve(undefined)
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
  const fileTree = data as resourceData[]
  fileTree.sort((item => item.isLeaf ? 1 : -1))
  fileTreeOption.value = fileTree
}
const saveResourceData = async (key: string, content: string) => {
  const {code} = await resourceWriteApi(key, content)
  if (code !== 0) return
  Message.success({
    content: "保存成功",
    duration: 5000
  })
}
const updateTreeOption = (treeNode: TreeNodeData[], key: string, type: string, apiNode: TreeNodeData | undefined = undefined): TreeNodeData[] => {
  const newTreeNode = []
  for (let index = 0; index < treeNode.length; index++) {
    const node = treeNode[index]
    if (!node) continue
    let newNode = {...node}
    if (node?.key === key) {
      if (type === 'del') {
        continue
      } else if (type === 'rename') {
        newNode = apiNode as TreeNodeData
        continue
      } else if (type === 'add') {
        if (!newNode.children) {
          newNode.children = []
        }
        newNode.children?.push(apiNode as TreeNodeData)
        newNode.children?.sort((item => item.isLeaf ? 1 : -1))
      }
    }
    if (node.children) {
      newNode.children = updateTreeOption(node.children, key, type, apiNode)
    }
    newTreeNode.push(newNode)
  }
  return newTreeNode
}
const delResource = async (key: string) => {
  const {code} = await resourceDeleteApi(key)
  if (code !== 0) return
  fileTreeOption.value = updateTreeOption(fileTreeOption.value, key, 'del')
  Message.success({
    content: "删除成功",
    duration: 5000
  })
}
const addResource = async (key: string) => {
  form.value.path = key
  form.value.isRename = false
  visible.value = true
}
const renameResource = async (key: string) => {
  form.value.path = key
  form.value.isRename = true
  visible.value = true
}
onMounted(async () => {
  await getResourceListData()
})
</script>

<style scoped lang="less">

</style>