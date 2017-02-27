<template>
  <el-col :span="24">
    <el-form id="basicForm" :model="basicForm" :rules="basicRules"
             ref="basicForm" label-width="100px">
      <h3 class="formTitle">商家信息</h3>
      <el-col :span="8">
        <el-form-item label="商家姓名：" prop="name" required>
          <el-input v-model="basicForm.name" name="userinfo.name"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="7" :offset="1">
        <el-form-item label="商家手机：" prop="phonenum" required>
          <el-input v-model="basicForm.phonenum" name="userinfo.phonenum"></el-input>
        </el-form-item>
      </el-col>

      <!--商家分类-->
      <el-col :span="24">
        <el-form-item label="商家分类：" required>
          <bus-classification ref="bus_class_children" v-on:classValidate="module_res"></bus-classification>
        </el-form-item>
      </el-col>

      <br/>
      <h3 class="formTitle">门店信息</h3>
      <el-form-item label="门店名称：" prop="busname">
        <el-col :span="14">
          <el-input v-model="basicForm.busname" name="businfo.busname"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="门店座机：">
        <tel-component ref="tel_children" v-on:telValidate="module_res"></tel-component>
      </el-form-item>

      <el-form-item label="门店地址：" required>
        <bus-address ref="address_children" v-on:addressValidate="module_res"></bus-address>
      </el-form-item>
    </el-form>
  </el-col>
</template>

<script>
  import busAddress from "../../../../../components/form/address/index"
  import busClassification from "../../../../../components/form/classification/index"
  import telComponent from "../../../../../components/form/tel/index"
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
      // 商家手机
      var phoneV = (rule, value, callback) => {
        var Phone = isPhone(value)
        if (!Phone.flag) {
          callback(new Error(Phone.error))
        } else {
          callback()
        }
      }

      return {
        moduleV: {
          class_flag: false,
          tel_flag: false,
          address_flag: false
        },
        basicForm: {
          name: "",
          phonenum: "",
          busname: "",
          tel: "",
          class: [],
          address: {}
        },
        basicRules: {
          name: [
            {validator: nameV, trigger: "blur"}
          ],
          phonenum: [
            {validator: phoneV, trigger: "blur"}
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
        self.$refs.bus_class_children.classValidate()
        self.$refs.tel_children.telValidate()
        self.$refs.address_children.addressValidate()
        self.$refs.basicForm.validate((valid) => {
          if (valid && self.moduleV.class_flag && self.moduleV.tel_flag && self.moduleV.address_flag) {
            var form = document.getElementById("basicForm")
            var formData = new FormData(form)
            formData.append("step", "BASE")
            formData.append("applynum", "self.$router.path")
            formData.append("businfo.lclass_id", self.class[0])
            formData.append("businfo.mclass_id", self.class[1])
            formData.append("businfo.sclass_id", self.class[2])
            formData.append("businfo.province_id", self.address.select[0])
            formData.append("businfo.city_id", self.address.select[1])
            formData.append("businfo.district_id", self.address.select[2])
            formData.append("businfo.address_details", self.address.select[3])
            formData.append("businfo.address_point", self.address.point)
            self.$store.commit("FORM_DATA", formData)
            self.$store.commit("V_FLAG", true)
//            for (var pair of self.$store.state.form_data) {
//              console.log(pair[0] + ", " + pair[1])
//            }
          }
        })
      }
    },
    components: {
      busAddress,
      busClassification,
      telComponent
    }
  }
</script>

<style scoped>

</style>
