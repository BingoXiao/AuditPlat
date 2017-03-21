<template>
  <el-row class="panel-center">
    <el-col :span="20" :offset="2">
      <steps-component :steps="steps" :active="active"></steps-component>

      <!--门店信息-->
      <el-col :span="20" :offset="2" v-show="currentView === 'storeInfo'">
        <store-info ref="storeChild" v-on:storeValidate="get_formDatas"></store-info>
        <el-col :span="24" class="bottomButton" style="padding-left: 20px;">
          <el-button size="large" type="primary" @click="next_step('coopInfo')">下一步</el-button>
        </el-col>
      </el-col>


      <!--结款信息-->
      <el-col :span="20" :offset="2" v-show="currentView === 'coopInfo'">
        <coop-info ref="coopChild" v-on:coopValidate="get_formDatas"></coop-info>
        <el-col :span="24" class="bottomButton">
          <el-button size="large" type="primary" @click="previous_step('storeInfo')">上一步</el-button>
          <el-button size="large" type="primary" @click="next_step('submitSuccess')">下一步</el-button>
        </el-col>
      </el-col>


      <!--提交审核成功-->
      <el-col :span="20" :offset="2" v-show="currentView === 'submitSuccess'">
        <submit-success></submit-success>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
  import stepsComponent from "../../components/steps/index"
  import storeInfo from "./module/store_info/index"
  import coopInfo from "./module/coop_info/index"
  import submitSuccess from "./module/submit_success/index"
  import {CNTER_REGISTER} from "../../common/interface"

  export default{
    data() {
      return {
        flag: false,          // 验证结果反馈
        active: 1,                 // 激活步骤
        currentView: "storeInfo",  // 当前步骤
        steps: [                   // 步骤条
          {
            index: 1,
            title: "门店信息"
          }, {
            index: 2,
            title: "合作信息"
          }, {
            index: 3,
            title: "提交成功"
          }],
        formDatas: {      // 表格数据
          userinfo: {},
          businfo: {},
          blinfo: {},
          slinfo: {}
        }
      }
    },
    methods: {
      // 获取数据
      get_formDatas: function(flag, datas) {
        var self = this
        if (flag) {   // 门店信息
          self.formDatas.businfo = datas
        } else {      // 合作信息
          self.formDatas.userinfo = datas.userinfo
          self.formDatas.blinfo = datas.blinfo
          self.formDatas.slinfo = datas.slinfo
          self.$set(self.formDatas.businfo, "group_buying_info", datas.businfo.group_buying_info)   // 团购
          self.$set(self.formDatas.businfo, "cost_per_person", datas.businfo.cost_per_person)       // 人均
          self.$set(self.formDatas.businfo, "sale_per_month", datas.businfo.sale_per_month)         // 月销售额
        }
      },
      // 下一步
      next_step: function(step) {
        var self = this
        if (step === "coopInfo") {
          self.$refs.storeChild.storeValidate()
        } else if (step === "submitSuccess") {
          self.$refs.coopChild.coopValidate()
        }
        if (self.$store.state.vflag) {    // 验证成功
          if (step === "submitSuccess") {  // 提交数据
            self.$http.post(CNTER_REGISTER,
              JSON.stringify(self.$store.state.form_data),
              {emulateJSON: true})
              .then(function(response) {
                if (response.body.success) {
                  self.active = self.active + 1
                  self.currentView = step
                  self.$store.commit("V_FLAG", false)
                }
              })
          } else {
            self.currentView = step
            self.active = self.active + 1
            self.$store.commit("V_FLAG", false)
          }
        }
      },

      // 上一步
      previous_step: function() {
        var self = this
        if (self.active === 2) {
          self.active = self.active - 1
          self.currentView = "storeInfo"
        }
      }
    },
    components: {
      stepsComponent,
      storeInfo,
      coopInfo,
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
