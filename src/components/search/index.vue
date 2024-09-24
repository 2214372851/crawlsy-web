<template>
  <a-form size="medium" auto-label-width :model="formVal">
    <a-grid :cols="{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3}" :colGap="16" :rowGap="16" :collapsed="collapsed">
      <a-grid-item v-for="(item, index) in searchOptions" :key="index" :span="1">
        <a-form-item :field="item.field" :label="item.label">
          <a-input
              v-if="item.type === 'input'"
              v-model="formVal[item.field]"
              :placeholder="`请输入${item.label}`"/>
          <a-select
              v-else-if="item.type === 'select'"
              v-model="formVal[item.field]"
              :placeholder="`请选择${item.label}`"
              :options="item.options ?? []"
              :multiple="item.multiple ?? false"
              scrollbar/>
          <a-range-picker
              v-else-if="item.type === 'dateRang'"
              showTime
              :time-picker-props="{ defaultValue:['00:00:00','00:00:00'] }"
              v-model="formVal[item.field]"
          />
        </a-form-item>
      </a-grid-item>
    </a-grid>
    <a-form-item>
      <div style="margin-left: auto"/>
      <a-space>
        <a-button type="primary" @click="submit" :loading="loading">
          <template #icon>
            <icon-search/>
          </template>
          搜索
        </a-button>
        <a-button @click="reset" :loading="loading">
          <template #icon>
            <icon-refresh/>
          </template>
          重置
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import type {SearchOption} from "@/types/global";

const emit = defineEmits(['submit', 'reset'])
const {collapsed = false, searchOptions} = defineProps<{ collapsed: boolean,loading: boolean, searchOptions: SearchOption[] }>()
type ExtractFields<T extends SearchOption[]> = T[number]['field'];
type FieldValues = ExtractFields<typeof searchOptions>;
type SearchFormData = {
  [K in FieldValues]: any;
};
const formVal: SearchFormData = defineModel<SearchFormData>()
const submit = () => {
  emit('submit', formVal)
}
const reset = () => {
  emit('reset')
  formVal.value = {}
}
</script>

<script lang="ts">
export default {
  name: "Search"
}
</script>

<style scoped lang="less">

</style>