<template>
    <a-form ref="formRef" size="medium" auto-label-width>
        <a-grid :cols="3" :colGap="16" :rowGap="16" :collapsed="collapsed">
            <a-grid-item v-for="(item, index) in searchOptions" :key="index">
                <a-form-item :field="item.field" :label="item.label">
                    <a-input
                        v-if="item.type === 'input'"
                        v-model="formValue.name"
                        :placeholder="`请输入${item.label}`"/>
                    <a-select
                        v-else-if="item.type === 'select'"
                        v-model="formValue.name"
                        :placeholder="`请选择${item.label}`"
                        :options="item.options ?? []"
                        :multiple="item.multiple ?? false"
                        scrollbar/>
                    <a-range-picker
                        v-else-if="item.type === 'dateRang'"
                        showTime
                        :time-picker-props="{ defaultValue:['00:00:00','00:00:00'] }"
                        v-model="formValue.name"
                    />
                </a-form-item>
            </a-grid-item>
        </a-grid>
        <a-form-item>
            <div style="margin-left: auto"/>
            <a-space>
                <a-button type="primary">
                    <template #icon>
                        <icon-search />
                    </template>
                    搜索
                </a-button>
                <a-button>
                    <template #icon>
                        <icon-refresh />
                    </template>
                    重置
                </a-button>
            </a-space>
        </a-form-item>
    </a-form>

</template>

<script setup lang="ts">
import {type Ref, ref} from "vue";
import type {SearchOption} from "@/views/node/types";
// collapsed 默认值 false
withDefaults(defineProps<{ collapsed?: boolean }>(), {collapsed: false})
const formRef = ref()
const searchOptions: Ref<SearchOption[]> = ref([
    {
        label: '用户名',
        type: 'input',
        field: 'name',
    },
    {
        label: '用户名',
        type: 'input',
        field: 'name',
    },
    {
        label: '密码',
        type: 'select',
        multiple: true,
        field: 'name',
        options: [
            {label: '选项1', value: '1'},
            {label: '选项2', value: '2'},
        ],
    },
    {
        label: '日期范围',
        type: 'dateRang',
        field: 'name',
    },
])
const formValue = ref({
    name: ''
})
</script>

<style scoped lang="less">

</style>