<template>
  <el-row class="panel-center">
    <el-col :span="20" :offset="2">
      <steps-component :steps="steps" :active="active"></steps-component>

      <!--基本信息-->
      <el-col :span="20" :offset="2" v-show="currentView === 'basicInfo'">
        <basic-info ref="basicChild" :filling="filling"></basic-info>
        <el-col :span="24" class="bottomButton" style="padding-left: 20px;">
          <el-button size="large" type="primary" @click="next_step('qualificationInfo')">下一步</el-button>
        </el-col>
      </el-col>


      <!--资质信息-->
      <el-col :span="20" :offset="2" v-show="currentView === 'qualificationInfo'">
        <qualification-info ref="quaChild" :filling="filling"></qualification-info>
        <el-col :span="24" class="bottomButton">
          <el-button size="large" type="primary" @click="previous_step('basicInfo')">上一步</el-button>
          <el-button size="large" type="primary" @click="next_step('checkoutInfo')">下一步</el-button>
        </el-col>
      </el-col>


      <!--结款信息-->
      <el-col :span="20" :offset="2" v-show="currentView === 'checkoutInfo'">
        <checkout-info></checkout-info>
        <el-col :span="24" class="bottomButton">
          <el-button size="large" type="primary" @click="previous_step('qualificationInfo')">上一步</el-button>
          <el-button size="large" type="primary" @click="next_step('checkoutInfo')">下一步</el-button>
        </el-col>
      </el-col>


      <!--提交审核成功-->
      <el-col :span="20" :offset="2" v-show="currentView === 'submitSuccess'">
        <submit-success></submit-success>
        <el-col :span="24" class="bottomButton">
          <el-button size="large" type="primary" @click="previous_step('checkoutInfo')">上一步</el-button>
          <el-button size="large" type="primary" @click="next_step('submitSuccess')">下一步</el-button>
          <br/><br/><br/><br/>
        </el-col>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
  import stepsComponent from "../../../../components/steps/index"
  import basicInfo from "./basic_info/index"
  import qualificationInfo from "./qualification_info/index"
  import checkoutInfo from "./checkout_info/index"
  import submitSuccess from "./submit_success/index"
  import {BDREGISTER_EDITFILLING_URL, BDREGISTER_NEWREGISTER_URL} from "../../../../common/interface"
  import {getUrlParameters} from "../../../../common/common"

  export default{
    data() {
      return {
        filling: {},
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
    mounted() {
      this.getNewInfo()
    },
    methods: {
      // 获取新店信息
      getNewInfo: function() {
        var self = this
        let id = getUrlParameters(window.location.hash, "id")
        if (id) {
          self.$http.get(BDREGISTER_EDITFILLING_URL + "?applynum=" + id)
            .then(function(response) {
              if (response.body.success) {
                self.filling = response.body.content
              }
            })
        }
      },

      // 下一步
      next_step: function(step) {
        var self = this
        if (self.active === 1) {
          self.$refs.basicChild.basicValidate()   // 基本信息
        } else if (self.active === 2) {
          self.$refs.quaChild.quaValidate()       // 资质信息
        } else if (self.active === 3) {
          self.active = self.active + 1
        }

        if (self.$store.state.vflag) {
          self.$http.post(BDREGISTER_NEWREGISTER_URL,
            JSON.stringify(self.$store.state.form_data),
            {emulateJSON: true})
            .then(function(response) {
              if (response.body.success) {
                if (!getUrlParameters(window.location.hash, "id")) {
                  window.location.hash += "#id=" + response.body.content.applynum
                }
                self.active = self.active + 1
                self.currentView = step
                self.$store.commit("V_FLAG", false)
              }
            })
        }
      },

      // 上一步
      previous_step: function(step) {
        var self = this
        if (self.active === 4) {
          self.active = self.active - 1
          self.currentView = "checkoutInfo"
        } else if (self.active === 3) {
          self.active = self.active - 1
          self.currentView = "qualificationInfo"
        } else if (self.active === 2) {
          self.active = self.active - 1
          self.currentView = "basicInfo"
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
  .bottomButton{
    padding-top: 10px;
    padding-bottom: 50px;
  }
</style>
