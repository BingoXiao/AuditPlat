<template>
  <el-row>
    <el-col :span="24">
      <tab-component :tabs="tabs" :type="$route.params.type"
                     v-on:toggle="tabChange"></tab-component>
      <br/>
    </el-col>

    <el-col :span="24">
      <component :is="view" :tab="tabActive" v-on:tabChange="tabChange"></component>
    </el-col>
  </el-row>
</template>

<script>
  import tabComponent from "../../../components/tabs/router/index"
  import myCoupons from "./myCoupons/index"
  import addNewCoupons from "./addNewCoupons/index"

  export default {
    data() {
      return {
        tabs: [
          {
            param: "my_coupons",
            name: "我的优惠券"
          },
          {
            param: "add_new_coupons",
            name: "新增优惠券"
          }
        ],
        view: "",
        tabActive: ""
      }
    },
    beforeRouteEnter(to, from, next) {
      if (to.path === "/coupons_manage/:type") {
        next({path: "/coupons_manage/my_coupons"})
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
        if (type === "my_coupons") {
          self.view = "myCoupons"
        } else if (type === "add_new_coupons") {
          self.view = "addNewCoupons"
        }
      }
    },
    components: {
      tabComponent,
      myCoupons,
      addNewCoupons
    }
  }
</script>

<style scoped>

</style>
