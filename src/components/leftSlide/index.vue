<template>
  <nav style="height: 100%">
    <el-menu :default-active="$route.path" theme="dark" class="menu-box" router
             v-for="(item,index) in $router.options.routes" v-if="!item.hidden"
             style="background-color: #040404;">
      <el-submenu :index="index+''">
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
  export default{}
</script>
