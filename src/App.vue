<template>
  <el-config-provider :message="config">
    <router-view></router-view>
  </el-config-provider>
</template>


<script setup>
import { reactive } from "vue"
const config = reactive({
  max: 1,
})
</script>

<style lang="scss" scoped>
</style>
