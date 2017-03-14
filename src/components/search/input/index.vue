<template>
  <el-input
    icon="search" size="small"
    v-model="inputValue"
    :placeholder="placeholder"
    :on-icon-click="handleIconClick">
  </el-input>
</template>

<script>
  export default{
    props: {
      placeholder: String
    },
    data() {
      return {
        inputValue: ""
      }
    },
    methods: {
      handleIconClick() {
        alert(1)
      }
    }
  }
</script>

<style>

</style>
