<template>
  <el-row>
    <el-col :span="24">
      <el-tabs type="card" :active-name="active_tab">
        <el-tab-pane v-for="(item, index) in tabs" :label="item.title"
                     :name="item.name">{{item.content}}使用路由
        </el-tab-pane>
      </el-tabs>
    </el-col>

    <el-col :span="24">
      <!--如果把切换出去的组件保留在内存中，可以保留它的状态或避免重新渲染。为此可以添加一个 keep-alive 指令参数：-->
      <!--当组件在 <keep-alive> 内被切换，它的 activated 和 deactivated 这两个生命周期钩子函数将会被对应执行。-->
      <!--v-bind:is=”组件名”，会自动去找匹配的组件名，如果没有，则不显示-->
      <keep-alive>
        <component :is="currentView">
          <!-- 非活动组件将被缓存！ -->
        </component>
      </keep-alive>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      active_tab: "2",
      tabs: [
        {
          title: "新店注册",
          name: "1"
        },
        {
          title: "分店注册",
          name: "2"
        },
        {
          title: "商家申请注册",
          name: "3"
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
