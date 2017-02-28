<template>
  <el-col :span="24">
    <el-col :span="3">
      <el-form-item>
        <el-input id="tel1" v-model="tel1" placeholder="区号"
                  @change="tel1_input"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="1" style="text-align: center">—</el-col>
    <el-col :span="4">
      <el-form-item>
        <el-input id="tel2" v-model="tel2" placeholder="门店号码"
                  @change="tel2_input"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="1" style="text-align: center">—</el-col>
    <el-col :span="3">
      <el-form-item>
        <el-input id="tel3" v-model="tel3" placeholder="分机号"
                  @change="tel3_input"></el-input>
      </el-form-item>
    </el-col>

    <span v-if="error" class="error">{{error}}</span>
  </el-col>
</template>

<script>
  export default{
    data() {
      return {
        tel1: "",
        tel2: "",
        tel3: "",
        error: ""
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
        document.getElementById("tel1").style.borderColor = color
        document.getElementById("tel2").style.borderColor = color
        document.getElementById("tel3").style.borderColor = color
      },
      error_validate: function(value, name) {
        var self = this
        if (value === "") {
          this.clear_error(true, "rgb(191, 203, 217)")
        } else {
          if (/^\d{1,}$/.test(value)) {
            this.clear_error(true, "rgb(191, 203, 217)")
          } else {
            self.error = "号码格式不正确"
            document.getElementById(name).style.borderColor = "#ff4949"
          }
        }
      },
      tel1_input: function() {
        this.clear_error(true, "rgb(191, 203, 217)")
      },
      tel2_input: function() {
        this.clear_error(true, "rgb(191, 203, 217)")
      },
      tel3_input: function() {
        this.clear_error(true, "rgb(191, 203, 217)")
      },
      telValidate: function(value) {
        var self = this
        if (self.tel2 !== "") {
          self.error_validate(self.tel2, "tel2")
          if (self.tel1 !== "") {
            self.error_validate(self.tel1, "tel1")
          }
          if (self.tel3 !== "") {
            self.error_validate(self.tel3, "tel3")
          }
        } else {
          if (self.tel1 !== "" || self.tel3 !== "") {
            self.error = "号码格式不正确"
            document.getElementById("tel2").style.borderColor = "#ff4949"
          } else {
            self.clear_error(true, "rgb(191, 203, 217)")
          }
        }

        if (!self.error) {
          var para = {
            name: "tel",
            value: self.tel1 + self.tel2 + self.tel3
          }
          self.$emit("telValidate", "tel_flag", para, true)
        } else {
          self.$emit("telValidate", "tel_flag", false)
        }
      }
    }
  }
</script>

<style>

</style>
