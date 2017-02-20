<template>
  <el-row>
    <el-col :span="24">
      <tab-component></tab-component>
    </el-col>
    <!--<el-col :span="24">
      &lt;!&ndash;如果把切换出去的组件保留在内存中，可以保留它的状态或避免重新渲染。为此可以添加一个 keep-alive 指令参数：&ndash;&gt;
      &lt;!&ndash;当组件在 <keep-alive> 内被切换，它的 activated 和 deactivated 这两个生命周期钩子函数将会被对应执行。&ndash;&gt;
      &lt;!&ndash;v-bind:is=”组件名”，会自动去找匹配的组件名，如果没有，则不显示&ndash;&gt;
      <keep-alive>
        <component :is="currentView">
          &lt;!&ndash; 非活动组件将被缓存！ &ndash;&gt;
        </component>
      </keep-alive>
    </el-col>-->

    <el-col :span="24">
      <router-view name="tabContent"></router-view>
    </el-col>
  </el-row>
</template>

<script>
  import tabComponent from "../components/tabs/index"

  export default {
    data() {
      return {
        active: 0
      }
    },
    components: {
      tabComponent
    }
  }
</script>

<style scoped>

</style>
