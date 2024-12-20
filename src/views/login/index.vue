<template>
  <a-layout>
    <a-layout-sider style="height: 100vh; max-width: 400px; width: 30%" class="media-hide">
      <div class="banner">
        <div class="banner-title">
          Crawlsy
        </div>
        <div class="banner-sub-title">
                    <span class="banner-sub-title-item">
                        分布式爬虫管理平台
                    </span>
        </div>
        <img src="../../assets/svg/login.svg" alt="banner-image" class="banner-image">
      </div>
    </a-layout-sider>
    <a-layout style="height: 100vh">
      <a-layout-content>
        <div class="content">
          <div class="login-from-box">
            <div class="login-from-title">
              Crawlsy
            </div>
            <div class="login-from-sub-title">
              Login Crawlsy
            </div>
            <div class="login-from-error-msg">
              {{ errorMsg }}
            </div>
            <a-form :model="form" @submit="handleSubmit">
              <a-form-item field="name" :hide-label="true">
                <a-input
                    v-model="form.email"
                    placeholder="请输入您的邮箱">
                  <template #prefix>
                    <icon-email/>
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item field="post" :hide-label="true">
                <a-input-password
                    v-model:visibility="visibility"
                    placeholder="请输入您的密码"
                    :defaultVisibility="true"
                    allow-clear
                    v-model="form.password">
                  <template #prefix>
                    <icon-lock/>
                  </template>
                </a-input-password>
              </a-form-item>
              <a-form-item field="isSave" :hide-label="true">
                <a-checkbox v-model="form.isSave">记住密码</a-checkbox>
              </a-form-item>
              <a-form-item :hide-label="true">
                <a-button type="primary" html-type="submit" long>Submit</a-button>
              </a-form-item>
            </a-form>
          </div>
        </div>
      </a-layout-content>
      <a-layout-footer>
        <a-typography-text type="secondary">
          Crawlsy By 2024
        </a-typography-text>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {decrypt, encrypt} from "@/utils/crypt";
import type {LoginResponse} from "@/api/modules/login";
import {loginApi} from "@/api/modules/login";
import useUserStore from "@/stores/modules/user";
import router from "@/router";
import {Message} from "@arco-design/web-vue";

const form = reactive({
  email: '',
  password: '',
  isSave: false,
})
const visibility = ref(true)
const errorMsg = ref('')
const userStore = useUserStore()
const initUserInfo = () => {
  if (userStore.accessToken) {
    router.push('/')
  }
  const email = window.localStorage.getItem('email') || ''
  const password = window.localStorage.getItem('password') || ''
  if (password && email) {
    form.password = decrypt(password)
    form.email = email
    form.isSave = true
  }
}
onMounted(() => {
  initUserInfo()
})
const handleSubmit = async () => {
  if (form.isSave) {
    window.localStorage.setItem('email', form.email)
    window.localStorage.setItem('password', encrypt(form.password))
  } else {
    window.localStorage.removeItem('email')
    window.localStorage.removeItem('password')
  }
  const {email, password} = form
  const {code, data} = await loginApi({email, password})
  if (code !== 0) return
  userStore.setUserInfo(data as LoginResponse)
  Message.success({
    content: '登录成功',
    duration: 5000
  })
  router.push('/dashboard')
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-from-box {
    width: 320px;

    .login-from-title {
      color: var(--color-text-1);
      font-size: 24px;
      font-weight: 500;
      line-height: 32px;
    }

    .login-from-sub-title {
      color: var(--color-text-3);
      font-size: 16px;
      line-height: 24px;
    }

    .login-from-error-msg {
      color: rgb(var(--red-6));
      height: 32px;
      line-height: 32px;
    }
  }
}

@keyframes banner-animation {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.banner {
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;

  .banner-title {
    font-size: 20px;
    line-height: 28px;
    font-weight: 500;
    color: rgb(247, 248, 250);
  }

  .banner-sub-title {
    margin-top: 8px;

    .banner-sub-title-item {
      font-size: 14px;
      line-height: 22px;
      color: var(--color-neutral-6);
      border-bottom: 1.6px dotted rgb(51, 153, 255);
    }
  }

  .banner-image {
    opacity: 0;
    animation: banner-animation 1s linear 1s 1 forwards;
  }
}


:deep(.arco-layout-footer) {
  text-align: center;
  margin-bottom: 5px;
}

:deep(.arco-layout-sider) {
  background: linear-gradient(163.85deg, #1d2129, #00308f);
}

@media screen and (max-width: 630px) {
  .media-hide {
    display: none;
  }
}
</style>