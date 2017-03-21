<template>
  <el-input
    size="small"
    v-model="inputValue"
    :placeholder="placeholder"
    @change="getRules">
  </el-input>
</template>

<script>
  export default{
    props: {
      placeholder: String,   // 占位文本
      name: String           // 名称
    },
    data() {
      return {
        inputValue: ""
      }
    },
    methods: {
      reset: function() {
        var self = this
        self.inputValue = ""
      },
      getRules: function() {
        var self = this
        self.$emit("getRules", self.name, self.inputValue)
      }
    }
  }
</script>

<style>

</style>
