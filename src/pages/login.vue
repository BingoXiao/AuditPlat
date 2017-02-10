<template>
  <el-row>
    <el-col :span="12" :offset="6" id="login">
      <el-row>
        <br/>
        <h2 style="text-align: center">
          <strong>审核后台登录</strong>
        </h2>
        <br/>
      </el-row>

      <el-row>
        <el-col :span="18" :offset="3">
          <!--账号-->
          <el-form id="loginForm" label-width="100px">
            <el-form-item label="账号">
              <el-input v-model="account" name="account" autofocus></el-input>
              <!--账号错误提示-->
              <i class="el-icon-circle-cross errorTips" v-if="accErr"> {{accErr}}</i>
            </el-form-item>

            <!--密码-->
            <el-form-item label="密码">
              <el-input type="password" auto-complete="off" name="password"
                        v-model="password"></el-input>
              <!--密码错误提示-->
              <i class="el-icon-circle-cross errorTips" v-if="pwdErr"> {{pwdErr}}</i>
            </el-form-item>

            <!--记住-->
            <el-form-item label="">
              <el-checkbox label="下次自动登录" checked v-model="checked"></el-checkbox>
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
  import {ACCOUNTS_LOGIN_URL} from "./../common/interface"
  import {setCookie} from "../common/common"

  export default {
    data () {
      return {
        account: "",
        password: "",
        checked: true,
        accErr: "",   // 账号验证
        pwdErr: ""   // 密码验证
      }
    },
    methods: {
      /* 账号验证 */
      accountV: function () {
        if (!(/^[\x21-\x7e._-]{2,63}$/.test(this.account))) {
          this.accErr = "账号长度为2~63位，且只能包含数字、字母及. _ -"
          return false
        } else {
          this.accErr = ""
          return true
        }
      },
      /* 密码验证 */
      passwordV: function () {
        if (!(/^[\x21-\x7e]{6,63}$/.test(this.password))) {
          this.pwdErr = "密码长度为6~32位，且只能包含数字、字母及除空格外的特殊符号"
          return false
        } else {
          this.pwdErr = ""
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
          self.$store.commit("AUTH_LOGIN", true)
          /*  记录账号权限 */
          /*
           var perms = {
           bus_apply: 1,
           bus_register: 1,
           bus_verify: 1,
           checkout_verify: 1,
           project_verify: 1,
           item_list: 1
           }
           self.$store.commit("USER_DATA", perms)
           self.$router.push({path: "/Setting"})
           */
          this.$http.post(ACCOUNTS_LOGIN_URL, formData)
            .then(function (response) {
              if (response.data.success) {
                /*  记录状态 */
                self.$store.commit("USER_NAME", response.data.content.account)
                self.$store.commit("AUTH_LOGIN", true)
                self.$store.commit("USER_DATA", response.data.content.perms)

                /* 自动登录 */
                if (self.checked) {
                  var Days = 30   // cookie 将被保存30天
                  var exp = new Date()  // 获得当前时间
                  var name = "REMEMBER"
                  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)  // 换成毫秒
                  document.cookie = name + "=" + escape("1") + ";expires=" + exp.toGMTString()
                }

                self.$router.push({path: "/Setting"})
                /*
                 var mmm = self.$store.state.user_data
                 for (var i in mmm) {
                 console.log(i + ":" + mmm[i])
                 }
                 */
              } else {
                self.pwdErr = response.body.error_info
              }
            }, function (response) {
              alert("无法连接，请稍后再试！")
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
  #login {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 100px;
    padding: 20px 0 40px 0;
    border: 1px solid #d9d9d9;
  }

  .errorTips {
    position: absolute;
    top: 42px;
    font-size: 13px;
    color: #b50000;
  }
</style>
