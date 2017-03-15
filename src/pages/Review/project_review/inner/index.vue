<template>
  <el-row class="panel-center" type="flex" justify="center" style="top:80px;">
    <el-col :span="20" :offset="2">
      <el-col :span="20" :offset="2">
        <main-content></main-content>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
  import mainContent from "../module/index.vue"

  export default{
    components: {
      mainContent
    }
  }
</script>

<style scoped>

</style>
