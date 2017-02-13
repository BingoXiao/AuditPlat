<template>
  <div id="app">
    <!--头部-->
    <header-menu></header-menu>

    <!--<transition name="bounce">-->
    <router-view></router-view>
  </div>
</template>

<script>
  import headerMenu from "./components/headerMenu/index"

  export default{
    components: {
      headerMenu
    }
  }
</script>

<style scoped>
  #app{
    width: 100%;
  }
</style>
