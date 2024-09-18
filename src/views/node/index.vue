<template>
  <a-card id="show" :bordered="false" :style="{ width: '100%' }" title="节点管理">
    <a-space direction="vertical" size="medium" style="width: 100%">
      <a-grid :cols="{ xs: 1, sm: 4, md: 4, lg: 4, xl: 4, xxl: 4 }" :colGap="16" :rowGap="16" style="">
        <a-grid-item :span="2">
          <a-tabs type="rounded" @change="handleTabChange" style="height: 32px;width: 100%">
            <a-tab-pane key="all" title="全部"/>
            <a-tab-pane key="run" title="运行中"/>
            <a-tab-pane key="stop" title="不可用"/>
          </a-tabs>
        </a-grid-item>
        <a-grid-item suffix>
          <a-space>
            <a-tooltip content="切换布局">
              <a-button @click="isList = !isList">
                <template #icon>
                  <icon-list v-if="isList"/>
                  <icon-apps v-else/>
                </template>
              </a-button>
            </a-tooltip>
            <a-input-search placeholder="搜索" style="margin-left: auto"/>
          </a-space>

        </a-grid-item>

      </a-grid>
      <a-grid v-if="!isList" :cols="{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }" :colGap="16" :rowGap="16">
        <a-grid-item v-for="index in count" :key="index">
          <a-card>
            <a-space direction="vertical" fill>
              <a-card-meta>
                <template #title>
                  <div style="display: flex;justify-content: space-between">
                    <span>{{ `node ${index}` }}</span>
                    <a-tag color="green">
                      <template #icon>
                        <icon-check-circle-fill/>
                      </template>
                      运行中
                    </a-tag>
                  </div>
                </template>
                <template #description>
                  2021-10-12 00:00:00
                </template>
              </a-card-meta>

              <a-typography-paragraph type="secondary">
                快速诊断用户人群，地域细分情况，了解数据分布的集中度，以及主要的数据分布的区间段是什么。
              </a-typography-paragraph>
              <a-space style="">
                <a-button type="primary">查看</a-button>
                <a-button type="primary">编辑</a-button>
              </a-space>
            </a-space>

          </a-card>
        </a-grid-item>
      </a-grid>
      <a-list v-else>
        <a-list-item v-for="idx in count" :key="idx" action-layout="vertical">
          <a-list-item-meta
              :title="`Node ${idx}`"
              description="2021-10-12 00:00:00"
          >
            <template #avatar>
              <a-tag color="green">
                <template #icon>
                  <icon-check-circle-fill/>
                </template>
                运行中
              </a-tag>
            </template>
          </a-list-item-meta>
          <template #extra>
            <div>
              <img style="height: 80px" alt="arco-design"
                   src="//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"/>
            </div>
          </template>
          <template #actions>
            <icon-edit/>
            <icon-delete/>
          </template>
        </a-list-item>
      </a-list>
      <div style="display:flex;justify-content: end;">
        <a-pagination
            simple
            v-model:current="paginationVal.current"
            v-model:pageSize="paginationVal.pageSize"
            v-model:total="paginationVal.total"
            show-page-size/>
      </div>
    </a-space>
  </a-card>
</template>

<script setup lang="ts">

import {reactive, ref} from "vue";

const paginationVal = reactive({
  current: 1,
  pageSize: 10,
  total: 100
});
const isList = ref(true);
const count = ref(10);

const handleTabChange = (key: string | number) => {
  console.log(key);
};
</script>

<style scoped lang="less">
.wrapper {
  position: relative;
  width: 100%;
  height: 100%;

  #show {
    overflow-y: auto;
  }
}
</style>