<template>
  <el-row>
    <el-col :span="24" v-if="$route.params.type==='view_activity'">
      <view-activity></view-activity>
    </el-col>

    <el-col :span="24" v-else>
      <table-list></table-list>
    </el-col>
  </el-row>
</template>

<script>
  import tableList from "./table_list/index"
  import viewActivity from "./view_activity/index"

  export default {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当钩子执行前，组件实例还没被创建
    beforeRouteEnter(to, from, next) {
      if (to.path === "/activity_list/:type") {
        next({path: "/activity_list/all"})
      } else {
        next()
      }
    },
    // 在当前路由改变，但是该组件被复用时调用
    // 可以访问组件实例 `this`
    beforeRouteUpdate(to, from, next) {
      if (to.path === "/activity_list/:type") {
        next({path: "/activity_list/all"})
      } else {
        next()
      }
    },
    components: {
      tableList,
      viewActivity
    }
  }
</script>

<style scoped>

</style>
