<template>
  <!--分页-->
  <el-col :span="24" class="toolbar" style="padding-bottom:10px;">
    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20"
                   :total="total" style="float:right;"></el-pagination>
  </el-col>
</template>

<script>
  export default{
    data(){
    },
    components: {
    }
  }
</script>

<style scoped>

</style>
