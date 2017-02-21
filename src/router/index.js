import Login from "../pages/login/index"
import Main from "../pages/main"
import EDITPWD from "../pages/editPassword/editPwd"
import Setting from "../pages/Setting/index"
import BusApply from "../pages/BD/bus_apply/index"
import BusRegister from "../pages/BD/bus_register/index"
import New from "../pages/BD/bus_register/new/index"
import BusList from "../pages/BD/bus_list/index"
import Hello from "../pages/Hello"


const routes = [
  {
    path: "/login",
    name: "登录",
    hidden: "login",
    component: Login
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
        component: BusApply,
        iconCls: "icon-youjian"
      }, {
        path: "/bus_register/:type",
        name: "商家注册",
        hidden: "bus_register",
        component: BusRegister,
        iconCls: "icon-xiao09",
        children: [
          {path: "new/:id", name: "新店注册"},
          {path: "branch", name: "分店注册"},
          {path: "apply", name: "商家申请注册"}
        ]
      }, {
        path: "/bus_list",
        name: "商家列表",
        hidden: "bus_register",
        component: BusList,
        iconCls: "icon-baobiaofenlei"
      }
    ]
  },
  {   // 注册详情页
    path: "/bus_register/new/register",
    hidden: "login",
    component: New
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
        iconCls: "icon-xuanze"
      }, {
        path: "/project_verify",
        name: "项目审核",
        hidden: "project_verify",
        component: Hello,
        iconCls: "icon-gerenziliao"
      }, {
        path: "/checkout_verify",
        name: "结款审核",
        hidden: "checkout_verify",
        component: Hello,
        iconCls: "icon-zhangwujiekuan"
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
        iconCls: "icon-renzhengxiangmu"
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
        iconCls: "icon-youhuiquan"
      }, {
        path: "/add_activity",
        name: "新增活动",
        hidden: "Administrator",
        component: Hello,
        iconCls: "icon-iconfontxinzeng"
      }, {
        path: "/activity_list",
        name: "活动列表",
        hidden: "Administrator",
        component: Hello,
        iconCls: "icon-liebiao"
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
        iconCls: "icon-yewuyeicon16"
      }, {
        path: "/tip_off",
        name: "举报",
        hidden: "Administrator",
        component: Hello,
        iconCls: "icon-dianpingjitousu"
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
        iconCls: "icon-zhanghu"
      }
    ]
  },
  {
    path: "/editPassword",
    name: "修改密码",
    hidden: "login",
    component: EDITPWD
  },
  // 路由重定向:除了路由配置的地址，全部到/login页面
  {
    path: "*",
    hidden: true,
    redirect: {path: "/login"}
  }
]

export default routes
