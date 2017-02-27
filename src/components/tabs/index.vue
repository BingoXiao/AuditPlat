<template>
  <div class="tabs">
    <div class="tabs_header">
      <ul class="tabs_panel">
        <li class="tabs_item" v-for="(item, index) in tabs"
            @click="toggle(index)" :class="{active: item.param===type}">
          <router-link :to="{params: {type: item.param}}">{{item.name}}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default{
    props: {
      tabs: Array,
      type: String
    },
    data() {
      return {
      }
    },
    methods: {
      toggle(i) {
        var self = this
        self.active = i
        self.$emit("toggle")
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
    margin-top: 0;
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
