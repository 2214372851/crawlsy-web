<template>
  <a-grid-item v-for="item in renderData" :key="item.id">
    <a-card>
      <a-space direction="vertical" fill>
        <a-card-meta>
          <template #title>
            <div style="display: flex;justify-content: space-between">
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
            </div>
          </template>
          <template #description>
            <a-space direction="vertical">
              <div>
                <a-tag color="blue">{{ item.nodeUid }}</a-tag>
              </div>
              <div>
                创建时间：
                <a-tag>{{ item.createTime }}</a-tag>
              </div>
              <div>
                更新时间：
                <a-tag>{{ item.updateTime }}</a-tag>
              </div>
            </a-space>
          </template>
        </a-card-meta>

        <div style="width: 100%; display: flex;justify-content: end;">
          <a-progress size="large" :percent="item.nodeLoad" status="normal" show-text/>
        </div>
        <a-space>
          <a-button
              type="primary"
              @click="emit('look', String(item.id))"
              v-permission="[
                {
                  permission: 'node-detail',
                  method: 'GET'
                }
              ]">
            查看
          </a-button>
          <a-button
              @click="emit('edit', String(item.id))"
              v-permission="[
                    {
                      permission: 'node-update',
                      method: 'PUT'
                    }
                  ]">
            编辑
          </a-button>
          <a-popconfirm
              content="确认删除吗?"
              type="warning"
              @ok="emit('delete', String(item.id))">
            <a-button
                status="danger"
                v-permission="[
                  {
                    permission: 'node-delete',
                    method: 'DELETE'
                  }
                ]">
              删除
            </a-button>
          </a-popconfirm>
        </a-space>
      </a-space>
    </a-card>
  </a-grid-item>
</template>

<script setup lang="ts">

import type {NodeItem} from "@/api/modules/node";


defineProps<{ renderData: NodeItem[] }>()
const emit = defineEmits<{
  (e: 'edit', id: string): void,
  (e: 'look', id: string): void,
  (e: 'delete', id: string): void,
}>()
</script>

<style scoped lang="less">

</style>