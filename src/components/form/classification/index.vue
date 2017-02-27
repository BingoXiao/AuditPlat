<template>
  <el-col :span="24">
    <el-col :span="4">
      <el-form-item id="lclass">
        <el-select v-model="lg_value" placeholder="合作行业" ref="lclass" @change="get_md_list">
          <el-option
            v-for="item in lg_list"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="4" class="selectOffset">
      <el-form-item id="mclass">
        <el-select v-model="md_value" placeholder="品类" @change="get_sm_list">
          <el-option
            v-for="item in md_list"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="5" class="selectOffset">
      <el-form-item id="sclass">
        <el-select v-model="sm_value" placeholder="子类别"
                   v-show="smallVisible" @change="get_sm_data">
          <el-option
            v-for="item in sm_list"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>

    <span v-if="error" class="error">{{error}}</span>
  </el-col>
</template>

<script>
  import {CATEGORY_URL, LCLASS_URL, SCLASS_URL} from "../../../common/interface"

  export default{
//    props: ["options"],
    data() {
      return {
        smallVisible: true,   // 三级分类显示
        lg_value: "",
        md_value: "",
        sm_value: "",
        lg_list: [],
        md_list: [],
        sm_list: [],
        error: ""
      }
    },
    mounted: function() {
      var self = this
      self.get_lg_list()
//      if (self.options.length > 0) {
//        self.lg_value = self.options[0]
//        self.md_value = self.options[1]
//        self.sm_value = self.options[2]
//      }
    },
    methods: {
      clear_error: function() {
        var self = this
        self.error = ""
        document.getElementById("lclass").getElementsByTagName("input")[0].style.borderColor = "rgb(191, 203, 217)"
        document.getElementById("mclass").getElementsByTagName("input")[0].style.borderColor = "rgb(191, 203, 217)"
        document.getElementById("sclass").getElementsByTagName("input")[0].style.borderColor = "rgb(191, 203, 217)"
      },
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
        self.md_value = ""
        self.$http.get(LCLASS_URL + "?lclass_id=" + value).then(function(response) {
          if (response.body.success) {
            self.md_list = response.body.content
          }
        })
        self.clear_error()
      },
      /* 获取子类别列表 */
      get_sm_list: function(value) {
        var self = this
        self.sm_value = ""
        self.$http.get(SCLASS_URL + "?mclass_id=" + value).then(function(response) {
          if (response.body.success) {
            var list = response.body.content
            if (!list.length) {
              self.smallVisible = false
              self.sm_list = ""
            } else {
              self.smallVisible = true
              self.sm_list = response.body.content
            }
          }
        })
        self.clear_error()
      },
      /* 子类别数据改变时 */
      get_sm_data: function(value) {
        this.clear_error()
      },
      /* 分类验证 */
      classValidate: function() {
        var self = this
        if (self.lg_value === "") {
          self.error = "请选择商家分类"
          document.getElementById("lclass").getElementsByTagName("input")[0].style.borderColor = "#ff4949"
          document.getElementById("mclass").getElementsByTagName("input")[0].style.borderColor = "#ff4949"
          document.getElementById("sclass").getElementsByTagName("input")[0].style.borderColor = "#ff4949"
        } else {
          if (self.md_value === "") {
            self.error = "请选择商家分类"
            document.getElementById("mclass").getElementsByTagName("input")[0].style.borderColor = "#ff4949"
            document.getElementById("sclass").getElementsByTagName("input")[0].style.borderColor = "#ff4949"
          } else {
            if (self.sm_list.length > 0 && self.sm_value === "") {
              self.error = "请选择商家分类"
              document.getElementById("sclass").getElementsByTagName("input")[0].style.borderColor = "#ff4949"
            } else {
              self.clear_error()
            }
          }
        }

        if (!self.error) {
          var para = {
            name: "class",
            value: [self.lg_value, self.md_value, self.sm_value]
          }
          self.$emit("classValidate", "class_flag", para, true)
        } else {
          self.$emit("classValidate", "class_flag", false)
        }
      }
    }
  }
</script>

<style scoped>
  .selectOffset{
    margin-left: 15px;
  }
</style>
