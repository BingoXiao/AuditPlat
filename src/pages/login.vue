<template>
  <el-row type="flex" justify="center">
    <el-col :xs="22" :sm="18" :md="14" :lg="12" class="login">
      <el-row style="margin:20px 60px 20px 60px;">
        <h2 class="topTitle">
          <strong>审核后台登录</strong>
        </h2>
      </el-row>

      <el-row type="flex" justify="center">
        <el-col :span="16">
          <!--账号-->
          <el-form id="loginForm" label-width="50px" label-position="left">
            <el-form-item label="账号">
              <el-input id="accountDiv" v-model="account" name="account" autofocus></el-input>
              <!--账号错误提示-->
              <i class="el-icon-circle-close errorTips" v-if="accErr"> {{accErr}}</i>
            </el-form-item>

            <!--密码-->
            <el-form-item label="密码">
              <el-input type="password" auto-complete="off" name="password"
                        v-model="password"></el-input>
              <!--密码错误提示-->
              <i class="el-icon-circle-close errorTips" v-if="pwdErr"> {{pwdErr}}</i>
            </el-form-item>

            <!--记住-->
            <el-form-item label="">
              <el-checkbox label="下次自动登录" v-model="checked" :checked="checked"></el-checkbox>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmit">登 录</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
  import {ACCOUNTS_LOGIN_URL} from "../common/interface"
  import {setCookie} from "../common/common"

  export default {
    data () {
      return {
        account: "",
        password: "",
        checked: true, // 下次自动登录
        accErr: "",   // 账号验证
        pwdErr: ""   // 密码验证
      }
    },
    methods: {
      /* 账号验证 */
      accountV: function () {
        if (!(/^[\x21-\x7e._-]{2,63}$/.test(this.account))) {
          this.accErr = "账号长度为2~63位，且只能包含数字、字母及. _ -"
          document.getElementsByName("account")[0].style.borderColor = "#ff4949"
          return false
        } else {
          this.accErr = ""
          document.getElementsByName("account")[0].style.borderColor = "rgb(191, 203, 217)"
          return true
        }
      },
      /* 密码验证 */
      passwordV: function () {
        if (!(/^[\x21-\x7e]{6,63}$/.test(this.password))) {
          this.pwdErr = "密码长度为6~32位，且只能包含数字、字母及除空格外的特殊符号"
          document.getElementsByName("password")[0].style.borderColor = "#ff4949"
          return false
        } else {
          this.pwdErr = ""
          document.getElementsByName("password")[0].style.borderColor = "rgb(191, 203, 217)"
          return true
        }
      },
      /* 登录提交 */
      onSubmit: function () {
        var self = this
        if (self.accountV() && self.passwordV()) {
          var loginform = document.getElementById("loginForm")
          var formData = new FormData(loginform)

          /*  记录登录状态 */
          self.$http.post(ACCOUNTS_LOGIN_URL, formData)
            .then(function (response) {
              if (response.data.success) {
                /*  记录状态 */
                self.$store.commit("USER_NAME", self.account)
                self.$store.commit("AUTH_LOGIN", true)
                self.$store.commit("USER_DATA", response.data.content.perms)

                /* 自动登录 */
                if (self.checked) {
                  setCookie("REMEMBER", "1", 30)
                }

                self.$router.push({path: "/setting"})
              } else {
                self.pwdErr = response.body.error_info
              }
            }, function (response) {
              self.$message.error("无法连接，请稍后再试！")
            })
        } else {
          return false
        }
      }
      /*
       keyupSubmit: function (e) {
       // 在ff下event会做为参数传进来，ie下会在window下
       var event = e.target || window.event
       // e.which是ff下获取keyCode的方式，ie下使用e.keyCode获取
       var key = event.which || event.keyCode
       console.log(key)
       if (key === 13) {
       this.onSubmit()
       }
       }
       */
    }
  }
</script>


<style scoped>


</style>
