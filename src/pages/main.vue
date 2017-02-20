<template>
  <el-row class="panel">
    <header-menu></header-menu>

    <el-col :span="24" class="panel-center">
      <aside class="leftNav">
        <left-slide></left-slide>
      </aside>
      <section class="panel-content">
        <router-view></router-view>
      </section>
    </el-col>
  </el-row>
</template>

<script>
  import leftSlide from "../components/leftSlide/index"
  import headerMenu from "../components/headerMenu/index"

  export default{
    components: {
      leftSlide,
      headerMenu
    }
  }
</script>

<style>
  .panel {
    width: 100%;
    height: 100%;
    margin: 0;
    top: 0;
    bottom: 0;
  }

  .leftNav {
    width: 180px;
    height: 100%;
    background-color: #383838;
  }

  .panel-center {
    width: 100%;
    background-color: #ffffff;
    margin: 0;
    position: absolute;
    left: 0;
    top: 60px;
    bottom: 0;
  }

  .panel-content {
    position: absolute;
    left: 180px;
    right: 0;
    top: 0;
    bottom: 0;
    padding: 30px 40px;
    overflow: auto;
  }
</style>
