<template>
  <el-col :span="24">
    <el-form id="basicForm" :model="basicForm" :rules="basicRules"
             ref="basicForm" label-width="100px">
      <h3 class="formTitle">商家信息</h3>
      <el-col :span="8">
        <el-form-item label="商家姓名：" prop="name" required>
          <el-input v-model="basicForm.name"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="7" :offset="1">
        <el-form-item label="商家手机：" prop="phonenum" required>
          <el-input v-model="basicForm.phonenum"></el-input>
        </el-form-item>
      </el-col>

      <!--商家分类-->
      <el-col :span="24">
        <el-form-item label="商家分类：" required>
          <bus-classification ref="bus_class_children" :options="basicForm.class"
                              v-on:classValidate="module_res"></bus-classification>
        </el-form-item>
      </el-col>

      <br/>
      <h3 class="formTitle">门店信息</h3>
      <el-form-item label="门店名称：" prop="busname">
        <el-col :span="14">
          <el-input v-model="basicForm.busname"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="门店座机：">
        <tel-component ref="tel_children" :tel="basicForm.tel"
                       v-on:telValidate="module_res"></tel-component>
      </el-form-item>

      <el-form-item label="门店地址：" required>
        <bus-address ref="address_children" :options="basicForm.address"
                     v-on:addressValidate="module_res"></bus-address>
      </el-form-item>
    </el-form>
  </el-col>
</template>

<script>
  import busAddress from "../../../../../components/form/address/index"
  import busClassification from "../../../../../components/form/classification/index"
  import telComponent from "../../../../../components/form/tel/index"
  import {isName, isPhone, getUrlParameters} from "../../../../../common/common"

  export default{
    props: {
      filling: Object
    },
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
    watch: {
      filling: function() {
        var self = this
        var userinfo = self.filling.userinfo
        var businfo = self.filling.businfo
        self.basicForm.name = userinfo.name          // 商家姓名
        self.basicForm.phonenum = userinfo.phonenum  // 商家手机
        self.basicForm.busname = businfo.busname     // 门店名称
        self.basicForm.tel = businfo.tel             // 门店名称
        let classArr = businfo.lclass_id + "," + businfo.mclass_id + "," + businfo.sclass_id
        self.basicForm.class = classArr.split(",")        // 分类
        let addArr = businfo.province_id + "," + businfo.city_id + "," +
          businfo.district_id + "," + businfo.city_near_id
        self.$set(self.basicForm.address, "select", addArr.split(","))
        self.$set(self.basicForm.address, "detail", businfo.address_details)
        self.$set(self.basicForm.address, "point", businfo.address_point)
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
            var formData = {
              "step": "BASE",
              "applynum": "",
              "userinfo": {
                "name": self.basicForm.name,            // 商家姓名
                "phonenum": self.basicForm.phonenum     // 商家手机
              },
              "businfo": {
                "tel": self.basicForm.tel,              // 店铺座机
                "busname": self.basicForm.busname,      // 店铺名称
                "province_id": self.address.select[0],  // 所在省
                "city_id": self.address.select[1],      // 所在城市
                "district_id": self.address.select[2],  // 所在区县
                "city_near_id": self.address.select[3], // 所属商圈
                "address_details": self.address.detail, // 详细地址
                "address_point": self.address.point,    // 百度地图坐标
                "lclass_id": self.class[0],             // 一级分类
                "mclass_id": self.class[1],             // 二级分类
                "sclass_id": self.class[2]              // 三级分类
              }
            }
            let id = getUrlParameters(window.location.hash, "id")
            if (id) {
              formData.applynum = id
            }
            self.$store.commit("FORM_DATA", formData)
            self.$store.commit("V_FLAG", true)
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
