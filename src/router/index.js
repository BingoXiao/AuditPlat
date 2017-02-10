import Login from "../pages/login"
import Index from "../pages/index"
import Hello from "../pages/Hello"

const routes = [
  {
    path: "/login",
    name: "登录",
    hidden: true,
    component: Login
  },
  {
    path: "/",
    name: "BD",
    component: Index,
    children: [
      {path: "/bus_apply", name: "商家分配", component: Hello, iconCls: "el-icon-message"},
      {path: "/bus_register", name: "商家注册", component: Hello, iconCls: "el-icon-message"},
      {path: "/bus_list", name: "商家列表", component: Hello, iconCls: "el-icon-message"}
    ]
  },
  {
    path: "/",
    name: "审核",
    component: Index,
    children: [
      {path: "/bus_review", name: "商家审核", component: Hello, iconCls: "el-icon-message"},
      {path: "/project_review", name: "项目审核", component: Hello, iconCls: "el-icon-message"},
      {path: "/audit_review", name: "结款审核", component: Hello, iconCls: "el-icon-message"}
    ]
  },
  {
    path: "/",
    name: "项目管理",
    component: Index,
    children: [
      {path: "/project_list", name: "项目列表", component: Hello, iconCls: "el-icon-message"}
    ]
  },
  {
    path: "/",
    name: "活动管理",
    component: Index,
    children: [
      {path: "/coupons_manage", name: "优惠券管理", component: Hello, iconCls: "el-icon-message"},
      {path: "/add_activity", name: "新增活动", component: Hello, iconCls: "el-icon-message"},
      {path: "/activity_list", name: "活动列表", component: Hello, iconCls: "el-icon-message"}
    ]
  },
  {
    path: "/",
    name: "商家管理",
    component: Index,
    children: [
      {path: "/system_notice", name: "系统公告", component: Hello, iconCls: "el-icon-message"},
      {path: "/tip_off", name: "举报", component: Hello, iconCls: "el-icon-message"}
    ]
  },
  {
    path: "/",
    name: "系统设置",
    component: Index,
    children: [
      {path: "/Setting", name: "账号管理", component: Hello, iconCls: "el-icon-message"}
    ]
  },
  // 路由重定向:除了路由配置的地址，全部到/login页面
  {
    path: "*",
    hidden: true,
    redirect: {path: "/login"}
  }
]

export default routes
