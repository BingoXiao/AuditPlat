<template>
  <el-row class="panel-center">
    <el-col :span="20" :offset="2">
      <steps-component :steps="steps" :active="active"></steps-component>

      <keep-alive>
        <el-col :span="20" :offset="2">
          <component ref="child" :is="currentView"></component>
        </el-col>
      </keep-alive>
    </el-col>

    <el-col :span="24" class="buttonGroup" v-if="active === 1">
      <el-button @click="next_step('qualificationInfo')">下一步</el-button>
    </el-col>

    <!--<el-col :span="24" class="buttonGroup" v-if="active === 2">-->
      <!--<el-button @click="next_step('qualificationInfo')">下一步</el-button>-->
      <!--<el-button @click="previous_step('basicInfo')">上一步</el-button>-->
    <!--</el-col>-->
  </el-row>
</template>

<script>
  import stepsComponent from "../../../../components/steps/index"
  import basicInfo from "./basic_info/index"
  import qualificationInfo from "./qualification_info/index"
  import checkoutInfo from "./checkout_info/index"
  import submitSuccess from "./submit_success/index"
  import {BDREGISTER_NEWREGISTER_URL} from "../../../../common/interface"
  import {getUrlParameters, isName, isPhone} from "../../../../common/common"

  export default{
    data() {
      return {
        active: 1,
        flag: false,     // 验证结果反馈
        steps: [
          {
            index: 1,
            title: "基本信息"
          }, {
            index: 2,
            title: "资质信息"
          }, {
            index: 3,
            title: "结款信息"
          }, {
            index: 4,
            title: "送审成功"
          }],    // 步骤条
        currentView: "basicInfo"
      }
    },
    methods: {
      validateResponse: function(flag) {
        this.flag = flag
      },
      next_step: function(step) {
        var self = this
        if (self.active === 1) {   // 基本信息
          self.active = self.active + 1
          self.currentView = "qualificationInfo"
          console.log(getUrlParameters(window.location.hash, "id"))
//          window.location.hash = "#/bus_register/new/register#id=fsaui"
//          self.$refs.child.basicValidate()   // 验证
//          if (self.$store.state.vflag) {
//            alert("ok")
//            self.$http.post(BDREGISTER_NEWREGISTER_URL, self.$store.state.form_data)
//              .then(function(response) {
//                if (response.data.success) {
//                  self.active = self.active + 1
//                  self.currentView = step
//                }
//              })
//          }
        }
      },
      previous_step: function(step) {
        var self = this
        if (self.active > 1) {
          self.active = self.active - 1
          self.currentView = step
        }
      }
    },
    components: {
      stepsComponent,
      basicInfo,
      qualificationInfo,
      checkoutInfo,
      submitSuccess
    }
  }
</script>

<style scoped>

</style>
