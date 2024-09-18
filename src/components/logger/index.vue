<template>
    <a-card title="日志查看器">
        <div style="height: 100%;width: 100%;overflow:auto;background: #282C34">
<!--        <CodeMirror-->
<!--                class="code-cursor"-->
<!--                v-model="logVal"-->
<!--                style="height: 300px;overflow-y: auto"-->
<!--                :extensions="extensions"/>-->
        </div>
    </a-card>
</template>

<script setup lang="ts">


// const show= shallowRef()
// onMounted(()=>{
//     console.log(show.value)
// })

</script>

<script lang="ts">
export default {
    name: "Logger"
}
</script>

<style scoped lang="less">
.code-cursor {
    cursor: text;
    height: 100%;
}
</style>