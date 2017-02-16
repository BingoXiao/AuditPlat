<template>
  <el-select v-model="selectedValue" clearable
             size="small" placeholder="请选择">
    <el-option
      v-for="item in options"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<style>

</style>

<script>
  export default{
    data() {
      return {
        selectedValue: "",
        options: [{
          value: "全部",
          label: "全部"
        }, {
          value: "冻结",
          label: "冻结"
        }, {
          value: "启用",
          label: "启用"
        }]
      }
    }
  }
</script>
