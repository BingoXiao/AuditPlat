<template>
  <el-select v-model="value" clearable size="small"
             placeholder="全部" @change="filter">
    <el-option
      v-for="item in options"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
  export default{
    props: ["options"],
    data() {
      return {
        value: ""
      }
    },
    methods: {
      filter: function(value) {
        console.log(value)
      }
    }
  }
</script>
