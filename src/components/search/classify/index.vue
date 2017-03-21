<template>
  <div>
    <el-select v-model="lg_value"
               placeholder="合作行业"
               size="small"
               class="small"
               clearable
               @change="get_md_list">
      <el-option
        v-for="item in lg_list"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>

    <el-select ref="mdlist"
               v-model="md_value"
               placeholder="品类"
               size="small"
               class="small"
               clearable
               @change="get_sm_list">
      <el-option
        v-for="item in md_list"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>

    <el-select ref="smlist"
               v-model="sm_value"
               placeholder="子类别"
               size="small"
               class="small"
               clearable
               v-show="smallVisible"
               @change="get_sm_data">
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
    props: {
      name: String
    },
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
    },
    methods: {
      /* 获取合作行业列表 */
      get_lg_list: function() {
        var self = this
        self.$http.get(CATEGORY_URL).then(function(response) {
          if (response.body.success) {
            self.lg_list = response.body.content
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
            if (response.body.success) {
              self.md_list = response.body.content
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
            if (response.body.success) {
              var list = response.body.content
              if (!list.length) {
                self.smallVisible = false
              } else {
                self.smallVisible = true
                self.sm_list = response.body.content
              }
            }
          })
        }
        self.$emit("getRules", self.name, self.$refs.mdlist.selectedLabel)
      },
      get_sm_data: function(value) {
        var self = this
        self.$emit("getRules", self.name, self.$refs.mdlist.selectedLabel + self.$refs.smlist.selectedLabel)
      },
      reset: function() {
        var self = this
        self.lg_value = ""
        self.md_value = ""
        self.sm_value = ""
      }
    }
  }
</script>

<style scoped>
  .small {
    width: 130px;
  }
</style>
