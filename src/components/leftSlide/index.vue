<template>
  <nav>
    <el-menu :default-active="$route.matched[1].path" unique-opened router theme="dark">
      <el-submenu :index="index+''" v-for="(item,index) in $router.options.routes"
                  v-if="isShow[item.hidden]">
        <template slot="title">
          {{item.name}}
        </template>

        <el-menu-item v-for="child in item.children" :index="child.path"
                      v-if="isShow[child.hidden]">
          <i class="iconfont" :class="child.iconCls"></i>
          &emsp;{{child.name}}
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </nav>
</template>

<script>
  export default{
    data() {
      return {
        /* 根据权限判断左选单的菜单显示 */
        isShow: {
          login: false,
          BD: (this.$store.state.user_data.bus_apply === 1) ||
              (this.$store.state.user_data.bus_register === 1),
          Reviewer: (this.$store.state.user_data.bus_verify === 1) ||
                    (this.$store.state.user_data.checkout_verify === 1) ||
                    (this.$store.state.user_data.project_verify === 1),
          Administrator: (this.$store.state.user_data.bus_apply === 1) &&
                        (this.$store.state.user_data.bus_register === 1) &&
                        (this.$store.state.user_data.bus_verify === 1) &&
                        (this.$store.state.user_data.checkout_verify === 1) &&
                        (this.$store.state.user_data.project_verify === 1) &&
                        (this.$store.state.user_data.item_list === 1),
          bus_apply: this.$store.state.user_data.bus_apply === 1,
          bus_register: this.$store.state.user_data.bus_register === 1,
          bus_verify: this.$store.state.user_data.bus_verify === 1,
          checkout_verify: this.$store.state.user_data.checkout_verify === 1,
          project_verify: this.$store.state.user_data.project_verify === 1,
          item_list: this.$store.state.user_data.item_list === 1
        }
      }
    }
  }
</script>

<style scoped>
  .iconfont{
    font-size: 17px;
  }
</style>
