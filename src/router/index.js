import Login from "../pages/login"
import Main from "../pages/main"
import EDITPWD from "../pages/editPassword/editPwd"
import Setting from "../pages/Setting/index"
import Hello from "../pages/Hello"
import aaa from "../aaa"

const routes = [
  {
    path: "/login",
    name: "登录",
    hidden: "login",
    component: Login
  },
  {
    path: "/editPassword",
    name: "修改密码",
    hidden: "login",
    component: EDITPWD
  },
  {
    path: "/",
    name: "BD",
    hidden: "BD",
    component: Main,
    children: [
      {
        path: "/bus_apply",
        name: "商家分配",
        hidden: "bus_apply",
        component: Hello,
        iconCls: "icon-gendan",
        children: [
          { path: "/newShop", name: "新店注册", components: aaa },
          { path: "/branchShop", name: "分店注册", components: aaa }
        ]
      }, {
        path: "/bus_register",
        name: "商家注册",
        hidden: "bus_register",
        component: Hello,
        iconCls: "icon-gendan"
      }, {
        path: "/bus_list",
        name: "商家列表",
        hidden: "bus_register",
        component: Hello,
        iconCls: "icon-gendan"
      }
    ]
  },
  {
    path: "/",
    name: "审核",
    hidden: "Reviewer",
    component: Main,
    children: [
      {
        path: "/bus_review",
        name: "商家审核",
        hidden: "bus_verify",
        component: Hello,
        iconCls: "icon-gendan"
      }, {
        path: "/project_verify",
        name: "项目审核",
        hidden: "project_verify",
        component: Hello,
        iconCls: "icon-gendan"
      }, {
        path: "/checkout_verify",
        name: "结款审核",
        hidden: "checkout_verify",
        component: Hello,
        iconCls: "icon-gendan"
      }
    ]
  },
  {
    path: "/",
    name: "项目管理",
    hidden: "item_list",
    component: Main,
    children: [
      {
        path: "/project_list",
        name: "项目列表",
        hidden: "item_list",
        component: Hello,
        iconCls: "icon-gendan"
      }
    ]
  },
  {
    path: "/",
    name: "活动管理",
    hidden: "Administrator",
    component: Main,
    children: [
      {
        path: "/coupons_manage",
        name: "优惠券管理",
        hidden: "Administrator",
        component: Hello,
        iconCls: "icon-gendan"
      }, {
        path: "/add_activity",
        name: "新增活动",
        hidden: "Administrator",
        component: Hello,
        iconCls: "icon-gendan"
      }, {
        path: "/activity_list",
        name: "活动列表",
        hidden: "Administrator",
        component: Hello,
        iconCls: "icon-gendan"
      }
    ]
  },
  {
    path: "/",
    name: "商家管理",
    hidden: "Administrator",
    component: Main,
    children: [
      {
        path: "/system_notice",
        name: "系统公告",
        hidden: "Administrator",
        component: Hello,
        iconCls: "icon-gendan"
      }, {
        path: "/tip_off",
        name: "举报",
        hidden: "Administrator",
        component: Hello,
        iconCls: "icon-gendan"
      }
    ]
  },
  {
    path: "/",
    name: "系统设置",
    hidden: "Administrator",
    component: Main,
    children: [
      {
        path: "/setting",
        name: "账号管理",
        hidden: "Administrator",
        component: Setting,
        iconCls: "icon-gendan"
      }
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
