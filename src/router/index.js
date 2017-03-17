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
import ProjectReview from "../pages/Review/project_review/index"
import ProjectContent from "../pages/Review/project_review/inner/index"
import wholeShops from "../pages/Review/project_review/wholeShops/index"
import AuditReview from "../pages/Review/audit_review/index"
import bankAccountContent from "../pages/Review/audit_review/bank_account/bank_account_view/index"
import ProjectList from "../pages/PM/project_list/index"
import ProjectListContent from "../pages/PM/project_list/content/index"
import SystemNotice from "../pages/BM/system_notice/index"
import TipsOff from "../pages/BM/tip_off/index"
import CouponsManage from "../pages/AM/coupons_manage/index"
import AddActivity from "../pages/AM/add_activity/index"
import ActivityList from "../pages/AM/activity_list/index"


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
        path: "/project_verify/:type",
        name: "项目审核",
        hidden: "project_verify",
        component: ProjectReview,
        iconCls: "icon-gerenziliao",
        children: [
          {path: "online/:id", name: "上线申请"},
          {path: "edit/:id", name: "修改申请"},
          {path: "offline/:id", name: "下线申请"},
          {path: "record/:id", name: "记录"}
        ]
      }, {
        path: "/checkout_verify/:type",
        name: "结款审核",
        hidden: "checkout_verify",
        component: AuditReview,
        iconCls: "icon-zhangwujiekuan",
        children: [
          {path: "check_apply", name: "结款申请"},
          {path: "check_apply_record", name: "结款申请记录"},
          {path: "bank_account/:id", name: "商家银行账户修改"},
          {path: "bank_account_record/:id", name: "商家银行账户修改记录"},
          {path: "refund", name: "操作退款"},
          {path: "refund_record", name: "退款记录"}
        ]
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
    name: "商家信息修改",
    component: EditReview
  },
  {   // 商家信息修改查看详情页
    path: "/bus_review/businfo_edit_record/content",
    hidden: "login",
    name: "商家信息修改记录",
    component: EditReview
  },
  {   // 上线申请
    path: "/project_verify/online/content",
    hidden: "login",
    name: "上线申请审核",
    component: ProjectContent
  },
  {   // 修改申请
    path: "/project_verify/edit/content",
    hidden: "login",
    name: "修改申请审核",
    component: ProjectContent
  },
  {   // 下线申请
    path: "/project_verify/offline/content",
    hidden: "login",
    name: "下线申请审核",
    component: ProjectContent
  },
  {   // 记录
    path: "/project_verify/record/content",
    hidden: "login",
    name: "项目审核记录",
    component: ProjectContent
  },
  {   // 查看更多门店
    path: "/project/wholeShops",
    hidden: "login",
    name: "全部门店",
    component: wholeShops
  },
  {   // 商家银行账户修改
    path: "/checkout_verify/bank_account/content",
    hidden: "login",
    name: "商家银行账户修改",
    component: bankAccountContent
  },
  {   // 商家银行账户修改记录
    path: "/checkout_verify/bank_account_record/content",
    hidden: "login",
    name: "商家银行账户修改记录",
    component: bankAccountContent
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
        component: ProjectList,
        iconCls: "icon-renzhengxiangmu"
      }
    ]
  },
  {   // 记录
    path: "/project_list/content",
    hidden: "login",
    name: "项目审核记录",
    component: ProjectListContent
  },
  {
    path: "/",
    name: "活动管理",
    hidden: "Administrator",
    component: Main,
    children: [
      {
        path: "/coupons_manage/:type",
        name: "优惠券管理",
        hidden: "Administrator",
        component: CouponsManage,
        iconCls: "icon-youhuiquan",
        children: [
          {path: "my_coupons", name: "我的优惠券"},
          {path: "add_new_coupons", name: "新增优惠券"},
          {path: "specified_stores", name: "查看指定门店"}
        ]
      }, {
        path: "/add_activity",
        name: "新增活动",
        hidden: "Administrator",
        component: AddActivity,
        iconCls: "icon-iconfontxinzeng"
      }, {
        path: "/activity_list/:type",
        name: "活动列表",
        hidden: "Administrator",
        component: ActivityList,
        iconCls: "icon-liebiao",
        children: [
          {path: "all", name: "全部活动"},
          {path: "stay", name: "待上线活动"},
          {path: "online", name: "已上线活动"},
          {path: "offline", name: "已下线活动"},
          {path: "view_activity", name: "查看活动"}
        ]
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
        component: SystemNotice,
        iconCls: "icon-yewuyeicon16"
      }, {
        path: "/tip_off",
        name: "举报",
        hidden: "Administrator",
        component: TipsOff,
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
