<template>
  <el-row>
    <el-col :span="24">
      <tab-component :tabs="tabs" :type="$route.params.type"
                     v-on:toggle="tabChange"></tab-component>
      <br/>
    </el-col>

    <el-col :span="24">
      <component :is="view" :tab="tabActive"></component>
    </el-col>
  </el-row>
</template>

<script>
  import tabComponent from "../../../components/tabs/router/index"
  import checkApply from "./check_apply/index"
  import checkApplyRecord from "./check_apply_record/index"
  import Hello from "../../Hello"

  export default {
    data() {
      return {
        tabs: [
          {
            param: "check_apply",
            name: "结款申请"
          },
          {
            param: "check_apply_record",
            name: "结款申请记录"
          },
          {
            param: "bank_account",
            name: "商家银行账户修改"
          },
          {
            param: "bank_account_record",
            name: "商家银行账户修改记录"
          }, {
            param: "refund",
            name: "操作退款"
          }, {
            param: "refund_record",
            name: "退款记录"
          }
        ],
        view: "",
        tabActive: ""
      }
    },
    beforeRouteEnter(to, from, next) {
      if (to.path === "/checkout_verify/:type") {
        next({path: "/checkout_verify/check_apply"})
      } else {
        next()
      }
    },
    mounted() {
      var self = this
      if (self.$route.params.type) {
        self.tabChange()
      }
    },
    methods: {
      // tab选择组件显示
      tabChange: function() {
        var self = this
        var type = self.$route.params.type
        if (type === "check_apply") {
          self.view = "checkApply"
        } else if (type === "check_apply_record") {
          self.view = "checkApplyRecord"
        } else {
          self.view = "Hello"
        }
      }
    },
    components: {
      tabComponent,
      checkApply,
      checkApplyRecord,
      Hello
    }
  }
</script>

<style scoped>

</style>
