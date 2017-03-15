<template>
  <el-select v-model="bd" clearable size="small" ref="aaa"
             placeholder="请选择" @change="bd_filter">
    <el-option v-for="item in bdlist" :label="item.name" :value="item.bd_id"></el-option>
  </el-select>
</template>

<script>
  import {BDAPPLY_LIST_URL} from "../../../common/interface"

  export default{
    data() {
      return {
        bdlist: [],
        bd: ""
      }
    },
    mounted() {
      this.get_bd_list()
    },
    methods: {
      /* 获取BD列表 */
      get_bd_list: function() {
        var self = this
        self.$http.get(BDAPPLY_LIST_URL).then(function(response) {
          if (response.body.success) {
            self.bdlist = response.body.content    // 筛选栏
          }
        })
      },
      bd_filter: function(value) {
        var self = this
        self.bd = value
        self.$emit("bd_filter", value)
      }
    }
  }
</script>
