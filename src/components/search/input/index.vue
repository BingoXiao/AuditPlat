<template>
  <el-input
    icon="search" size="small"
    v-model="inputValue"
    :on-icon-click="handleIconClick">
  </el-input>
</template>

<script>
  export default{
    data () {
      return {
        inputValue: ""
      }
    },
    methods: {
      handleIconClick () {
        alert(1)
      }
    }
  }
</script>

<style>

</style>
