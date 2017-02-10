<template>
  <el-row class="panel">
    <el-col :span="24" style="height: 100%">
      <aside class="left-side">
        <left-slide></left-slide>
      </aside>
    </el-col>

    <el-col :span="24" class="panel-content">
      <section class="main-content">
        <!--左选单对应的内容-->
        <router-view></router-view>
      </section>
    </el-col>
  </el-row>
</template>

<script>
  import leftSlide from "../components/leftSlide"

  export default{
    components: {
      leftSlide
    }
  }
</script>

<style>
  .panel{
    height: 100%;
  }
  .left-side {
    width: 180px;
    height: 100%;
    background-color: #040404;
  }

  .panel-content {
    position: absolute;
    left: 180px;
    overflow: hidden;
  }
</style>
