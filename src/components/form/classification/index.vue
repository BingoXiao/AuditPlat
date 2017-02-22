<template>
  <div>
    <el-select v-model="lg_value" placeholder="合作行业" class="small" clearable
               @change="get_md_list" name="businfo.lclass_id">
      <el-option
        v-for="item in lg_list"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>

    <el-select v-model="md_value" placeholder="品类" class="small" clearable
               @change="get_sm_list" name="businfo.mclass_id">
      <el-option
        v-for="item in md_list"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>

    <el-select v-model="sm_value" placeholder="子类别" class="small" clearable
               v-show="smallVisible" name="businfo.sclass_id">
      <el-option
        v-for="item in sm_list"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>

  </div>
</template>

<script>
  import {CATEGORY_URL, LCLASS_URL, SCLASS_URL} from "../../../common/interface"

  export default{
    props: ["options"],
    data() {
      return {
        smallVisible: true,   // 三级分类显示
        lg_value: "",
        md_value: "",
        sm_value: "",
        lg_list: [],
        md_list: [],
        sm_list: []
      }
    },
    mounted: function() {
      var self = this
      self.get_lg_list()
      if (self.options.length > 0) {
        self.lg_value = self.options[0]
        self.md_value = self.options[1]
        self.sm_value = self.options[2]
      }
    },
    methods: {
      /* 获取合作行业列表 */
      get_lg_list: function() {
        var self = this
        self.$http.get(CATEGORY_URL).then(function(response) {
          if (response.data.success) {
            self.lg_list = response.data.content
          }
        })
      },

      /* 获取品类列表 */
      get_md_list: function(value) {
        var self = this
        self.smallVisible = true
        if (!value) {    // 清空"合作行业"
          self.md_list = []
          self.sm_list = []
          self.md_value = ""
          self.sm_value = ""
        } else {         // 选择
          self.$http.get(LCLASS_URL + "?lclass_id=" + value).then(function(response) {
            if (response.data.success) {
              self.md_list = response.data.content
            }
          })
        }
      },

      /* 获取子类别列表 */
      get_sm_list: function(value) {
        var self = this
        if (!value) {         // 清空"品类"
          self.sm_list = []
          self.sm_value = ""
        } else {         // 选择
          self.$http.get(SCLASS_URL + "?mclass_id=" + value).then(function(response) {
            if (response.data.success) {
              var list = response.data.content
              if (!list.length) {
                self.smallVisible = false
              } else {
                self.smallVisible = true
                self.sm_list = response.data.content
              }
            }
          })
        }
      }
    }
  }
</script>

<style scoped>
  .small {
    width: 130px;
  }
</style>
