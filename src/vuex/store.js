import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

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
    // 表单数据
    form_data: null,
    // 表单验证标志
    vflag: false,
    // 短信通知手机号码
    userPhone: "",
    // 商家注账号
    busAccount: ""
  },
  mutations: {
    USER_ID(state, status) {
      state.user_id = status;
    },
    USER_NAME(state, status) {
      state.user_name = status;
    },
    AUTH_LOGIN(state, status) {
      state.auth_login = status;
    },
    USER_DATA(state, perms) {
      state.user_data = perms;
    },
    FORM_DATA(state, perms) {
      state.form_data = perms;
    },
    V_FLAG(state, perms) {
      state.vflag = perms;
    },
    USER_PHONE(state, perms) {
      state.userPhone = perms;
    },
    BUS_ACCOUNT(state, perms) {
      state.busAccount = perms;
    }
  }
});


export default store;


