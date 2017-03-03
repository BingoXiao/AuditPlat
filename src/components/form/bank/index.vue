<template>
  <div>
    <el-col :span="24">
        <el-form-item label="开户行所在省市：" label-width="140px" required>
          <el-col :span="6">
            <el-form-item>
              <el-select name="admiprovince" placeholder="请选择省"
                         v-model="admiprovince_value" @change="get_admicity_list">
                <el-option
                  v-for="item in admiprovince_list"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-select name="admicity" placeholder="--市--"
                         v-model="admicity_value" @change="get_bank_list">
                <el-option
                  v-for="item in admicity_list"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <span v-if="error" class="error">{{error}}</span>
        </el-form-item>
    </el-col>

    <el-col :span="24">
      <el-col :span="8">
        <el-form-item label="银行名称：" required>
          <el-select name="bank" placeholder="--银行名称--"
                     v-model="bank_value" @change="get_branch_list">
            <el-option
              v-for="item in bank_list"
              :label="item.bank_name"
              :value="item.bank_id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="开户行名称：" label-width="120px" required>
          <el-col :span="15">
            <el-input v-show="branch_flag"  v-model="custom_branch"
                      name="custom_branch" @change="branchInput"></el-input>
            <el-select name="branch" placeholder="--开户行名称--"
                       v-show="!branch_flag" v-model="branch_value" @change="get_branch_data">
              <el-option
                v-for="item in branch_list"
                :label="item.subbank_name"
                :value="item.subbank_id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2" :offset="1">
            <el-checkbox v-model="branch_flag">自定义</el-checkbox>
          </el-col>
        </el-form-item>
      </el-col>
    </el-col>
  </div>
</template>

<script>
  import {BANK_PROVINCES_URL, BANK_CITIES_URL, BANKS_URL, SUBBANKS_URL} from "../../../common/interface"

  export default{
    props: {
      options: Array
    },
    data() {
      return {
        admiprovince_value: "",
        admicity_value: "",
        bank_value: "",
        branch_value: "",
        custom_branch: "",
        branch_flag: false,
        admiprovince_list: [],
        admicity_list: [],
        bank_list: [],
        branch_list: [],
        error: "",
        flag: true
      }
    },
    mounted() {
      var self = this
      self.get_admiprovince_list()
    },
    watch: {
      options: function() {
        var self = this
        if (self.options.length > 0) {
          self.flag = false
          self.admiprovince_value = parseInt(self.options[0])
        }
      }
    },
    methods: {
      // 根据开户行类型（是否为自定义）, 改变开户行错误样式
      branch_type: function(color) {
        var self = this
        if (self.branch_flag) {
          document.getElementsByName("custom_branch")[0].style.borderColor = color
        } else {
          document.getElementsByName("branch")[0].style.borderColor = color
        }
      },
      // 修改错误样式
      clear_error: function(flag, color) {
        var self = this
        if (flag) {
          self.error = ""
        } else {
          self.error = "请完善开户行信息"
        }
        document.getElementsByName("admiprovince")[0].style.borderColor = color
        document.getElementsByName("admicity")[0].style.borderColor = color
        document.getElementsByName("bank")[0].style.borderColor = color
        self.branch_type(color)
      },
      /* 获取银行省列表 */
      get_admiprovince_list: function() {
        var self = this
        self.$http.get(BANK_PROVINCES_URL).then(function(response) {
          if (response.body.success) {
            self.admiprovince_list = response.body.content
          }
        })
      },
      /* 获取银行市列表 */
      admicity_http: function(value) {
        var self = this
        self.admicity_value = ""
        self.bank_value = ""
        self.branch_value = ""
        self.$http.get(BANK_CITIES_URL + "?admiprovince_id=" + value).then(function(response) {
          if (response.body.success) {
            self.admicity_list = response.body.content
            if (!self.flag) {
              self.admicity_value = parseInt(self.options[1])
            }
          }
        })
      },
      get_admicity_list: function(value) {
        var self = this
        self.admicity_http(value)
        self.clear_error(true, "rgb(191, 203, 217)")
      },
      /* 获取银行列表 */
      bank_http: function() {
        var self = this
        self.bank_value = ""
        self.branch_value = ""
        if (self.bank_list.length < 1) {
          self.$http.get(BANKS_URL).then(function(response) {
            if (response.body.success) {
              self.bank_list = response.body.content
              if (!self.flag) {
                self.bank_value = parseInt(self.options[2])
              }
            }
          })
        }
      },
      get_bank_list: function(value) {
        var self = this
        if (value) {
          self.bank_http()
        }
        self.clear_error(true, "rgb(191, 203, 217)")
      },
      /* 获取支行列表 */
      branch_http: function(value) {
        var self = this
        self.branch_value = ""
        self.$http.get(SUBBANKS_URL + "?bank_id=" + value + "&admicity_id=" + self.admicity_value).then(function(response) {
          if (response.body.success) {
            self.branch_list = response.body.content
            if (!self.flag) {
              if (parseInt(self.options[3]) === 0) {   // 自定义支行
                self.branch_flag = true
                self.custom_branch = self.options[4]
              } else {
                self.branch_value = parseInt(self.options[3])
              }
              self.flag = true
            }
          }
        })
      },
      get_branch_list: function(value) {
        var self = this
        if (value) {
          self.branch_http(value)
        }
        self.clear_error(true, "rgb(191, 203, 217)")
      },
      /* 获取支行数据 */
      get_branch_data: function() {
        var self = this
        self.clear_error(true, "rgb(191, 203, 217)")
      },
      // 自定义支行名称输入
      branchInput: function() {
        var self = this
        self.clear_error(true, "rgb(191, 203, 217)")
      },
      /* 验证 */
      bankValidate: function() {
        var self = this
        if (self.admiprovince_value === "") {
          self.clear_error(false, "#ff4949")
        } else {
          if (self.admicity_value === "") {
            self.error = "请选择门店地址"
            document.getElementsByName("admicity")[0].style.borderColor = "#ff4949"
            document.getElementsByName("bank")[0].style.borderColor = "#ff4949"
            self.branch_type("#ff4949")
          } else {
            if (self.bank_value === "") {
              self.error = "请选择门店地址"
              document.getElementsByName("bank")[0].style.borderColor = "#ff4949"
              self.branch_type("#ff4949")
            } else {
              if (self.branch_flag) {   // 自定义支行
                if (self.custom_branch === "") {
                  self.error = "请填写开户行名称"
                  self.branch_type("#ff4949")
                } else {
                  self.clear_error(true, "rgb(191, 203, 217)")
                }
              } else {
                if (self.branch_value === "") {
                  self.error = "请选择门店地址"
                  self.branch_type("#ff4949")
                } else {
                  self.clear_error(true, "rgb(191, 203, 217)")
                }
              }
            }
          }
        }

        if (!self.error) {
          var value = null
          if (self.branch_flag) {
            value = [self.admiprovince_value, self.admicity_value, self.bank_value, 0, self.custom_branch]
          } else {
            value = [self.admiprovince_value, self.admicity_value, self.bank_value, self.branch_value, ""]
          }
          self.$emit("bankValidate", "bank", value, true)
        }
      }
    }
  }
</script>

<style scoped>

</style>
