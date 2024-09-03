<script setup lang="ts">
import {RouterView} from 'vue-router'
import {onMounted} from "vue";
import useAppStore from "@/stores/modules/app";

const appStore = useAppStore()
onMounted(() => {
    appStore.toggleTheme()
})
</script>

<template>
    <RouterView></RouterView>
</template>

<style scoped>
</style>
