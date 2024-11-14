<template>
  <a-card
      :bordered="true"
      :style="{ width: '100%' }">
    <div class="arco-card-header-title">
      角色管理
    </div>
    <a-divider/>
    <div class="toolbar">
      <a-button type="primary" @click="addStartHandle">
        <template #icon>
          <icon-plus/>
        </template>
        新建
      </a-button>
      <a-input-search
          style="width: 240px;"
          placeholder="请输入角色名称..."
          v-model="formValue.name"
          :loading="loading"
          @search="fetchData"
          @clear="reset"
          allow-clear/>
    </div>
    <a-space direction="vertical" style="width: 100%;">
      <a-spin style="width: 100%" :loading="loading">
        <a-empty v-if="renderData.length == 0"/>
        <div v-else>
          <a-collapse accordion>
            <a-collapse-item :header="item.name" :key="item.id" v-for="item in renderData">
              <a-space style="justify-content: space-between;display: flex">
                <a-descriptions :column="1">
                  <a-descriptions-item label="角色名称">
                    {{ item.name }}
                  </a-descriptions-item>
                  <a-descriptions-item label="创建时间">
                    <a-tag color="blue">{{ item.createTime }}</a-tag>
                  </a-descriptions-item>
                  <a-descriptions-item label="修改时间">
                    <a-tag color="blue">{{ item.updateTime }}</a-tag>
                  </a-descriptions-item>
                </a-descriptions>
                <a-space direction="vertical">
                  <a-button type="primary" @click="editStartHandle(item.id)">修改</a-button>
                  <a-popconfirm content="确认删除吗?" type="warning" @ok="deleteHandle(item.id)">
                    <a-button type="primary" status="danger">
                      删除
                    </a-button>
                  </a-popconfirm>
                </a-space>
              </a-space>
            </a-collapse-item>
          </a-collapse>
        </div>
      </a-spin>
      <a-modal
          width="600px"
          v-model:visible="editVisible"
          @cancel="editHandleCancel"
          :on-before-ok="editHandleBeforeOk" unmountOnClose>
        <template #title>
          角色编辑
        </template>
        <a-form layout="vertical" ref="editFormRef" :model="editFormValue">
          <a-form-item field="name" label="角色名称">
            <a-input v-model="editFormValue.name" placeholder="请输入角色名称"/>
          </a-form-item>
          <a-form-item field="permissions" label="权限列表">
            <a-transfer style="width: 100%;" :data="permissionOption"
                        v-model="editFormValue.permissions">
              <template #source-title="{ checked, indeterminate, onSelectAllChange }">
                <a-space>
                  <a-checkbox
                      :model-value="checked"
                      :indeterminate="indeterminate"
                      @change="onSelectAllChange"
                  />
                  <span>权限列表</span>
                </a-space>
              </template>
              <template #target-title="{ checked, indeterminate, onSelectAllChange, countTotal, onClear }">
                <a-space>
                  <a-checkbox
                      :model-value="checked"
                      :indeterminate="indeterminate"
                      @change="onSelectAllChange"
                  />
                  <span>已选 {{ countTotal }} 项权限</span>
                </a-space>
                <IconDelete @click="onClear"/>


              </template>
            </a-transfer>
          </a-form-item>
        </a-form>
      </a-modal>
      <a-modal
          width="600px"
          v-model:visible="addVisible"
          @cancel="addHandleCancel"
          :on-before-ok="addHandleBeforeOk" unmountOnClose>
        <template #title>
          角色添加
        </template>
        <a-form layout="vertical" ref="addFormRef" :model="addFormValue">
          <a-form-item field="name" label="角色名称">
            <a-input v-model="addFormValue.name" placeholder="请输入角色名称"/>
          </a-form-item>
          <a-form-item field="permissions" label="权限列表">
            <a-transfer style="width: 100%;" :data="permissionOption"
                        v-model="addFormValue.permissions">
              <template #source-title="{ checked, indeterminate, onSelectAllChange }">
                <a-space>
                  <a-checkbox
                      :model-value="checked"
                      :indeterminate="indeterminate"
                      @change="onSelectAllChange"
                  />
                  <span>权限列表</span>
                </a-space>
              </template>
              <template #target-title="{ checked, indeterminate, onSelectAllChange, countTotal, onClear }">
                <a-space>
                  <a-checkbox
                      :model-value="checked"
                      :indeterminate="indeterminate"
                      @change="onSelectAllChange"
                  />
                  <span>已选 {{ countTotal }} 项权限</span>
                </a-space>
                <IconDelete @click="onClear"/>
              </template>
            </a-transfer>
          </a-form-item>
        </a-form>
      </a-modal>
      <div style="display:flex;justify-content: end;">
        <a-pagination
            size="mini"
            simple v-model:current="pagination.current"
            v-model:pageSize="pagination.pageSize"
            v-model:page-size-options="pagination.pageSizeOptions as number[]"
            v-model:total="pagination.total as number"
            @change="handleChangePage"
            @page-size-change="handleChangePageSize"
            show-page-size/>
      </div>
    </a-space>
  </a-card>
</template>

<script setup lang="ts">
import {onMounted, type Ref, ref, useTemplateRef} from "vue";
import useLoading from "@/hooks/loading";
import {
  roleAddApi,
  type RoleAddEditData,
  roleDelApi,
  roleInfoApi,
  type RoleItem,
  roleListApi,
  roleUpdateApi
} from "@/api/modules/role";
import {Message, type PaginationProps} from "@arco-design/web-vue";
import type {AnyObject, ApiListResponse, menuOptionData} from "@/types/global";
import {permissionOptionApi} from "@/api/modules/permission";


const {loading, setLoading} = useLoading()
const formValue = ref({
  name: '',
})
const editFormRef = useTemplateRef<any>('editFormRef')
const editVisible = ref(false)
const addFormRef = useTemplateRef<any>('addFormRef')
const addVisible = ref(false)
const editItemKey = ref<number>()
const renderData = ref<RoleItem[]>([])
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
const permissionOption = ref<any[]>([])
const editFormValue = ref<RoleAddEditData>({
  name: '',
  permissions: []
})
const addFormValue = ref<RoleAddEditData>({
  name: '',
  permissions: []
})
const editStartHandle = async (id: number) => {
  const {code, data} = await roleInfoApi(id)
  if (code !== 0) return
  editItemKey.value = id;
  editFormValue.value = data as any;
  editVisible.value = true;
}
const editHandleBeforeOk = async () => {
  try {
    const {code, data} = await roleUpdateApi(editItemKey.value?.toString() as string, editFormValue.value)
    if (code === 3) {
      const fieldsValid: AnyObject = {}
      for (const key in data) {
        fieldsValid[key] = {
          status: 'error',
          message: (data as any)[key][0]
        }
      }
      editFormRef.value.setFields(fieldsValid)
    }
    if (code !== 0) return false
    editFormValue.value = {
      name: '',
      permissions: []
    }
    Message.success({
      content: "修改成功",
      duration: 5000
    })
    return true;
  } catch (e) {
    return false;
  }
}
const editHandleCancel = () => {
  editFormValue.value = {
    name: '',
    permissions: []
  }
  editVisible.value = false
}
const addStartHandle = async () => {
  addVisible.value = true
}
const addHandleBeforeOk = async () => {
  try {
    const {code, data} = await roleAddApi(addFormValue.value)
    if (code === 3) {
      const fieldsValid: AnyObject = {}
      for (const key in data as any) {
        fieldsValid[key] = {
          status: 'error',
          message: (data as any)[key][0]
        }
      }
      addFormRef.value.setFields(fieldsValid)
    }
    if (code !== 0) return false
    addFormValue.value = {
      name: '',
      permissions: []
    }
    await fetchData(pagination.value)
    Message.success({
      content: "添加成功",
      duration: 5000
    })
    return true;
  } catch (e) {
    return false;
  }
}
const addHandleCancel = () => {
  addFormValue.value = {
    name: '',
    permissions: []
  }
  addVisible.value = false
}
const handleChangePageSize = (pageSize: number) => {
  const lastSize = pagination.value.pageSize as number
  pagination.value.pageSize = pageSize
  if (pagination.value.current === 1 && lastSize < pageSize) {
    fetchData(pagination.value)
  }
}
const handleChangePage = (current: number) => {
  pagination.value.current = current
  fetchData({...pagination.value, current})
}
const getPermissionOption = async () => {
  const {data, code} = await permissionOptionApi()
  if (code === 0) {
    permissionOption.value = (data as ApiListResponse<menuOptionData>).list.map((item: any) => ({
      value: item.id,
      label: item.name
    }))
  }
}
const reset = async () => {
  formValue.value = {
    name: ''
  }
  await fetchData(pagination.value)
}
const fetchData = async (params: any = basePagination) => {
  setLoading(true);
  try {
    const {current, pageSize} = params
    const {code, data} = await roleListApi({...formValue.value, page: current, pageSize})
    if (code !== 0) return
    renderData.value = data.list;
    pagination.value.current = params.current;
    pagination.value.total = data?.total;
  } catch (err) {
    console.error(err)
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}
const deleteHandle = async (id: number) => {
  try {
    const {code} = await roleDelApi(id)
    if (code !== 0) return
    await fetchData(pagination.value)
    Message.success({
      content: "删除成功",
      duration: 5000
    })
  } catch (e) {
    console.error(e)
  }
}
onMounted(async () => {
  await fetchData()
  await getPermissionOption()
})
</script>

<style scoped lang="less">
:deep(.arco-collapse-item-content) {
  padding-left: 12px !important;
  padding-right: 12px !important;
}

:deep(.arco-transfer-view) {
  width: 50%;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}
</style>