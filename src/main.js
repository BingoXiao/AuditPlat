// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./router/index";
import store from "./vuex/store";
import VueResource from "vue-resource";
// import "element-ui/lib/theme-default/index.css";
import "../theme/index.css";
import ElementUI from "element-ui";
import "./assets/font/iconfont.css";
import "./common/style.css";
import App from "App";
import {AUTO_LOGIN_URL} from "./common/interface";
import {getCookie, clearCookie} from "./common/common";

// Router
Vue.use(VueRouter);

// 引入Element 组件
Vue.use(ElementUI);

// Resource
Vue.use(VueResource);

// 创建路由
const router = new VueRouter({
  mode: "history",
  routes: routes
});

router.beforeEach((to, from, next) => {
  if (to.path === "/login") {    /* 进入首页 */
    let remember = getCookie("REMEMBER");
    if (remember === "1") {   // 自动登陆
      Vue.http.get(AUTO_LOGIN_URL).then(function(response) {
        if (response.body.success) {
          /*  记录状态 */
          var perms = response.body.content.perms;
          store.commit("USER_ID", response.body.content.id);
          store.commit("USER_NAME", response.body.content.account);
          store.commit("AUTH_LOGIN", true);
          store.commit("USER_DATA", perms);
          /* 根据权限进入不同得页面 */
          if (perms.item_list === 1) { /* 管理员账号 */
            next({path: "/setting"});
          } else {   /* BD */
            if (perms.bus_apply === 1 || perms.bus_register === 1) {
              if (perms.bus_apply === 1) {
                next({path: "/bus_apply"});
              } else {
                next({path: "/bus_register/:type"});
              }
            } else {  /* 审核人员 */
              if (perms.bus_verify === 1 || perms.checkout_verify === 1 || perms.project_verify === 1) {
                if (perms.bus_verify === 1) {
                  next({path: "/bus_review/:type"});
                } else if (perms.checkout_verify === 1) {
                  next({path: "/checkout_verify/:type"});
                } else {
                  next({path: "/project_verify/:type"});
                }
              }
            }
          }
        }
      });
    } else {
      next();
    }
  } else {   // 其他页面
    if (to.path === "/center-site/register") {  // 商家中心注册
      next();
    } else {
      if (!store.state.auth_login) {   // 未登录状态
        Vue.http.get(AUTO_LOGIN_URL).then(function(response) {
          if (response.body.success) {
            store.commit("AUTH_LOGIN", true);
            store.commit("USER_ID", response.body.content.id);
            store.commit("USER_NAME", response.body.content.account);
            store.commit("USER_DATA", response.body.content.perms);
            next();
          } else {   // 清除浏览器数据，刷新
            next("/login");
          }
        });
      } else {
        next();
      }
    }
  }
});

// http拦截器
Vue.http.interceptors.push(function(request, next) {
  next(function(response) {
    // 请求失败
    if (response.status !== 200) {
      Vue.prototype.$confirm("无法连接,请稍后再试!", "提示", {
        showCancelButton: false,
        showConfirmButton: false,
        closeOnClickModal: false,
        type: "warning"
      }).then(() => {
      }).catch(() => {
        store.commit("AUTH_LOGIN", false);
        clearCookie("REMEMBER");
      });
    } else {   // 请求成功
      if (!response.body.success) {     // success:false
        if (response.body.error_info === "logout") {    // 自动登出
          store.commit("AUTH_LOGIN", false);
          clearCookie("REMEMBER");
        } else if (response.body.error_info !== "") {
          Vue.prototype.$confirm(response.body.error_info, "提示", {
            showCancelButton: false,
            showConfirmButton: false,
            closeOnClickModal: false,
            type: "warning"
          }).then(() => {
          }).catch(() => {
          });
        }
      } else {
        return response;
      }
    }
  });
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router: router,
  store: store,
  template: "<App/>",
  components: {App}
}).$mount("#app");
