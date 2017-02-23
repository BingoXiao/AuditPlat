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
          <bus-classification ref="bus_class_children"></bus-classification>
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
        <tel-component ref="tel_children"></tel-component>
      </el-form-item>

      <el-form-item label="门店地址：" required>
        <bus-address></bus-address>
      </el-form-item>
    </el-form>

    <el-col :span="24"  class="buttonGroup">
      <el-button @click="basicNext('basicForm')">下一步</el-button>
    </el-col>
  </el-col>
</template>

<script>
  import busAddress from "../../../../../components/form/address/index"
  import busClassification from "../../../../../components/form/classification/index"
  import telComponent from "../../../../../components/form/tel/index"
  import {CATEGORY_URL, LCLASS_URL, SCLASS_URL,
    BDREGISTER_NEWREGISTER_URL} from "../../../../../common/interface"
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
        basicForm: {
          name: "",
          phonenum: "",
          busname: ""
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
      basicNext: function(formName) {
        var self = this
        self.$refs.bus_class_children.classValidate()
        self.$refs.tel_children.telValidate()
        self.$refs[formName].validate((valid) => {
          if (valid) {
//            var form = document.getElementById("basicForm")
//            var formData = new FormData(form)
//
//            self.$http.post(BDREGISTER_NEWREGISTER_URL, formData)
//              .then(function(response) {
//                if (response.data.success) {
//
//                }
//              })
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
