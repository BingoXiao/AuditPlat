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
              <el-input type="password" v-model="pwdForm.oldPwd" autofocus
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
        <el-button type="primary" @click="confirmEdit">&emsp;确 定&emsp;</el-button>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
  import {ACCOUNTS_PASSWORD_URL} from "../../common/interface"
  import {clearCookie, isPassword} from "../../common/common"
  import headerMenu from "../../components/headerMenu/index"

  export default {
    components: {
      headerMenu
    },
    data() {
      var newPwdV = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入新密码"))
        } else {
          if (isPassword(value).flag) {
            if (value === this.pwdForm.oldPwd) {
              callback(new Error("新密码不能与原密码相同"))
            } else {
              this.$refs.pwdForm.validateField("confirmPwd")
              callback()
            }
          } else {
            callback(new Error("密码长度为6~32位，且只能包含数字、字母及除空格外的特殊符号"))
          }
        }
      }
      var confirmPwdV = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"))
        } else if (value !== this.pwdForm.newPwd) {
          callback(new Error("两次输入密码不一致!"))
        } else {
          callback()
        }
      }
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
            {validator: newPwdV, trigger: "blur"}
          ],
          confirmPwd: [
            {validator: confirmPwdV, trigger: "blur"}
          ]
        }
      }
    },
    methods: {
      /* 密码修改提交 */
      confirmEdit: function() {
        var self = this

        this.$refs.pwdForm.validate((valid) => {
          if (valid) {
            var form = document.getElementById("pwdForm")
            var formData = new FormData(form)
            formData.append("id", self.$store.state.user_id)
            this.$http.post(ACCOUNTS_PASSWORD_URL, formData)
              .then(function(response) {
                if (response.data.success) {
                  self.$store.commit("AUTH_LOGIN", false)
                  clearCookie("REMEMBER")

                  self.$message({
                    message: "请重新登录！",
                    type: "warning"
                  })

                  self.$router.push({path: "/login"})
                } else {
                  self.$message.error(response.data.error_info)
                }
              }, function(response) {
                self.$message.error("无法连接，请稍后再试！")
              })
          }
        })
      }
    }
  }
</script>


<style scoped>

</style>
