<template>
  <el-row class="head" type="flex" justify="space-around" align="middle">
    <el-col :span="6">
      <!--商家中心注册-->
      <router-link to="/center-site/register"
                   v-if="$route.path === '/center-site/register'">
        <img src="../../assets/Blogo.png" alt="近脉商家中心"/>
      </router-link>
      <router-link to="/login" v-else>
        <img src="../../assets/logo.png" alt="近脉后台审核中心"/>
      </router-link>
    </el-col>

    <el-col :span="4" :offset="14">
      <div v-if="$store.state.auth_login && $route.path !== '/center-site/register'" class="topMenu">
        <el-popover
          ref="menu"
          placement="bottom"
          trigger="click"
          v-model="visible">
          <ul class="topMenu_ul">
            <li style="border-bottom: 1px solid #020202;padding-top: 5px;"
                @click="editPassword">修改密码
            </li>
            <li style="padding-bottom:5px;" @click="logOut">退出系统</li>
          </ul>
        </el-popover>

        <el-button type="text" v-popover:menu style="color: #fff">
          {{$store.state.user_name}}<i class="el-icon-arrow-down el-icon--right"
                                       style="font-size: 10px"></i>
        </el-button>
        <span style="margin-left: 8px;margin-right: 8px;">|</span>
        <i class="iconfont icon-erweima"
           style="font-size: 17px;vertical-align: middle"></i>
      </div>
      <!--商家中心注册-->
      <div v-if="$route.path === '/center-site/register'" class="topMenu">
        <el-button type="text" style="color: #fff">
          近脉首页
        </el-button>
        <span style="margin-left: 8px;margin-right: 8px;">|</span>
        <i class="iconfont icon-erweima"
           style="font-size: 17px;vertical-align: middle"></i>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  import {ACCOUNTS_LOGOUT_URL} from "../../common/interface";
  import {clearCookie} from "../../common/common";

  export default{
    name: "header",
    data() {
      return {
        visible: false
      };
    },
    methods: {
      // 修改密码
      editPassword: function() {
        var self = this;
        self.visible = false;
        self.$router.push("/editPassword");
      },
      // 退出登录
      logOut: function() {
        var self = this;
        self.visible = false;
        this.$confirm("确认退出系统吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          self.$http.post(ACCOUNTS_LOGOUT_URL)
            .then(function(response) {
              if (response.data.success) {
                self.$store.commit("AUTH_LOGIN", false);
                clearCookie("REMEMBER");

                self.$router.push("/login");
              }
            }, function(response) {
              alert("无法连接，请稍后再试！");
            });
        });
      }
    }
  };
</script>

<style scoped>
  .head {
    width: 100%;
    height: 60px;
    color: #ffffff;
    background-color: #020202;
    position: absolute;
    top: 0;
    text-align: center;
  }

  img {
    width: 220px;
    margin-top: 5px;
  }

  .topMenu {
    position: relative;
    top: 10px;
  }

  .topMenu_ul {
    list-style: none;
    text-align: center;
    padding-left: 0;
    margin: auto;
  }

  .topMenu_ul li {
    cursor: pointer;
    padding: 10px 5px;
  }

  .topMenu_ul li:hover {
    color: #fdd405;
  }

  .icon-erweima {
    font-size: 15px;
  }
</style>
