<template>
  <el-col :span="24">
    <el-form id="basicForm" :model="basicForm" :rules="basicRules"
             ref="basicForm" label-width="100px">
      <h3 class="formTitle">门店信息</h3>
      <el-form-item label="门店名称：" prop="busname" required>
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
  import busAddress from "../../../../components/form/address/index";
  import busClassification from "../../../../components/form/classification/index";
  import telComponent from "../../../../components/form/tel/index";

  export default{
    data() {
      return {
        moduleV: {         // 模块验证结果
          class: false,    // 分类
          tel: false,      // 座机
          address: false   // 地址
        },
        basicForm: {
          busname: "",     // 门店名称
          tel: "",         // 门店座机
          class: [],       // 分类
          address: {}      // 地址
        },
        basicRules: {
          busname: [
            {required: true, message: "请填写门店名称", trigger: "blur"}
          ]
        }
      };
    },
    methods: {
      // 模块验证结果及取值
      module_res: function(name, value, flag) {
        var self = this;
        self.moduleV[name] = flag;     // 返回模块验证结果
        self.basicForm[name] = value;   // 返回模块数据
      },
      // 基本信息验证
      storeValidate: function() {
        var self = this;
        self.$refs.tel_children.telValidate();            // 座机验证
        self.$refs.address_children.addressValidate();    // 地址验证
        self.$refs.basicForm.validate((valid) => {
          if (valid && self.moduleV.tel && self.moduleV.address) {
            var businfo = {
              "busname": self.basicForm.busname,      // 店铺名称
              "tel": self.basicForm.tel,                          // 店铺座机
              "province_id": self.basicForm.address.selectArr[0],  // 所在省
              "city_id": self.basicForm.address.selectArr[1],      // 所在城市
              "district_id": self.basicForm.address.selectArr[2],  // 所在区县
              "city_near_id": self.basicForm.address.selectArr[3], // 所属商圈
              "address_details": self.basicForm.address.detail, // 详细地址
              "address_point": self.basicForm.address.point     // 百度地图坐标
            };
            self.$store.commit("V_FLAG", true);
            self.$emit("storeValidate", true, businfo);
          }
        });
      }
    },
    components: {
      busAddress,
      busClassification,
      telComponent
    }
  };
</script>

<style scoped>

</style>
