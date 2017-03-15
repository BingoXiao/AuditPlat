<template>
  <el-row>
    <el-col :sapn="22" :offset="1">
      <el-form ref="form" label-width="130px" label-position="left">
        <el-form-item label="商家账号：" required>
          <span class="info">{{account}}</span>
        </el-form-item>

      </el-form>
    </el-col>
  </el-row>
</template>

<script>
  export default{
    data() {
      return {
        account: ""
      }
    }
  }
</script>
