<template>
  <el-select v-model="value"
             clearable
             size="small"
             placeholder="全部"
             @change="getRules">
    <el-option
      v-for="item in options"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
  export default{
    props: {
      options: Array,
      name: String
    },
    data() {
      return {
        value: ""
      }
    },
    methods: {
      reset: function() {
        var self = this
        self.value = ""
      },
      getRules: function(value) {
        var self = this
        self.$emit("getRules", self.name, value)
      }
    }
  }
</script>
