<template>
  <div class="tabs">
    <div class="tabs_header">
      <ul class="tabs_panel">
        <li class="tabs_item" v-for="(value, key) in tabs"
            @click="toggle(key)" :class="{active: key==active}">
          <span class="inner">{{value}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default{
    props: {
      tabs: Object,
      which: String
    },
    data() {
      return {
        active: ""
      };
    },
    mounted() {
      this.active = this.which;
    },
    watch: {
      which: function() {
        this.active = this.which;
      }
    },
    methods: {
      toggle(key) {
        var self = this;
        self.active = key;
        self.$emit("toggle", key);
      }
    }
  };
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
  .tabs_item .inner{
    text-decoration: none;
    padding: 9px 30px 10px 30px;
  }
  .active{
    background: #fad500;
    color: #000000;
  }
</style>
