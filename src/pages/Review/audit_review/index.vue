<template>
  <el-row class="panel">
    <el-col :span="24">
      <tab-component :tabs="tabs" :type="$route.params.type"
                     v-on:toggle="tabChange"></tab-component>
      <br/>
    </el-col>

    <el-col :span="24">
      <component :is="view"></component>
    </el-col>
  </el-row>
</template>

<script>
  import tabComponent from "../../../components/tabs/router/index"
  import checkApply from "./check_apply/index"
  import checkApplyRecord from "./check_apply_record/index"
  import bankAccount from "./bank_account/index"
  import bankAccountRecord from "./bank_account_record/index"
  import refund from "./refund/index"
  import refundRecord from "./refund_record/index"

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
        view: ""
      }
    },
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当钩子执行前，组件实例还没被创建
    beforeRouteEnter(to, from, next) {
      if (to.path === "/checkout_verify/:type") {
        next({path: "/checkout_verify/check_apply"})
      } else {
        next()
      }
    },
    // 在当前路由改变，但是该组件被复用时调用
    // 可以访问组件实例 `this`
    beforeRouteUpdate(to, from, next) {
      if (to.path === "/checkout_verify/:type") {
        next({path: "/checkout_verify/check_apply"})
      } else {
        next()
      }
      this.tabChange()
    },
    mounted() {
      var self = this
      self.tabChange()
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
        } else if (type === "bank_account") {
          self.view = "bankAccount"
        } else if (type === "bank_account_record") {
          self.view = "bankAccountRecord"
        } else if (type === "refund_record") {
          self.view = "refundRecord"
        } else {
          self.view = "refund"
        }
      }
    },
    components: {
      tabComponent,
      checkApply,
      checkApplyRecord,
      bankAccount,
      bankAccountRecord,
      refundRecord,
      refund
    }
  }
</script>

<style scoped>

</style>
