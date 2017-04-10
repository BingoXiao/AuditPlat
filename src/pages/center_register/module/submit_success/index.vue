<template>
  <el-col :span="24">
    <el-row type="flex" justify="center" style="margin-top: 50px;margin-bottom: 50px;">
      <table>
        <tr>
          <td rowspan="2">
            <img src="../../../../assets/register/12.png" alt=""
                 style="width:80px;float: right">
          </td>
          <td style="vertical-align: bottom;font-size:23px">
            恭喜您，开店申请成功
          </td>
        </tr>
        <tr>
          <td style="vertical-align: inherit;color:#7E7E7E;font-size:16px">
            我们将尽快进行审核，请注意手机号（
            <strong id="user_tel" style="color: black">{{phonenum}}</strong>
            ）的短信通知
          </td>
        </tr>
      </table>
    </el-row>

    <el-row type="flex" justify="center">
      <el-button type="primary" @click="BackTo">回到开店主页</el-button>
    </el-row>
  </el-col>
</template>

<script>
  import {getParmString} from "../../../../common/common";
  import {CENTER_URL} from "../../../../common/interface";

  export default{
    data() {
      return {
        phonenum: ""
      };
    },
    mounted() {
      var self = this;
      self.phonenum = getParmString("tel");
    },
    methods: {
      BackTo: function() {
        var otherWindow;
        otherWindow = window.open(CENTER_URL, "_self");
        otherWindow.opener = null;
      }
    }
  };
</script>

<style scoped>

</style>
