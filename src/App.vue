<template>
  <div id="app" style="width:100%">
    <!--头部-->
    <header-menu></header-menu>
    <!--<transition name="bounce">-->
    <router-view></router-view>
    <!--</transition>-->
  </div>
</template>

<script>
  import headerMenu from "components/headerMenu"

  export default{
    components: {
      headerMenu
    }
  }
</script>

<style scoped>

</style>
