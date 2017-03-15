<template>
  <el-row class="panel-center">
    <el-col :span="20" :offset="2">
      <steps-component :steps="steps" :active="active"></steps-component>

      <!--基本信息-->
      <el-col :span="20" :offset="2" v-show="currentView === 'basicInfo'">
        <basic-info ref="basicChild" :filling="filling"
                    :name="PAN.name" :phonenum="PAN.phonenum"></basic-info>
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
        <checkout-info ref="checkChild" :filling="filling"></checkout-info>
        <el-col :span="24" class="bottomButton">
          <el-button size="large" type="primary" @click="next_step('submitSuccess', 'VERIFYING')">送 审</el-button>
          <el-button size="large" type="primary" @click="next_step('save', 'HANDLING')">储存并待处理</el-button>
          <el-button size="large" type="primary" @click="previous_step('qualificationInfo')">上一步</el-button>
        </el-col>
      </el-col>


      <!--提交审核成功-->
      <el-col :span="20" :offset="2" v-show="currentView === 'submitSuccess'">
        <submit-success></submit-success>
      </el-col>
    </el-col>


    <!--提示-->
    <dialogTips :isRight="isRight" :tips="tips" :tipsVisible="tipsVisible"></dialogTips>
  </el-row>
</template>

<script>
  import stepsComponent from "../../../../components/steps/index"
  import basicInfo from "../module/basic_info/index"
  import qualificationInfo from "../module/qualification_info/index"
  import checkoutInfo from "../module/checkout_info/index"
  import submitSuccess from "../module/submit_success/index"
  import dialogTips from "../../../../components/dialogTips/index.vue"
  import {BDREGISTER_APPLFILLING_URL, BDREGISTER_EDITFILLING_URL,
    BDREGISTER_NEWREGISTER_URL} from "../../../../common/interface"
  import {getUrlParameters, modalHide} from "../../../../common/common"

  export default{
    data() {
      return {
        filling: {},          // 注册信息填充
        PAN: {                // 主账号
          name: "",           // 商家姓名
          phonenum: ""        // 商家手机
        },
        flag: false,          // 验证结果反馈
        isRight: true,       // 保存提示提示框
        tips: "保存成功！",
        tipsVisible: false,
        active: 1,                 // 激活步骤
        currentView: "basicInfo",  // 当前步骤
        steps: [                   // 步骤条
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
          }]
      }
    },
    mounted() {
      this.getNewInfo()
    },
    methods: {
      // 获取新店注册信息
      getNewInfo: function() {
        var self = this
        let id = getUrlParameters(window.location.hash, "id")
        if (id) {   // 有填充信息
          if (self.$route.name === "商家申请注册详情页") {
            self.$http.get(BDREGISTER_APPLFILLING_URL + "?applynum=" + id)
              .then(function(response) {
                if (response.body.success) {
                  self.filling = response.body.content
                  self.PAN.name = response.body.content.userinfo.name
                  self.PAN.phonenum = response.body.content.userinfo.phonenum
                }
              })
          } else {
            self.$http.get(BDREGISTER_EDITFILLING_URL + "?applynum=" + id)
              .then(function(response) {
                if (response.body.success) {
                  self.filling = response.body.content
                  self.PAN.name = response.body.content.userinfo.name
                  self.PAN.phonenum = response.body.content.userinfo.phonenum
                }
              })
          }
        }
      },

      // 下一步
      next_step: function(step, flag) {
        var self = this
        if (self.active === 1) {          // 基本信息验证
          self.$refs.basicChild.basicValidate()
        } else if (self.active === 2) {   // 资质信息验证
          self.$refs.quaChild.quaValidate()
        } else if (self.active === 3) {   // 结款信息验证
          self.$refs.checkChild.checkValidate(flag)
        }
        if (self.$store.state.vflag) {    // 验证成功
          self.$http.post(BDREGISTER_NEWREGISTER_URL,
            JSON.stringify(self.$store.state.form_data),
            {emulateJSON: true})
            .then(function(response) {
              if (response.body.success) {
                if (!getUrlParameters(window.location.hash, "id")) {
                  window.location.hash += "#id=" + response.body.content.applynum
                }
                if (step === "save") {       // 保存
                  self.tipsVisible = true
                  modalHide(function() {
                    self.tipsVisible = false
                    if (self.$route.name === "商家申请注册详情页") {
                      self.$router.push({path: "/bus_register/apply"})
                    } else if (self.$route.name === "新店注册详情页") {
                      self.$router.push({path: "/bus_register/new"})
                    }
                  }, 1000)
                } else {                    // 送审
                  self.active = self.active + 1
                  self.currentView = step
                }
                self.$store.commit("V_FLAG", false)
              }
            })
        }
      },

      // 上一步
      previous_step: function(step) {
        var self = this
        if (self.active === 3) {
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
      submitSuccess,
      dialogTips
    }
  }
</script>

<style scoped>
  .bottomButton{
    padding-top: 10px;
    padding-bottom: 50px;
  }
</style>
