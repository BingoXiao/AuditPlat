<template>
  <div>
    <table>
      <tr>
        <td><el-checkbox v-model="checkAll" disabled>整周</el-checkbox>
          <span>&nbsp;|</span>
        </td>
        <td>
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="1" disabled>周一</el-checkbox>
            <el-checkbox label="2" disabled>周二</el-checkbox>
            <el-checkbox label="3" disabled>周三</el-checkbox>
            <el-checkbox label="4" disabled>周四</el-checkbox>
            <el-checkbox label="5" disabled>周五</el-checkbox>
            <el-checkbox label="6" disabled>周六</el-checkbox>
            <el-checkbox label="7" disabled>周日</el-checkbox>
          </el-checkbox-group>
        </td>
      </tr>

      <tr>
        <td>
          <el-checkbox v-model="wholeHour" disabled>24小时</el-checkbox>
          <span>&nbsp;|</span>
        </td>
        <td>
          &emsp;{{open_hours.begin}}&emsp;至&emsp;{{open_hours.end}}
        </td>
      </tr>
    </table>


  </div>

</template>

<script>
  export default{
    props: {
      open_hours: Object
    },
    data() {
      return {
        weeks: ["1", "2", "3", "4", "5", "6", "7"],
        checkList: [],
        checkAll: false,   // 整周
        wholeHour: false,  // 24小时
        begin: "",         // 开始时间
        end: ""            // 结束时间
      }
    },
    mounted() {
      var self = this
      var arr = self.open_hours.week.split("")
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === "1") {
          self.checkList.push((i + 1) + "")
        }
      }
      if (self.checkList.length === 7) {
        self.checkAll = true
      }
      if (self.open_hours.begin === "00:00:00" && self.open_hours.end === "23:59:59") {
        self.wholeHour = true
      }
    }
  }
</script>

<style>

</style>

