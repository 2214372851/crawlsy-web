<template>
  <a-list-item v-for="item in renderData" :key="item.id" action-layout="vertical">
    <a-list-item-meta>
      <template #title>
        <a-space style="margin-bottom: 6px;">
          <span>{{ item.name }}</span>
          <a-tag color="green" v-if="item.status">
            <template #icon>
              <icon-check-circle-fill/>
            </template>
            运行中
          </a-tag>
          <a-tag color="red" v-else>
            <template #icon>
              <icon-close-circle-fill/>
            </template>
            异常
          </a-tag>
        </a-space>
      </template>
      <template #description>
        <a-space direction="vertical">
          <div>更新时间：
            <a-tag>{{ item.updateTime }}</a-tag>
          </div>
          <div>创建时间：
            <a-tag>{{ item.createTime }}</a-tag>
          </div>
          <div>节点标识：
            <a-tag color="blue">{{ item.nodeUid }}</a-tag>
          </div>
        </a-space>
      </template>
    </a-list-item-meta>
    <template #extra>
      <div style="height: 100%;display: flex;align-items: center;">
        <a-progress
            size="large"
            type="circle"
            :percent="item.nodeLoad"
            :status="status(item)"
            show-text/>
      </div>
    </template>
    <template #actions>
      <icon-search @click="emit('look', String(item.id))"/>
      <icon-edit @click="emit('edit', String(item.id))"/>
      <a-popconfirm content="确认删除吗?" type="warning" @ok="emit('delete', String(item.id))">
        <icon-delete/>
      </a-popconfirm>
    </template>
  </a-list-item>
</template>

<script setup lang="ts">
import type {NodeItem} from "@/api/modules/node";


const props = defineProps<{ renderData: NodeItem[] }>()
const emit = defineEmits<{
  (e: 'edit', id: string): void,
  (e: 'look', id: string): void,
  (e: 'delete', id: string): void,
}>()
const status = (item: NodeItem) => {
  if (item.nodeLoad > 0.8) {
    return 'danger'
  } else if (item.nodeLoad > 0.6) {
    return 'warning'
  } else {
    return 'normal'
  }
}
</script>

<style scoped lang="less">

</style>