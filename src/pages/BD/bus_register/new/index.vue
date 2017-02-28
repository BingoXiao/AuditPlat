<template>
  <el-row class="panel-center">
    <el-col :span="20" :offset="2">
      <steps-component :steps="steps" :active="active"></steps-component>

      <keep-alive>
        <el-col :span="20" :offset="2">
          <component ref="child" :is="currentView" :datas="datas"></component>
        </el-col>
      </keep-alive>
    </el-col>

    <el-col :span="16" :offset="4" v-if="active === 1">
      <el-button size="large" type="primary" @click="next_step('qualificationInfo')">下一步</el-button>
      <br/><br/><br/><br/>
    </el-col>

    <el-col :span="16" :offset="4" v-else-if="active === 2">
      <el-button size="large" type="primary" @click="previous_step('basicInfo')">上一步</el-button>
      <el-button size="large" type="primary" @click="next_step('checkoutInfo')">下一步</el-button>
      <br/><br/><br/><br/>
    </el-col>

    <el-col :span="16" :offset="4" v-else-if="active === 3">
      <el-button size="large" type="primary" @click="previous_step('qualificationInfo')">上一步</el-button>
      <el-button size="large" type="primary" @click="next_step('checkoutInfo')">下一步</el-button>
      <br/><br/><br/><br/>
    </el-col>

    <el-col :span="16" :offset="4" v-else-if="active === 4">
      <el-button size="large" type="primary" @click="previous_step('checkoutInfo')">上一步</el-button>
      <el-button size="large" type="primary" @click="next_step('submitSuccess')">下一步</el-button>
      <br/><br/><br/><br/>
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
        datas: {},
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
                self.datas = response.body.content
              }
            })
        }
      },

      // 下一步
      next_step: function(step) {
        var self = this
        if (self.active === 1) {   // 基本信息
          self.$refs.child.basicValidate()   // 验证
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
                  self.currentView = "qualificationInfo"
                  self.$store.commit("V_FLAG", false)
                }
              })
          }
        } else if (self.active === 2) {
          self.active = self.active + 1
          self.currentView = "checkoutInfo"
        } else if (self.active === 3) {
          self.active = self.active + 1
          self.currentView = "submitSuccess"
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

</style>
