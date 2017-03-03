<template>
  <el-row>
    <el-col :span="4">
      <el-form-item>
        <el-select name="lclass" placeholder="合作行业"
                   v-model="lg_value" @change="get_md_list">
          <el-option
            v-for="item in lg_list"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="4" class="selectOffset">
      <el-form-item>
        <el-select  name="mclass" placeholder="品类"
                    v-model="md_value" @change="get_sm_list">
          <el-option
            v-for="item in md_list"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="5" class="selectOffset">
      <el-form-item>
        <el-select name="sclass" placeholder="子类别"
                   v-model="sm_value" v-show="smallVisible" @change="get_sm_data">
          <el-option
            v-for="item in sm_list"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>

    <span v-if="error" class="error">{{error}}</span>
  </el-row>
</template>

<script>
  import {CATEGORY_URL, LCLASS_URL, SCLASS_URL} from "../../../common/interface"

  export default{
    props: {
      options: Array
    },
    data() {
      return {
        smallVisible: true,   // 三级分类显示
        lg_value: "",
        md_value: "",
        sm_value: "",
        lg_list: [],
        md_list: [],
        sm_list: [],
        error: "",
        flag: true
      }
    },
    mounted() {
      var self = this
      self.get_lg_list()
    },
    watch: {
      options: function() {
        var self = this
        if (self.options.length > 0) {
          self.flag = false
          self.lg_value = parseInt(self.options[0])
        }
      }
    },
    methods: {
      clear_error: function(flag, color) {
        var self = this
        if (flag) {
          self.error = ""
        } else {
          self.error = "请选择商家分类"
        }
        document.getElementsByName("lclass")[0].style.borderColor = color
        document.getElementsByName("mclass")[0].style.borderColor = color
        document.getElementsByName("sclass")[0].style.borderColor = color
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
      md_http: function(value) {
        var self = this
        self.smallVisible = true
        self.md_value = ""
        self.$http.get(LCLASS_URL + "?lclass_id=" + value).then(function(response) {
          if (response.body.success) {
            self.md_list = response.body.content
            if (!self.flag) {
              self.md_value = parseInt(self.options[1])
            }
          }
        })
      },
      get_md_list: function(value) {
        var self = this
        if (value) {
          self.md_http(value)
        }
        self.clear_error(true, "rgb(191, 203, 217)")
      },

      /* 获取子类别列表 */
      sm_http: function(value) {
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

              if (!self.flag) {
                self.sm_value = parseInt(self.options[2])
                self.flag = true
              }
            }
          }
        })
      },
      get_sm_list: function(value) {
        var self = this
        if (value) {
          self.sm_http(value)
        }
        self.clear_error(true, "rgb(191, 203, 217)")
      },

      /* 子类别数据改变时 */
      get_sm_data: function(value) {
        this.clear_error(true, "rgb(191, 203, 217)")
      },

      /* 分类验证 */
      classValidate: function() {
        var self = this
        if (self.lg_value === "") {
          self.clear_error(false, "#ff4949")
        } else {
          if (self.md_value === "") {
            self.error = "请选择商家分类"
            document.getElementsByName("mclass")[0].style.borderColor = "#ff4949"
            document.getElementsByName("sclass")[0].style.borderColor = "#ff4949"
          } else {
            if (self.sm_list.length > 0 && self.sm_value === "") {
              self.error = "请选择商家分类"
              document.getElementsByName("sclass")[0].style.borderColor = "#ff4949"
            } else {
              self.clear_error(true, "rgb(191, 203, 217)")
            }
          }
        }

        if (!self.error) {
          var value = [self.lg_value, self.md_value, self.sm_value]
          self.$emit("classValidate", "class", value, true)
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
