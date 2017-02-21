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
</template>

<script>
  import headerMenu from "../../components/headerMenu/index"
  import {ACCOUNTS_LOGIN_URL} from "../../common/interface"
  import {setCookie, isAccount, isPassword} from "../../common/common"

  export default {
    data() {
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
      accountV: function() {
        var self = this
        var Account = isAccount(self.account)
        if (Account.flag) {
          self.accErr = ""
          document.getElementsByName("account")[0].style.borderColor = "rgb(191, 203, 217)"
        } else {
          self.accErr = Account.error
          document.getElementsByName("account")[0].style.borderColor = "#ff4949"
        }
        return Account.flag
      },
      /* 密码验证 */
      passwordV: function() {
        var self = this
        var Password = isPassword(self.password)
        if (self.password === "") {
          self.pwdErr = "请输入密码"
          document.getElementsByName("password")[0].style.borderColor = "#ff4949"
          Password.flag = false
        } else {
          if (Password.flag) {
            self.pwdErr = ""
            document.getElementsByName("password")[0].style.borderColor = "rgb(191, 203, 217)"
          } else {
            self.pwdErr = Password.error
            document.getElementsByName("password")[0].style.borderColor = "#ff4949"
          }
        }

        return Password.flag
      },
      /* 登录提交 */
      onSubmit: function() {
        var self = this
        if (self.accountV() && self.passwordV()) {
          var loginform = document.getElementById("loginForm")
          var formData = new FormData(loginform)

          /*  记录登录状态 */
          self.$http.post(ACCOUNTS_LOGIN_URL, formData)
            .then(function(response) {
              if (response.data.success) {
                /*  记录状态 */
                self.$store.commit("USER_NAME", self.account)
                self.$store.commit("AUTH_LOGIN", true)
                self.$store.commit("USER_DATA", response.data.content.perms)

                /* 自动登录 */
                if (self.checked) {
                  setCookie("REMEMBER", "1", 30)
                }

                /* 根据权限进入不同得页面 */
                if (self.$store.state.user_data.item_list === 1) { /* 管理员账号 */
                  self.$router.push({path: "/setting"})
                } else {   /* BD */
                  if (self.$store.state.user_data.bus_apply === 1 ||
                    self.$store.state.user_data.bus_register === 1) {
                    if (self.$store.state.user_data.bus_apply === 1) {
                      self.$router.push({path: "/bus_apply"})
                    } else {
                      self.$router.push({path: "/bus_register"})
                    }
                  } else {  /* 审核人员 */
                    if (self.$store.state.user_data.bus_verify === 1 ||
                      self.$store.state.user_data.checkout_verify === 1 ||
                      self.$store.state.user_data.project_verify === 1) {
                      if (self.$store.state.user_data.bus_verify === 1) {
                        self.$router.push({path: "/bus_review"})
                      } else if (self.$store.state.user_data.checkout_verify === 1) {
                        self.$router.push({path: "/checkout_verify"})
                      } else {
                        self.$router.push({path: "/project_verify"})
                      }
                    }
                  }
                }
              }
            })
        } else {
          return false
        }
      }
    },
    components: {
      headerMenu
    }
  }
</script>
