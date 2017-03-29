<template>
  <el-row class="headRow" type="flex" justify="space-around">
    <el-col :span="6">
      <!--商家中心注册-->
      <div class="imgWrapper" v-if="$route.path === '/center-site/register'">
        <router-link to="/center-site/register" class="link">
          <img src="../../assets/Blogo.png" alt="近脉商家中心"
               class="image" style="width:175px;"/>
        </router-link>
      </div>

      <!--商家后台审核-->
      <div class="imgWrapper" v-else>
        <router-link to="/login" class="link">
          <img src="../../assets/logo.png" alt="近脉后台审核中心" class="image"/>
        </router-link>
      </div>
    </el-col>

    <el-col :span="4" :offset="14">
      <div class="topMenu"
           v-if="$store.state.auth_login && $route.path!=='/center-site/register'">
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
  .headRow {
    width: 100%;
    height: 60px;
    color: #ffffff;
    background-color: #020202;
    position: absolute;
    top: 0;
    text-align: center;
  }

  .imgWrapper{
    line-height: 60px;
  }

  .link{
    display: inline-block;
    vertical-align: middle
  }

  .image{
    width: 220px;
    margin-top: 0;
    vertical-align: middle;
  }

  .topMenu {
    position: relative;
    top: 24px;
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
