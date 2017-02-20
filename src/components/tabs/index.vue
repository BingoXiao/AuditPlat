<template>
  <div class="tabs">
    <div class="tabs_header">
      <ul class="tabs_panel">
        <li class="tabs_item" v-for="(item, index) in tabs"
            @click="toggle(index)" :class="{active:active==index}">
          <router-link :to="item.path">{{item.name}}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default{
    data() {
      return {
        active: 0,
        tabs: [
          {
            path: "/bus_register/newShop",
            name: "新店注册"
          },
          {
            path: "/bus_register/branchShop",
            name: "分店注册"
          }
        ]
      }
    },
    methods: {
      toggle(i) {
        this.active = i
      }
    }
  }
</script>

<style scoped>
  .tabs {
  }
  .tabs_header {
    border-bottom: 1px solid #020202;
    padding: 0;
    position: relative;
    margin: 0 0 15px;
  }
  .tabs_panel{
    height: 36px;
    box-sizing: border-box;
    -moz-box-sizing:border-box; /* Firefox */
    -webkit-box-sizing:border-box; /* Safari */
    list-style: none;
    font-size: 15px;
    padding-left: 0;
    margin-bottom: -1px;
  }
  .tabs_item{
    float: left;
    cursor: pointer;
    color: rgb(255, 255, 255);
    background-color: #020202;
    margin-right: 10px;
    padding: 0;
    line-height: 36px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }
  .tabs_item>a{
    text-decoration: none;
    color: #fff;
    padding: 9px 30px 10px 30px;
  }
  .active{
    background: #fad500;
  }
  .active>a{
    color: #000000;
  }
</style>
