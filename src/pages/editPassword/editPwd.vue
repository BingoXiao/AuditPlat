<template>
  <el-row type="flex" justify="center">
    <header-menu></header-menu>
    <el-col :xs="22" :sm="18" :md="14" :lg="12" class="login">
      <el-row>
        <br/>
        <h2 class="topTitle" style="border-bottom: none">
          <strong>修改密码</strong>
        </h2>
      </el-row>

      <el-row type="flex" justify="center">
        <el-col :span="18">
          <el-form id="pwdForm" :model="pwdForm" :rules="rules" ref="pwdForm"
                   label-width="100px" label-position="right">
            <!--账号-->
            <el-form-item label="账号：">
              <b>&nbsp;{{$store.state.user_name}}</b>
            </el-form-item>

            <!--旧密码-->
            <el-form-item label="旧密码：" prop="oldPwd">
              <el-input type="password" v-model="pwdForm.oldPwd"
                        name="old_password"></el-input>
            </el-form-item>

            <!--新密码-->
            <el-form-item label="新密码：" prop="newPwd">
              <el-input type="password" v-model="pwdForm.newPwd"
                        name="new_password"></el-input>
            </el-form-item>

            <!--确认密码-->
            <el-form-item label="确认密码：" prop="confirmPwd">
              <el-input type="password" v-model="pwdForm.confirmPwd"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-button type="primary" @click="confirmEdit('pwdForm')">&emsp;确 定&emsp;</el-button>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
  import {ACCOUNTS_PASSWORD_URL} from "../../common/interface";
  import {clearCookie, isPassword} from "../../common/common";
  import headerMenu from "../../components/headerMenu/index";

  export default {
    components: {
      headerMenu
    },
    data() {
      var newPwdV = (rule, value, callback) => {
        var pwd = isPassword(value);
        if (value === "") {
          callback(new Error("请输入密码"));
        } else {
          if (pwd.flag) {
            if (value === this.pwdForm.oldPwd) {
              callback(new Error("新密码不能与原密码相同"));
            } else {
              this.$refs.pwdForm.validateField("confirmPwd");
              callback();
            }
          } else {
            callback(new Error(pwd.error));
          }
        }
      };
      var confirmPwdV = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.pwdForm.newPwd) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      };
      return {
        pwdForm: {
          oldPwd: "",
          newPwd: "",
          confirmPwd: ""
        },
        rules: {
          oldPwd: [
            {required: true, message: "请输入原密码", trigger: "blur"}
          ],
          newPwd: [
            {required: true, validator: newPwdV, trigger: "blur"}
          ],
          confirmPwd: [
            {required: true, validator: confirmPwdV, trigger: "blur"}
          ]
        }
      };
    },
    methods: {
      /* 密码修改提交 */
      confirmEdit: function(formName) {
        var self = this;

        self.$refs[formName].validate((valid) => {
          if (valid) {
            var form = document.getElementById("pwdForm");
            var formData = new FormData(form);
            formData.append("id", self.$store.state.user_id);
            self.$http.post(ACCOUNTS_PASSWORD_URL, formData)
              .then(function(response) {
                if (response.data.success) {
                  self.$store.commit("AUTH_LOGIN", false);
                  clearCookie("REMEMBER");

                  self.$message({
                    message: "请重新登录！",
                    type: "warning"
                  });

                  self.$router.push({path: "/login"});
                }
              });
          }
        });
      }
    }
  };
</script>


<style scoped>

</style>
