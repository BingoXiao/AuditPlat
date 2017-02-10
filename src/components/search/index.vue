<template>
  <el-row>
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUsers">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script type="text/javascript">
  export default{
    props: {
      placeholder: {
        type: String,
        default: "Search here..."
      }
    },
    data(){
      return {
        formValue: ''
      }
    },
    computed: {
      valueIsNull () {
        return this.formValue.trim() == ''
      }
    },
    methods: {
      submit_form() {
        if (!this.valueIsNull) {
          this.$emit('search', this.formValue)
        }
        return false
      }
    }
  }
</script>
