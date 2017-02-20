<template>
  <div class="block">
    <el-date-picker :editable="false"
      v-model="valueFrom"
      type="date" size="small"
      placeholder="请选择日期"
      :picker-options="pickerOptionsFrom"
      @change="dateFrom">
    </el-date-picker>
    <span>&emsp;至&emsp;</span>
    <el-date-picker :editable="false"
      v-model="valueTo"
      type="date" size="small"
      placeholder="请选择日期"
      :picker-options="pickerOptionsTo"
      @change="dateTo">
    </el-date-picker>
  </div>
</template>

<script>
  export default{
    data() {
      return {
        valueFrom: "",    // 开始时间
        valueTo: "",     // 结束时间
        pickerOptionsFrom: {
          disabledDate(time) {    // 禁用时间段
            if (this.valueFrom === "") {
              return time.getTime() > Date.now()
            } else {
              return time.getTime() > this.valueFrom.getTime()
            }
          }
        },
        pickerOptionsTo: {
          disabledDate(time) {    // 禁用时间段
            if (this.valueTo === "") {
              return time.getTime() > Date.now()
            } else {
              return time.getTime() > this.valueTo.getTime()
            }
          }
        }
      }
    },
    methods: {
      dateFrom: function(value) {   // 选择开始时间
        this.valueFrom = value
      },
      dateTo: function(value) {     // 选择结束时间
        this.valueTo = value
      }
    }
  }
</script>
