<template>
  <el-col :span="24">
    <el-form id="basicForm" :model="basicForm" :rules="basicRules"
             ref="basicForm" label-width="100px">
      <h3 class="formTitle">资质信息</h3>
      <el-col :span="8">
        <el-form-item label="商家姓名：" prop="name" required>
          <el-input v-model="basicForm.name" name="userinfo.name"></el-input>
        </el-form-item>
      </el-col>

      <el-form-item label="门店名称：" prop="busname">
        <el-col :span="14">
          <el-input v-model="basicForm.busname" name="businfo.busname"></el-input>
        </el-col>
      </el-form-item>
    </el-form>
  </el-col>
</template>

<script>
  import busAddress from "../../../../../components/form/address/index"
  import {BDREGISTER_NEWREGISTER_URL} from "../../../../../common/interface"
  import {isName, isPhone} from "../../../../../common/common"

  export default{
    data() {
      // 商家姓名
      var nameV = (rule, value, callback) => {
        var Name = isName(value)
        if (!Name.flag) {
          callback(new Error(Name.error))
        } else {
          callback()
        }
      }

      return {
        moduleV: {
          tel_flag: false
        },
        basicForm: {
          name: "",
          busname: ""
        },
        basicRules: {
          name: [
            {validator: nameV, trigger: "blur"}
          ],
          busname: [
            {required: true, message: "请填写门店名称", trigger: "blur"}
          ]
        }
      }
    },
    methods: {
      module_res: function(name, para, flag) {
        var self = this
        self.moduleV[name] = flag
        if (arguments.length > 2) {   // 获取表单模块中的值
          if (para.name === "tel") {
            self.tel = para.value
          } else if (para.name === "class") {
            self.class = para.value
          } else {
            self.address = para.value
          }
        }
      },
      basicValidate: function() {
        var self = this
//        self.$refs.bus_class_children.classValidate()
//        self.$refs.basicForm.validate((valid) => {
//          if (valid && self.moduleV.class_flag && self.moduleV.tel_flag && self.moduleV.address_flag) {
//            var form = document.getElementById("basicForm")
//            var formData = new FormData(form)
//            formData.append("step", "BASE")
//            self.$store.commit("FORM_DATA", formData)
//            self.$store.commit("V_FLAG", true)
  //            for (var pair of self.$store.state.form_data) {
  //              console.log(pair[0] + ", " + pair[1])
  //            }
//          }
//        })
      },
      components: {
        busAddress
      }
    }
  }
</script>

<style scoped>

</style>
