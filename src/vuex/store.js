import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 账号名称
    user_name: "",
    // 判断是否登录
    auth_login: false,
    // 登录之后的用户信息（权限）
    user_data: {}
  },
  mutations: {
    USER_NAME (state, status) {
      state.user_name = status
    },
    AUTH_LOGIN (state, status) {
      state.auth_login = status
    },
    USER_DATA (state, perms) {
      state.user_data = perms
    }
  }
})


export default store


