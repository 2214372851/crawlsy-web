<template>
  <a-card title="依赖管理" :header-style="{borderBottom: 'none'}">
    <div class="search-container">
      <a-space>
        <a-button
            type="primary"
            :loading="loading"
            @click="openModal('install')"
            v-permission="[
              {
                permission: 'schedulerPackage',
                method: 'POST'
              }
            ]">
          <template #icon>
            <icon-plus/>
          </template>
          添加依赖
        </a-button>
        <a-button
            :loading="loading"
            @click="openModal('update')"
            v-permission="[
              {
                permission: 'schedulerPackage',
                method: 'PUT'
              }
            ]">
          <template #icon>
            <icon-loop/>
          </template>
          更新依赖
        </a-button>
        <a-button
            status="danger"
            :loading="loading"
            @click="openModal('uninstall')"
            v-permission="[
              {
                permission: 'schedulerPackage',
                method: 'DELETE'
              }
            ]">
          <template #icon>
            <icon-delete/>
          </template>
          删除依赖
        </a-button>
      </a-space>

      <a-input-search
          :loading="loading"
          v-model="searchValue"
          :style="{width:'320px'}"
          placeholder="输入依赖名称"
          @search="searchHandle"
          search-button>
        <template #button-icon>
          <icon-search/>
        </template>
      </a-input-search>
    </div>
    <a-table
        :loading="loading"
        :pagination="false"
        :columns="columns"
        :virtual-list-props="{height:600}"
        :data="data"
        :filter-icon-align-left="true"/>
    <a-modal v-model:visible="installVisible" title="添加依赖" @before-ok="packageInstallHandle">
      <a-input v-model="installValue" placeholder="请输入依赖名称..."/>
    </a-modal>
    <a-modal v-model:visible="uninstallVisible" title="删除依赖" @before-ok="packageUninstallHandle">
      <a-input v-model="uninstallValue" placeholder="请输入依赖名称..."/>
    </a-modal>
    <a-modal v-model:visible="updateVisible" title="更新依赖" @before-ok="packageUpdateHandle">
      <a-input v-model="updateValue" placeholder="请输入依赖名称..."/>
    </a-modal>
  </a-card>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {Message, type TableColumnData} from "@arco-design/web-vue";
import useLoading from "@/hooks/loading";
import {
  schedulerPackageInstallApi,
  type SchedulerPackageItem,
  schedulerPackageListApi,
  schedulerPackageUninstallApi,
  schedulerPackageUpdateApi
} from "@/api/modules/scheduler";

const searchValue = ref('');
const installValue = ref('')
const uninstallValue = ref('')
const updateValue = ref('')


const {loading, setLoading} = useLoading()
let cacheData: SchedulerPackageItem[] = []
const columns: TableColumnData[] = [
  {
    title: '依赖名称',
    dataIndex: 'name',
    sortable: {
      sortDirections: ['ascend', 'descend']
    }
  },
  {
    title: '版本',
    dataIndex: 'version',
    sortable: {
      sortDirections: ['ascend', 'descend']
    },
  }
];
const data = ref<SchedulerPackageItem[]>([]);
const installVisible = ref(false)
const uninstallVisible = ref(false)
const updateVisible = ref(false)

const openModal = (type: 'install' | 'uninstall' | 'update') => {
  if (type === 'install') {
    installValue.value = ''
    installVisible.value = true
  } else if (type === 'uninstall') {
    uninstallValue.value = ''
    uninstallVisible.value = true
  } else if (type === 'update') {
    updateValue.value = ''
    updateVisible.value = true
  }
}
const searchHandle = async () => {
  data.value = cacheData.filter(item => item.name.includes(searchValue.value))
}
const fetchData = async () => {
  setLoading(true);
  try {
    const {code, data} = await schedulerPackageListApi()
    if (code !== 0) return
    cacheData = data?.list as SchedulerPackageItem[];
    await searchHandle()
  } catch (err) {
    console.error(err)
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}
const packageInstallHandle = async () => {
  setLoading(true);
  try {
    if (!installValue.value) {
      Message.warning({
        content: '请输入依赖名称',
        duration: 5000
      })
      return
    }
    const {code} = await schedulerPackageInstallApi(installValue.value)
    if (code !== 0) return
    Message.success({
      content: `${installValue.value} 安装成功`,
      duration: 5000
    })
    await fetchData()
  } catch (err) {
    console.error(err)
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}
const packageUninstallHandle = async () => {
  setLoading(true);
  try {
    if (!uninstallValue.value) {
      Message.warning({
        content: '请输入依赖名称',
        duration: 5000
      })
      return
    }
    const {code} = await schedulerPackageUninstallApi(uninstallValue.value)
    if (code !== 0) return
    Message.success({
      content: `${uninstallValue.value} 卸载成功`,
      duration: 5000
    })
    await fetchData()
  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false)
  }
}
const packageUpdateHandle = async () => {
  setLoading(true);
  try {
    if (!updateValue.value) {
      Message.warning({
        content: '请输入依赖名称',
        duration: 5000
      })
      return
    }
    const {code} = await schedulerPackageUpdateApi(updateValue.value)
    if (code !== 0) return
    Message.success({
      content: `${updateValue.value} 更新成功`,
      duration: 5000
    })
  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false)
  }
}
onMounted(async () => {
  await fetchData()
})
</script>

<style scoped lang="less">
.search-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}
</style>