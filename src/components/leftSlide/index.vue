<template>
  <nav style="height: 100%; background-color:#383838">
    <el-menu :default-active="$route.path" unique-opened router theme="dark"
             @open="handleOpen" @close="handleClose">
      <el-submenu :index="index+''" v-for="(item,index) in $router.options.routes"
                  v-if="!item.hidden">
        <template slot="title">
          {{item.name}}
        </template>

        <el-menu-item v-for="child in item.children" :index="child.path">
          <i :class="child.iconCls"></i>
          {{child.name}}
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </nav>
</template>

<style>

</style>

<script>
  export default{
    data () {
      return {

      }
    },
    methods: {
      /* SubMenu 展开的回调  */
      // index: 打开的 subMenu 的 index， indexPath: 打开的 subMenu 的 index path
      handleOpen (key, keyPath) {
        console.log(keyPath)
      },
      /* SubMenu 收起的回调 */
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      }
    }
  }
</script>
