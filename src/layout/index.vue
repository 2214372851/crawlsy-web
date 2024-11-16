<template>
  <a-layout class="layout">
    <a-layout-header class="layout-header">
      <a-page-header :show-back="false">
        <template #title>
          <a-space>
            <img src="/public/icon.svg" alt="Spider" style="height: 32px">
            <img src="/public/icon-text.svg" alt="Manage" style="height: 32px" class="media-hide">
          </a-space>
        </template>
        <template #subtitle>
          <a-breadcrumb :routes="breadcrumbs" class="media-hide">
            <template #item-render="item">
              <a-link>
                {{ item.route.label }}
              </a-link>
            </template>
          </a-breadcrumb>
        </template>
        <template #extra>
          <a-space size="medium">
            <a-tooltip content="搜索">
              <a-button @click="()=>{console.log('hello')}">
                <template #icon>
                  <icon-search/>
                </template>
              </a-button>
            </a-tooltip>
            <a-tooltip content="全屏">
              <a-button @click="handleFullScreen">
                <template #icon>
                  <icon-fullscreen v-if="!fullscreen"/>
                  <icon-fullscreen-exit v-else/>
                </template>
              </a-button>
            </a-tooltip>
            <a-dropdown @select="handleSelectTheme" trigger="hover">
              <a-button @click="switchTheme">
                <template #icon>
                  <icon-sun-fill v-if="appStore.theme === 'light'"/>
                  <icon-moon-fill v-else-if="appStore.theme === 'dark'"/>
                  <icon-desktop v-else/>
                </template>
              </a-button>
              <template #content>
                <a-doption
                    v-for="item in themeOptions"
                    :value="item.value"
                    :key="item.value">
                  {{ item.label }}
                </a-doption>
              </template>
            </a-dropdown>

            <a-dropdown @select="handleSelectProfile" trigger="hover">
              <a-avatar :image-url="getUserAvatar()">
              </a-avatar>
              <template #content>
                <a-doption value="avatar">
                  <template #icon>
                    <icon-image />
                  </template>
                  修改头像
                </a-doption>
                <a-doption value="profile">
                  <template #icon>
                    <icon-idcard/>
                  </template>
                  个人信息
                </a-doption>
                <a-dgroup title="操作">
                  <a-doption value="logout">
                    <template #icon>
                      <icon-export/>
                    </template>
                    退出登录
                  </a-doption>
                </a-dgroup>
              </template>
            </a-dropdown>
          </a-space>
        </template>
      </a-page-header>
    </a-layout-header>

    <a-layout>
      <a-layout-sider
          hide-trigger
          collapsible
          :collapsed="collapsed">
        <Menu @collapse="onCollapse"/>
      </a-layout-sider>

      <a-layout>
        <a-scrollbar style="overflow: auto;height: calc(100vh - 55px);width: 100%;">
          <a-layout-content style="padding: 24px;">
            <PageLayout/>
          </a-layout-content>

        </a-scrollbar>

      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import {useRoute, useRouter} from "vue-router";
import Menu from "@/components/menu/index.vue"
import type {BreadcrumbItem} from "@/types/global";
import useAppStore from "@/stores/modules/app";
import useUserStore from "@/stores/modules/user";
import PageLayout from "@/layout/page-layout.vue";
import {md5} from "@/utils/crypt";

const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()
const router = useRouter()
const fullscreen = ref(false)
const collapsed = ref(window.innerWidth < 1200)
const themeOptions = [
  {
    label: '亮色主题',
    value: 'light'
  },
  {
    label: '暗色主题',
    value: 'dark'
  },
  {
    label: '跟随系统',
    value: 'auto'
  }
]
document.addEventListener('resize', () => {
  collapsed.value = window.innerWidth < 1200
})
const breadcrumbs = computed(() => {
  let paths = route.path.split('/')
  let crumbList: BreadcrumbItem[] = []
  for (let i = 0; i < paths.length; i++) {
    crumbList.push({label: paths[i], path: paths[i]});
  }
  return crumbList
})
const onCollapse = (value: boolean) => {
  collapsed.value = value
}
const getUserAvatar = () => {
  const avatar: string = userStore.email
  return `https://cravatar.cn/avatar/${md5(avatar.toLowerCase().trim())}?`
}
const handleFullScreen = () => {
  let element = document.documentElement
  if (fullscreen.value) {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else {
      alert('浏览器不支持')
    }
  } else {
    if (element.requestFullscreen) {
      element.requestFullscreen()
    }
  }
  fullscreen.value = !fullscreen.value

}
const handleSelectTheme = (val: string | number | Record<string, any> | undefined) => {
  appStore.theme = val as string
  appStore.toggleTheme()
}
const switchTheme = () => {
  if (appStore.theme === 'auto') {
    appStore.theme = 'light'
  } else if (appStore.theme === 'dark') {
    appStore.theme = 'light'
  } else {
    appStore.theme = 'dark'
  }
  appStore.toggleTheme()
}
const handleSelectProfile = (val: string | number | Record<string, any> | undefined) => {
  switch (val) {
    case 'avatar':
        window.open('https://cravatar.cn/avatars')
      break
    case 'logout':
      userStore.logout()
      break
    case 'profile':
        router.push({path: '/profile'})
      break

  }
}
</script>

<script lang="ts">
export default {
  name: "Layout"
}
</script>

<style lang="less" scoped>
.layout {
  height: 100vh;

  .layout-header {
    padding-left: 20px;
    border-bottom: 1px solid var(--color-border)
  }

  :deep(.arco-layout-header) {
    padding-left: 0 !important;
  }

  :deep(.arco-page-header) {
    padding: 7px 0 !important;
  }
}

//手机端和平板段
@media screen and (max-width: 630px) {
  .media-hide {
    display: none;
  }
}
</style>