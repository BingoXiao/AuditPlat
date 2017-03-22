<template>
  <el-col :span="24">
    <el-col :span="3">
      <el-form-item>
        <el-input name="tel1" v-model="tel1" placeholder="区号"
                  @change="tel1_input"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="1" style="text-align: center">—</el-col>
    <el-col :span="4">
      <el-form-item>
        <el-input name="tel2" v-model="tel2" placeholder="门店号码"
                  @change="tel2_input"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="1" style="text-align: center">—</el-col>
    <el-col :span="3">
      <el-form-item>
        <el-input name="tel3" v-model="tel3" placeholder="分机号"
                  @change="tel3_input"></el-input>
      </el-form-item>
    </el-col>

    <span v-if="error" class="error">{{error}}</span>
  </el-col>
</template>

<script>
  export default{
    props: {
      tel: String
    },
    data() {
      return {
        tel1: "",
        tel2: "",
        tel3: "",
        error: ""
      };
    },
    watch: {
      tel: function() {
        var self = this;
        if (self.tel) {
          var arr = self.tel.split("-");
          self.tel1 = arr[0];
          self.tel2 = arr[1];
          if (arr.length > 2) {
            self.tel3 = arr[2];
          }
        }
      }
    },
    methods: {
      clear_error: function(flag, color) {
        var self = this;
        if (flag) {
          self.error = "";
        } else {
          self.error = "请选择商家分类";
        }
        document.getElementsByName("tel1")[0].style.borderColor = color;
        document.getElementsByName("tel2")[0].style.borderColor = color;
        document.getElementsByName("tel3")[0].style.borderColor = color;
      },
      // 号码验证
      error_validate: function(value, name) {
        var self = this;
        if (value !== "") {
          if (/^\s+$/.test(value)) {
            self.error = "请填写座机号码";
            document.getElementsByName(name)[0].style.borderColor = "#ff4949";
          } else if (!/^\d{1,}$/.test(value)) {
            self.error = "请填写正确的座机号码";
            document.getElementsByName(name)[0].style.borderColor = "#ff4949";
          }
        } else {
          self.error = "请填写座机号码";
          document.getElementsByName(name)[0].style.borderColor = "#ff4949";
        }
      },
      tel1_input: function() {
        this.clear_error(true, "rgb(191, 203, 217)");
      },
      tel2_input: function() {
        this.clear_error(true, "rgb(191, 203, 217)");
      },
      tel3_input: function() {
        this.clear_error(true, "rgb(191, 203, 217)");
      },
      telValidate: function(value) {
        var self = this;
        if (self.tel2 !== "") {
          self.error_validate(self.tel2, "tel2");
          self.error_validate(self.tel1, "tel1");
          if (self.tel3 !== "") {
            self.error_validate(self.tel3, "tel3");
          }
        } else {
          if (self.tel3 !== "" || self.tel1 !== "") {
            self.error = "请填写完整座机号码";
            document.getElementsByName("tel2")[0].style.borderColor = "#ff4949";
          }
        }
        if (!self.error) {
          self.clear_error(true, "rgb(191, 203, 217)");
          let telStr = "";    // 修改座机号码格式
          if (self.tel2) {
            if (self.tel3) {
              telStr = self.tel1 + "-" + self.tel2 + "-" + self.tel3;
            } else {
              telStr = self.tel1 + "-" + self.tel2;
            }
          }
          self.$emit("telValidate", "tel", telStr, true);
        }
      }
    }
  };
</script>

<style>

</style>
