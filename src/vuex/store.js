import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 账号ID
    user_id: "",
    // 账号名称
    user_name: "",
    // 判断是否登录
    auth_login: false,
    // 登录之后的用户信息（权限）
    user_data: {
      bus_apply: true,
      bus_register: true,
      bus_verify: true,
      checkout_verify: true,
      project_verify: true,
      item_list: true
    },
    // 地图坐标
    map_point: [],
    // 地址
    address: ""
  },
  mutations: {
    USER_ID(state, status) {
      state.user_id = status
    },
    USER_NAME(state, status) {
      state.user_name = status
    },
    AUTH_LOGIN(state, status) {
      state.auth_login = status
    },
    USER_DATA(state, perms) {
      state.user_data = perms
    },
    MAP_POINT(state, perms) {
      state.map_point = perms
    },
    ADDRESS(state, perms) {
      state.address = perms
    }
  }
})


export default store


