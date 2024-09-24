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

      <a-spin style="width: 100%" :loading="loading">
        <a-empty v-if="renderData.length == 0"/>
        <div v-else>
          <a-grid v-if="!isList" :cols="{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }" :colGap="16" :rowGap="16">
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
                          <a-tag color="arcoblue">{{ item.nodeUid }}</a-tag>
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

                  <a-progress size="large" type="circle" :percent="0.4" show-text/>
                  <a-space style="">
                    <a-button type="primary">查看</a-button>
                    <a-button type="primary">编辑</a-button>
                  </a-space>
                </a-space>

              </a-card>
            </a-grid-item>
          </a-grid>
          <a-list :loading="loading" v-else>
            <a-list-item v-for="item in renderData" :key="item.id" action-layout="vertical">
              <a-list-item-meta>
                <template #title>
                  <a-space>
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
                  更新时间：{{ item.updateTime }}
                  <br>
                  创建时间：{{ item.createTime }}
                  <br>
                  节点标识：
                  <a-tag>{{ item.nodeUid }}</a-tag>

                </template>
              </a-list-item-meta>
              <template #extra>
                <a-progress size="large" type="circle" :percent="0.4" show-text/>
              </template>
              <template #actions>
                <icon-edit/>
                <icon-delete/>
              </template>
            </a-list-item>
          </a-list>
        </div>
      </a-spin>
      <div style="display:flex;justify-content: end;">
        <a-pagination
            simple
            v-model:current="pagination.current"
            v-model:pageSize="pagination.pageSize"
            v-model:total="pagination.total as number"
            show-page-size/>
      </div>
    </a-space>
  </a-card>
</template>

<script setup lang="ts">

import {onMounted, type Ref, ref} from "vue";
import useLoading from "@/hooks/loading";
import {type NodeItem, nodeListApi} from "@/api/modules/node";
import type {PaginationProps} from "@arco-design/web-vue";

const basePagination = {
  current: 1,
  pageSize: 5
}
const pagination: Ref<PaginationProps> = ref({
  showPageSize: true,
  pageSizeOptions: [5, 10, 15],
  size: 'mini',
  total: 0,
  ...basePagination
})
const formValue = ref({})
const renderData = ref<NodeItem[]>([])
const isList = ref(true);
const count = ref(10);

const {loading, setLoading} = useLoading();
const handleTabChange = async (key: string | number) => {
  switch (key) {
    case 'all':
      delete formValue.value.status
      break
    case 'run':
      formValue.value.status = true
      break
    case 'stop':
      formValue.value.status = false
      break
  }
  await fetchData(pagination.value)
};
const fetchData = async (params: any = basePagination) => {
  setLoading(true);
  try {
    const {current, pageSize} = params
    const res = await nodeListApi({...formValue.value, page: current, pageSize})
    if (!res.data) return
    renderData.value = res.data.list;
    pagination.value.current = params.current;
    pagination.value.total = res.data?.total;
  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false)
  }
}
onMounted(async () => await fetchData(pagination.value))
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