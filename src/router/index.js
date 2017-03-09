import Login from "../pages/login/index"
import Main from "../pages/main"
import EDITPWD from "../pages/editPassword/editPwd"
import Setting from "../pages/Setting/index"
import BusApply from "../pages/BD/bus_apply/index"
import BusRegister from "../pages/BD/bus_register/index"
import New from "../pages/BD/bus_register/new/index"
import Branch from "../pages/BD/bus_register/branch/index"
import Apply from "../pages/BD/bus_register/apply/index"
import BusList from "../pages/BD/bus_list/index"
import BLView from "../pages/BD/bus_list/view/index"
import BusReview from "../pages/Review/bus_review/index"
import ApplyReview from "../pages/Review/bus_review/apply/index"
import EditReview from "../pages/Review/bus_review/modify/index"
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
          {path: "branch/:id", name: "分店注册"},
          {path: "apply/:id", name: "商家申请注册"}
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
  {   // 新店注册详情页
    path: "/bus_register/new/register",
    hidden: "login",
    name: "新店注册详情页",
    component: New
  },
  {   // 分店注册详情页
    path: "/bus_register/branch/register",
    hidden: "login",
    name: "分店注册详情页",
    component: Branch
  },
  {   // 商家申请注册
    path: "/bus_register/apply/register",
    hidden: "login",
    name: "商家申请注册详情页",
    component: New
  },
  {   // 商家申请详情页
    path: "/bus_register/apply/view",
    hidden: "login",
    name: "商家申请查看",
    component: Apply
  },
  {   // 商家列表详情查看
    path: "/bus_list/view",
    hidden: "login",
    name: "商家列表详情查看",
    component: BLView
  },
  {
    path: "/",
    name: "审核",
    hidden: "Reviewer",
    component: Main,
    children: [
      {
        path: "/bus_review/:type",
        name: "商家审核",
        hidden: "bus_verify",
        component: BusReview,
        iconCls: "icon-xuanze",
        children: [
          {path: "bus_apply/:id", name: "商家申请"},
          {path: "bus_apply_record/:id", name: "商家申请记录"},
          {path: "businfo_edit/:id", name: "商家信息修改"},
          {path: "businfo_edit_record/:id", name: "商家信息修改记录"}
        ]
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
  {   // 商家审核（申请）详情页
    path: "/bus_review/bus_apply/content",
    hidden: "login",
    name: "商家申请审核",
    component: ApplyReview
  },
  {   // 商家审核（申请）详情页
    path: "/bus_review/bus_apply_record/content",
    hidden: "login",
    name: "商家申请审核查看",
    component: ApplyReview
  },
  {   // 商家信息修改详情页
    path: "/bus_review/businfo_edit/content",
    hidden: "login",
    name: "商家信息修改审核",
    component: EditReview
  },
  {   // 商家信息修改查看详情页
    path: "/bus_review/businfo_edit_record/content",
    hidden: "login",
    name: "商家信息修改审核查看",
    component: EditReview
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
