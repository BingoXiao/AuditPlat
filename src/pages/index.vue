<template>
  <div class="panel">
    <aside class="left-side">
      <left-slide></left-slide>
    </aside>

    <section class="main-content">
      <!--左选单对应的内容-->
      <router-view></router-view>
    </section>
  </div>
</template>

<script>
  import leftSlide from "../components/leftSlide/index"

  export default{
    components: {
      leftSlide
    }
  }
</script>

<style>
  .panel {
    height: 94%;
    width: 100%;
    position: relative;
    top: 60px;
    overflow: hidden;
  }

  .left-side {
    width: 180px;
    height: 100%;
    background-color: #040404;
    position: absolute;
    left:0;
  }

  .main-content{
    height: 94%;
    position: absolute;
    left: 180px;
    top: 20px;
    margin-left: 20px;
  }
</style>
