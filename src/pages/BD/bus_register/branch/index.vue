<template>
  <el-row class="panel-center">
    <el-col :span="20" :offset="2">
      <steps-component :steps="steps" :active="active"></steps-component>

      <!--商家搜索-->
      <el-col :span="20" :offset="2" v-show="currentView === 'busSearch'">
        <bus-search ref="busSearch" :filling="filling"
                    v-on:getPAN="getPAN" v-on:getCheck="getCheck"></bus-search>
        <el-col :span="24" class="bottomButton" style="padding-left:0;">
          <el-button size="large" type="primary" @click="next_step('basicInfo')">去开店</el-button>
        </el-col>
      </el-col>


      <!--基本信息-->
      <el-col :span="20" :offset="2" v-show="currentView === 'basicInfo'">
        <basic-info ref="basicChild" :filling="filling"
                    :name="PAN.name" :phonenum="PAN.phonenum"></basic-info>
        <el-col :span="24" class="bottomButton" style="padding-left: 20px;">
          <el-button size="large" type="primary" @click="previous_step('busSearch')">上一步</el-button>
          <el-button size="large" type="primary" @click="next_step('qualificationInfo')">下一步</el-button>
        </el-col>
      </el-col>


      <!--资质信息-->
      <el-col :span="20" :offset="2" v-show="currentView === 'qualificationInfo'">
        <qualification-info ref="quaChild" :filling="filling"></qualification-info>
        <el-col :span="24" class="bottomButton">
          <el-button size="large" type="primary" @click="previous_step('basicInfo')">上一步</el-button>
          <el-button size="large" type="primary" @click="next_step('showCheckInfo')">下一步</el-button>
        </el-col>
      </el-col>


      <!--结款信息-->
      <el-col :span="20" :offset="2" v-show="currentView === 'showCheckInfo'">
        <show-check-info :Bank="Bank" :ID="ID"></show-check-info>
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
  import busSearch from "../module/bus_search/index"
  import basicInfo from "../module/basic_info/index"
  import qualificationInfo from "../module/qualification_info/index"
  import showCheckInfo from "../module/show_check_info/index"
  import submitSuccess from "../module/submit_success/index"
  import dialogTips from "../../../../components/dialogTips/index.vue"
  import {BDREGISTER_BRAEDITFILLING_URL, BDREGISTER_BRAREGISTER_URL, BUSLIST_BASIC_URL,
    BUSLIST_ID_URL, BUSLIST_SETTLER_URL} from "../../../../common/interface"
  import {getUrlParameters, modalHide} from "../../../../common/common"

  export default{
    data() {
      return {
        filling: {},          // 基本信息填充
        Bank: {},             // 银行信息填充
        ID: {},               // 身份信息填充
        PAN: {                // 主账号
          name: "",           // 商家姓名
          phonenum: ""        // 商家手机
        },
        flag: false,          // 验证结果反馈
        isRight: true,       // 保存提示提示框
        tips: "保存成功！",
        tipsVisible: false,
        active: 1,                 // 激活步骤
        currentView: "busSearch",  // 当前步骤
        steps: [                   // 步骤条
          {
            index: 1,
            title: "商家搜索"
          }, {
            index: 2,
            title: "基本信息"
          }, {
            index: 3,
            title: "资质信息"
          }, {
            index: 4,
            title: "结款信息"
          }, {
            index: 5,
            title: "送审成功"
          }]
      }
    },
    mounted() {
      this.getBranchInfo()
    },
    methods: {
      // 获取分店注册信息
      getBranchInfo: function() {
        var self = this
        let id = getUrlParameters(window.location.hash, "id")
        if (id) {       // （修改）有填充信息
          self.$http.get(BDREGISTER_BRAEDITFILLING_URL + "?applynum=" + id)
            .then(function(response) {
              if (response.body.success) {
                self.filling = response.body.content
                self.PAN.name = response.body.content.userinfo.name
                self.PAN.phonenum = response.body.content.userinfo.phonenum
              }
            })
        }
      },
      // 商家搜索 获取主账号信息
      getPAN: function(busID) {
        var self = this
        self.$http.get(BUSLIST_BASIC_URL + "?bus_id=" + busID).then(function(response) {
          if (response.body.success) {
            let userInfo = response.body.content.userinfo
            self.PAN.name = userInfo.name
            self.PAN.phonenum = userInfo.phonenum
          }
        })
      },
      // 获取结款信息和身份信息
      getCheck: function(busAcc) {
        var self = this
        // 获取银行信息
        self.$http.get(BUSLIST_SETTLER_URL + "?account=" + busAcc).then(function(response) {
          if (response.body.success) {
            self.Bank = response.body.content
          }
        })
        // 获取身份信息
        self.$http.get(BUSLIST_ID_URL + "?account=" + busAcc).then(function(response) {
          if (response.body.success) {
            self.ID = response.body.content
          }
        })
      },
      // 下一步
      next_step: function(step, flag) {
        var self = this
        if (self.active === 1) {          // 商家搜索验证
          self.$refs.busSearch.busValidate(function() {
            self.active = self.active + 1
            self.currentView = step
          })
        } else {
          if (self.active === 2) {   // 基本信息验证
            self.$refs.basicChild.basicValidate()
          } else if (self.active === 3) {   // 资质信息验证
            self.$refs.quaChild.quaValidate()
          } else if (self.active === 4) {   // 结款信息验证
            var formData = {
              "step": "LAST",
              "applynum": getUrlParameters(window.location.hash, "id"),
              "type": flag   // 送审为"VERIFYING"，保存为"HANDLING"
            }
            self.$store.commit("V_FLAG", true)
            self.$store.commit("FORM_DATA", formData)
          }

          if (self.$store.state.vflag) {    // 验证成功
            self.$http.post(BDREGISTER_BRAREGISTER_URL,
              JSON.stringify(self.$store.state.form_data),
              {emulateJSON: true})
              .then(function(response) {
                if (response.body.success) {
                  if (!getUrlParameters(window.location.hash, "id")) {
                    window.location.hash += "#id=" + response.body.content.applynum
                  }
                  if (step === "save") {       // 保存
                    self.saveVisible = true
                    modalHide(function() {
                      self.saveVisible = false
                      self.$router.push({path: "/bus_register/branch"})
                    }, 1000)
                  } else {                    // 送审
                    self.active = self.active + 1
                    self.currentView = step
                  }
                  self.$store.commit("V_FLAG", false)
                }
              })
          }
        }
      },
      // 上一步
      previous_step: function(step) {
        var self = this
        if (self.active === 4) {
          self.active = self.active - 1
          self.currentView = "qualificationInfo"
        } else if (self.active === 3) {
          self.active = self.active - 1
          self.currentView = "basicInfo"
        } else if (self.active === 2) {
          self.active = self.active - 1
          self.currentView = "busSearch"
        }
      }
    },
    components: {
      stepsComponent,
      busSearch,
      basicInfo,
      qualificationInfo,
      showCheckInfo,
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
