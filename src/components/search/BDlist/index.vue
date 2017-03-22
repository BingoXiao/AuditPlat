<template>
  <el-select v-model="bd"
             ref="bdChild"
             clearable
             size="small"
             placeholder="请选择"
             @change="getRules">
    <el-option v-for="item in bdlist"
               :label="item.name"
               :value="item.bd_id"></el-option>
  </el-select>
</template>

<script>
  import {BDAPPLY_LIST_URL} from "../../../common/interface";

  export default{
    props: {
      name: String
    },
    data() {
      return {
        bdlist: [],
        bd: ""
      };
    },
    mounted() {
      this.get_bd_list();
    },
    methods: {
      /* 获取BD列表 */
      get_bd_list: function() {
        var self = this;
        self.$http.get(BDAPPLY_LIST_URL).then(function(response) {
          if (response.body.success) {
            self.bdlist = response.body.content;    // 筛选栏
          }
        });
      },
      getRules: function(value) {
        var self = this;
        var val = self.$refs.bdChild.selectedLabel;
        self.$emit("getRules", self.name, val);
      },
      reset: function() {
        var self = this;
        self.bd = "";
      }
    }
  };
</script>
