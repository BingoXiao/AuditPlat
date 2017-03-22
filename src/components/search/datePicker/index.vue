<template>
  <div class="block">
    <el-date-picker
      :editable="false"
      v-model="range"
      type="daterange"
      range-separator="~"
      size="small"
      placeholder="请选择日期范围"
      :picker-options="pickerOptions"
      @change="getRules">
    </el-date-picker>
  </div>
</template>

<script>
  export default{
    props: {
      name: String
    },
    data() {
      return {
        range: "",     // 时间范围
        pickerOptions: {
          shortcuts: [{
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          }, {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }, {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }]
        }
      };
    },
    methods: {
      reset: function() {
        var self = this;
        self.range = "";
      },
      getRules: function(value) {
        var self = this;
        var arr = value.split("~");
        self.$emit("getRules", self.name, arr);
      }
    }
  };
</script>
