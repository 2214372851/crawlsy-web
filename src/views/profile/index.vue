<template>
  <div class="background-container">
    <a-descriptions
        style="margin-top: 20px"
        size="large"
        :title="`Hi! ${userStore.username}`"
        :column="1">
      <a-descriptions-item label="用户名">
        {{ renderData.username }}
      </a-descriptions-item>
      <a-descriptions-item label="邮箱">
        {{ renderData.email }}
      </a-descriptions-item>
      <a-descriptions-item label="飞书认证" v-if="!renderData.feishu">
        <a-button :loading="loading" @click="handleFeishuAuth">
          飞书认证
        </a-button>
      </a-descriptions-item>
      <a-descriptions-item label="用户标识">
        <a-tag color="arcoblue">{{ renderData.uid }}</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="上次登录时间">
        <a-tag color="arcoblue">{{ renderData.lastLoginTime }}</a-tag>
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script setup lang="ts">
import useUserStore from "@/stores/modules/user";
import {md5} from "@/utils/crypt";
import {onMounted, ref} from "vue";
import {userFeishuApi, UserItem, userProfileApi} from "@/api/modules/user";
import useLoading from "@/hooks/loading";
import {Message} from "@arco-design/web-vue";

const {loading, setLoading} = useLoading()
const renderData = ref<UserItem>({
  createTime: "",
  email: "",
  feishu: false,
  lastLoginTime: "",
  role: [],
  status: false,
  uid: "",
  updateTime: "",
  username: ""
})
const userStore = useUserStore()
const getUserAvatar = () => {
  const avatar: string = userStore.email
  return `https://cravatar.cn/avatar/${md5(avatar.toLowerCase().trim())}?`
}
const fetchData = async () => {
  setLoading(true);
  try {
    const {code, data} = await userProfileApi()
    if (code !== 0) return
    renderData.value = data;
  } catch (err) {
    console.error(err)
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}
const handleFeishuAuth = async () => {
  setLoading(true);
  try {
    const {code} = await userFeishuApi()
    if (code !== 0) return
    Message.success({
      content: "飞书认证成功",
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
onMounted(async () => {
  await fetchData()
})
</script>

<style scoped lang="less">
.background-container {
  background-image: v-bind(getUserAvatar());
}
</style>