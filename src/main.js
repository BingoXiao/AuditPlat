// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./router/index";
import store from "./vuex/store";
import VueResource from "vue-resource";

import "../theme/index.css";
import ElementUI from "element-ui";

import "./assets/font/iconfont.css";
import "./common/style.css";

import App from "App";
import {AUTO_LOGIN_URL} from "./common/interface";
import {pageToContent, getCookie, clearCookie} from "./common/common";

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


// 路由设置
router.beforeEach((to, from, next) => {
  if (to.path === "/login") {    /* 进入首页 */
    let remember = getCookie("REMEMBER");
    if (remember === "1") {   /* 自动登陆 */
      Vue.http.get(AUTO_LOGIN_URL).then(function(response) {
        if (response.body.success) {
          /*  记录用户信息 */
          var perms = response.body.content.perms;
          store.commit("USER_ID", response.body.content.id);
          store.commit("USER_NAME", response.body.content.account);
          store.commit("AUTH_LOGIN", true);
          store.commit("USER_DATA", perms);
          /* 根据权限进入不同得页面 */
          let rPath = pageToContent(perms);
          next({path: rPath});
        }
      });
    } else {
      next();
    }
  } else {    /* 其他页面 */
    if (to.path === "/center-site/register") {  // 商家中心注册（商家中心页面）
      next();
    } else {
      if (!store.state.auth_login) {   /* 用户是否登录 */
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
  if ((request.method).toUpperCase() === "POST") {   // 跨网站攻击设置
    request.headers.set("X-CSRFToken", getCookie("csrftoken"));
  }
  next(function(response) {
    /* 请求失败 */
    if (response.status !== 200) {
      Vue.prototype.$confirm("无法连接,请稍后再试!", "提示", {
        showCancelButton: false,
        showConfirmButton: false,
        closeOnClickModal: false,
        type: "warning"
      }).then(() => {}).catch(() => {
        store.commit("AUTH_LOGIN", false);
        clearCookie("REMEMBER");
        router.replace({path: "login"});
      });
    } else {   /* 请求成功 */
      if (!response.body.success) {     // success:false(返回有错误信息)
        if (response.body.error_info === "logout") {    // 自动登出
          store.commit("AUTH_LOGIN", false);
          clearCookie("REMEMBER");
          router.replace({path: "login"});
        } else if (response.body.error_info !== "") {
          Vue.prototype.$confirm(response.body.error_info, "提示", {
            showCancelButton: false,
            showConfirmButton: false,
            closeOnClickModal: false,
            type: "warning"
          }).then(() => {
          }).catch(() => {
          });
        } else {
          store.commit("AUTH_LOGIN", false);
          clearCookie("REMEMBER");
          router.replace({path: "login"});
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
