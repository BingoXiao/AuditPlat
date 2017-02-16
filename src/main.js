// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue"
import VueRouter from "vue-router"
import routes from "./router/index"
import store from "./vuex/store"
import VueResource from "vue-resource"
// import "element-ui/lib/theme-default/index.css"
import "../theme/index.css"
import ElementUI from "element-ui"
import "./assets/font/iconfont.css"
import "./common/style.css"
import App from "App"
import {AUTO_LOGIN_URL} from "./common/interface"
import {getCookie} from "./common/common"

// Router
Vue.use(VueRouter)

// 引入Element 组件
Vue.use(ElementUI)

// Resource
Vue.use(VueResource)


// 创建路由
const router = new VueRouter({
  routes: routes
})

router.beforeEach((to, from, next) => {
  var remember = getCookie("REMEMBER")
  /* 进入首页 */
  if (to.path === "/login") {
    // 自动登陆
    if (remember === "1") {
      Vue.http.get(AUTO_LOGIN_URL).then(function(response) {
        if (response.data.success) {
          /*  记录状态 */
          store.commit("USER_ID", response.data.content.id)
          store.commit("USER_NAME", response.data.content.account)
          store.commit("AUTH_LOGIN", true)
          store.commit("USER_DATA", response.data.content.perms)
        }
      })
      /* 根据权限进入不同得页面 */
      if (store.state.user_data.item_list === 1) { /* 管理员账号 */
        next({path: "/setting"})
      } else {   /* BD */
        if (store.state.user_data.bus_apply === 1 || store.state.user_data.bus_register === 1) {
          if (store.state.user_data.bus_apply === 1) {
            next({path: "/bus_apply"})
          } else {
            next({path: "/bus_register"})
          }
        } else {  /* 审核人员 */
          if (store.state.user_data.bus_verify === 1 || store.state.user_data.checkout_verify === 1 ||
            store.state.user_data.project_verify === 1) {
            if (store.state.user_data.bus_verify === 1) {
              next({path: "/bus_review"})
            } else if (store.state.user_data.checkout_verify === 1) {
              next({path: "/checkout_verify"})
            } else {
              next({path: "/project_verify"})
            }
          }
        }
      }
    } else {
      next()
    }
  } else {
    if (!store.state.auth_login) {
      Vue.http.get(AUTO_LOGIN_URL).then(function(response) {
        if (response.data.success) {
          store.commit("USER_ID", response.data.content.id)
          store.commit("USER_NAME", response.data.content.account)
          store.commit("AUTH_LOGIN", true)
          store.commit("USER_DATA", response.data.content.perms)

          next()
        } else {
          next({path: "/login"})
        }
      })
    } else {
      next()
    }
  }
})

// http拦截器
Vue.http.interceptors.push(function(request, next) {
  next(function(response) {
    // 更具请求的状态， response参数会返回给 successCallback或errorCallback
    if (!response.data.success) {  // success:false
      if (response.data.error_info === "logout") {
        store.state.auth_login = false
        router.replace("/login")
      }
    }
  })
})

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router: router,
  store: store,
  template: "<App/>",
  components: {App}
}).$mount("#app")
