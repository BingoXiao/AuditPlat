<template>
  <el-row>
    <el-col :span="24" class="toolbar">
      <el-form label-width="100px" :model="searchForm" :inline="true">
        <el-form-item label="用户账号：">
          <inputSearch-component></inputSearch-component>
        </el-form-item>

      </el-form>
    </el-col>
  </el-row>

</template>

<script>
  import inputSearchComponent from "../../components/search/input/index"

  export default{
    data () {
      return {
        searchForm: {}
      }
    },
    components: {
      inputSearchComponent
    }
  }
</script>

<style scoped>

</style>
