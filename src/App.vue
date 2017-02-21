<template>
  <div id="app">
    <header-menu></header-menu>

    <div class="panel">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import headerMenu from "./components/headerMenu/index"

  export default{
    name: "app",
    components: {
      headerMenu
    }
  }
</script>
