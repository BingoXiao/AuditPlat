<template>
  <el-row>
    <el-col :span="24" v-if="$route.params.type==='specified_stores'">
      <specified-stores></specified-stores>
    </el-col>

    <el-col :span="24" v-else>
      <tab-component :tabs="tabs" :type="$route.params.type"
                     v-on:toggle="tabChange"></tab-component>
      <br/>
      <component :is="view"></component>
    </el-col>
  </el-row>
</template>

<script>
  import tabComponent from "../../../components/tabs/router/index";
  import myCoupons from "./myCoupons/index";
  import addNewCoupons from "./addNewCoupons/index";
  import specifiedStores from "./specified_stores/index";

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
        view: ""
      };
    },
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当钩子执行前，组件实例还没被创建
    beforeRouteEnter(to, from, next) {
      if (to.path === "/coupons_manage/:type") {
        next({path: "/coupons_manage/my_coupons"});
      } else {
        next();
      }
    },
    // 在当前路由改变，但是该组件被复用时调用
    // 可以访问组件实例 `this`
    beforeRouteUpdate(to, from, next) {
      if (to.path === "/coupons_manage/:type") {
        next({path: "/coupons_manage/my_coupons"});
      } else {
        next();
      }
      this.tabChange();
    },
    created() {
      var self = this;
      self.tabChange();
    },
    methods: {
      // tab选择组件显示
      tabChange: function(name) {
        var self = this;
        var type = self.$route.params.type;
        if (type === "my_coupons") {
          self.view = "myCoupons";
        } else if (type === "add_new_coupons") {
          self.view = "addNewCoupons";
        }
      }
    },
    components: {
      tabComponent,
      myCoupons,
      addNewCoupons,
      specifiedStores
    }
  };
</script>

<style scoped>

</style>
