<template>
  <el-col :span="24">
    <el-row type="flex" justify="center" style="margin-top: 50px;margin-bottom: 50px;">
      <table>
        <tr>
          <td rowspan="2">
            <img src="../../../../../assets/register/12.png" alt=""
                 style="width:80px;float: right">
          </td>
          <td style="vertical-align: middle;font-size:23px">
            恭喜您，注册申请成功
          </td>
        </tr>
      </table>
    </el-row>

    <el-row type="flex" justify="center">
      <el-button type="primary" @click="BackTo">回到商家注册列表</el-button>
    </el-row>
  </el-col>
</template>

<script>
  export default{
    methods: {
      BackTo: function() {
        this.$router.push({path: "/bus_register/branch"});
      }
    }
  };
</script>

<style scoped>

</style>
