<template>
  <div class="panel-center">
    <aside class="leftNav">
      <left-slide></left-slide>
    </aside>

    <div class="panel-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import leftSlide from "../components/leftSlide/index";

  export default{
    components: {
      leftSlide
    }
  };
</script>
