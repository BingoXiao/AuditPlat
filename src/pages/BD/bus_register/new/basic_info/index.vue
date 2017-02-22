<template>
  <el-col :span="24">
    <el-form id="basicForm" :model="ruleForm" :rules="rules"
             ref="ruleForm" label-width="100px">
      <h3 class="formTitle">商家信息</h3>
      <el-col :span="8">
        <el-form-item label="商家姓名：" prop="name">
          <el-input v-model="ruleForm.name" name="userinfo.name"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="商家手机：" prop="phonenum">
          <el-input v-model="ruleForm.phonenum" name="userinfo.phonenum"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item label="商家分类：">
          <bus-class :options="bus_class"></bus-class>
        </el-form-item>
      </el-col>

      <br/>
      <h3 class="formTitle">门店信息</h3>
      <el-col :span="16">
        <el-form-item label="门店名称：" prop="busname">
          <el-input v-model="ruleForm.name" name="businfo.busname"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item label="门店座机：" prop="tel">
          <el-col :span="2">
            <el-input v-model="ruleForm.phonenum" name="businfo.tel"></el-input>
          </el-col>
          <el-col :span="4" :offset="1">
            <el-input v-model="ruleForm.phonenum" name="businfo.tel"></el-input>
          </el-col>
          <el-col :span="2" :offset="1">
            <el-input v-model="ruleForm.phonenum" name="businfo.tel"></el-input>
          </el-col>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item label="门店地址：">
          <bus-address :options="bus_address"></bus-address>
        </el-form-item>
      </el-col>

      <!--<el-col :span="16">-->
        <!--<el-form-item label="">-->
          <!---->
        <!--</el-form-item>-->
      <!--</el-col>-->

      <el-col :span="22" style="margin-left: 10px;">
        <b-map-component :point="address_point"></b-map-component>
      </el-col>
    </el-form>

    <el-col :span="24" class="buttonGroup">
      <el-button @click="getdatas">数据</el-button>
    </el-col>
  </el-col>
</template>

<script>
  import busClass from "../../../../../components/form/classification/index"
  import busAddress from "../../../../../components/form/address/index"
  import bMapComponent from "../../../../../components/form/BMap/index"

  export default{
    data() {
      return {
        bus_class: [],
        bus_address: [],
        address_point: [116.404, 39.915],
        ruleForm: {
          name: "",
          phonenum: "",
          busname: "",
          tel: "",
          address_details: ""
        },
        rules: {
          name: [
            {required: true, message: "请输入活动名称", trigger: "blur"}
          ]
        }
      }
    },
    components: {
      busClass,
      busAddress,
      bMapComponent
    },
    methods: {
      getdatas: function() {
        var form = document.getElementById("basicForm")
        var formData = new FormData(form)

        for (var pair of formData.entries()) {
          console.log(pair[0] + ", " + pair[1])
        }
      }
    }
  }
</script>

<style scoped>

</style>
