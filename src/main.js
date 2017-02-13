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
import "./plugins/font/iconfont.css"
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
  var authLogin = store.state.auth_login

  if (to.path === "/login") {
    // 判断自动登陆
    var remember = getCookie("REMEMBER")
    if (remember === "1") {
      Vue.http.get(AUTO_LOGIN_URL).then(function (response) {
        if (response.data.success) {
          /*  记录状态 */
          store.commit("USER_NAME", response.data.content.account)
          store.commit("AUTH_LOGIN", true)
          store.commit("USER_DATA", response.data.content.perms)

          next({path: "/setting"})
        }
      })
    } else {
      next()
    }
  } else {
    if (!authLogin) {
      next({path: "/login"})
    } else {
      next()
    }
  }
})

// http拦截器
Vue.http.interceptors.push(function (request, next) {
  next(function (response) {
    // 更具请求的状态， response参数会返回给 successCallback或errorCallback
    if (response.data.error_info === "logout") {
      store.state.auth_login = false
      router.replace("/login")
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
