<template>
  <aside style="width: 100%">
    <el-row class="head" type="flex" justify="space-between" align="middle">
      <el-col :offset="1" :span="11" style="margin-top: 5px;">
        <router-link to="/login">
          <img src="../../assets/logo.png" alt="近脉商家中心"/>
        </router-link>
      </el-col>

      <el-dropdown :hide-on-click="false" v-if="$store.auto_login">
      <span class="el-dropdown-link">
        {{$store.use_name}}
        <i class="el-icon-caret-bottom el-icon--right"></i>
      </span>
        <span>|</span>
        <i class="iconfont icon-erweima" style="vertical-align: middle"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>修改密码</el-dropdown-item>
          <el-dropdown-item divided @click="logOut">登出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-row>
  </aside>
</template>

<script>
  export default{
    name: "header",
    data () {
      return {
        topmenu: true
      }
    },
    methods: {
      // 退出登录
      logOut: function () {
        var self = this
        this.$confirm("确认退出吗?", "提示", {
          // type: 'warning'
        }).then(() => {
          var name = "REMEMBER"
          var exp = new Date()
          exp.setTime(exp.getTime() - 1)
          document.cookie = name + "=" + "1" + ";expires=" + exp.toGMTString()
          self.$router.push("/login")
        }).catch(() => {

        })
      }
    }
  }
</script>

<style scoped>
  .head {
    height: 60px;
    color: #ffffff;
    background-color: #020202;
  }

  img {
    width: 240px;
  }

  .icon-erweima {
    font-size: 15px;
  }
</style>
