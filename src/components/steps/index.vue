<template>
  <el-steps :space="100" :active="active">
    <el-step title="步骤 1" icon="edit"></el-step>
    <el-step title="步骤 2" icon="upload"></el-step>
    <el-step title="步骤 3" icon="picture"></el-step>
  </el-steps>
</template>

<script>
  export default{
    data() {
      return {
        active: "1"
      }
    }
  }
</script>

<style>

</style>
