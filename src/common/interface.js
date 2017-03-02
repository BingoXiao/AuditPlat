const HOST_URL = "https://shopmanage-dev.jinmailife.com"

// 登录 post
const ACCOUNTS_LOGIN_URL = HOST_URL + "/account-manage/login/"
// 自动登录 get
const AUTO_LOGIN_URL = HOST_URL + "/account-manage/verlogin/"
// 修改账户密码 post
const ACCOUNTS_PASSWORD_URL = HOST_URL + "/account-manage/change-password/"
// 用户登出 post
const ACCOUNTS_LOGOUT_URL = HOST_URL + "/account-manage/logout/"

/* 账户管理 */
// 表格获取 get
const ACCOUNTS_TABLE_URL = HOST_URL + "/account-manage/employees/"

// 添加用户 post
const ACCOUNTS_ADD_URL = HOST_URL + "/account-manage/add-employee/"

// 修改资料 post
const ACCOUNTS_EDITINFO_URL = HOST_URL + "/account-manage/modify-profile/"

// 修改密码 post
const ACCOUNTS_EDITPWD_URL = HOST_URL + "/account-manage/reset-password/"

// 删除 post
const ACCOUNTS_DELETE_URL = HOST_URL + "/account-manage/delete-employee/"

// 冻结 post
const ACCOUNTS_FROZEN_URL = HOST_URL + "/account-manage/change-avail/"

/* BD */
/* 商家分配 */
// 表格 get
const BDAPPLY_TABLE_URL = HOST_URL + "/register/applys/"

// 获取所有带有商家分配权限的BD get
const BDAPPLY_LIST_URL = HOST_URL + "/register/bds/"

// 分配 post
const BDAPPLY_ASSIGN_URL = HOST_URL + "/register/assign-work/"

/* 商家注册 */
// 表格 get
const BDREGISTER_TABLE_URL = HOST_URL + "/register/registers/"

// 新店注册资料查看 get
const BDREGISTER_EDITFILLING_URL = HOST_URL + "/register/pendingverinfo/"

// 新店注册信息提交 post
const BDREGISTER_NEWREGISTER_URL = HOST_URL + "/register/busregister/"


/* 商家列表 */
// 获取表格 get
const BUSLIST_TABLE_URL = HOST_URL + "/bus-manage/buslist/"

const BUSLIST_DOWNLOAD_URL = HOST_URL + "/bus-manage/buses/download/"

/* 基本信息 */
/* 商家分类资料 */
// 合作行业 get
const CATEGORY_URL = HOST_URL + "/register/lclass/"
// 品类 get
const LCLASS_URL = HOST_URL + "/register/mclass/"
// 子分类 get
const SCLASS_URL = HOST_URL + "/register/sclass/"

/* 省市区资料 */
// 获取省 get
const PROVINCE_URL = HOST_URL + "/register/provinces/"
// 获取市 get
const CITY_URL = HOST_URL + "/register/cities/"
// 获取区 get
const DISTRICT_URL = HOST_URL + "/register/districts/"
// 获取商圈 get
const CITYNEAR_URL = HOST_URL + "/register/citynears/"

/* 银行资料 */
// 银行省 get
const BANK_PROVINCES_URL = HOST_URL + "/register/admiprovinces/"
// 银行市 get
const BANK_CITIES_URL = HOST_URL + "/register/admicities/"
// 银行总行信息 get
const BANKS_URL = HOST_URL + "/register/banks/"
// 银行分行信息 get
const SUBBANKS_URL = HOST_URL + "/register/subbanks/"


// 上传图片 post
const TEMP_PHOTOS_URL = HOST_URL + "/register/upload-tmpimage/"

exports = module.exports = {
  ACCOUNTS_LOGIN_URL,
  AUTO_LOGIN_URL,
  ACCOUNTS_PASSWORD_URL,
  ACCOUNTS_LOGOUT_URL,
  ACCOUNTS_TABLE_URL,
  ACCOUNTS_ADD_URL,
  ACCOUNTS_EDITINFO_URL,
  ACCOUNTS_EDITPWD_URL,
  ACCOUNTS_DELETE_URL,
  ACCOUNTS_FROZEN_URL,
  BDAPPLY_TABLE_URL,
  BDAPPLY_LIST_URL,
  BDAPPLY_ASSIGN_URL,
  BDREGISTER_TABLE_URL,
  BDREGISTER_EDITFILLING_URL,
  BDREGISTER_NEWREGISTER_URL,
  BUSLIST_TABLE_URL,
  BUSLIST_DOWNLOAD_URL,
  CATEGORY_URL,
  LCLASS_URL,
  SCLASS_URL,
  PROVINCE_URL,
  CITY_URL,
  DISTRICT_URL,
  CITYNEAR_URL,
  BANK_PROVINCES_URL,
  BANK_CITIES_URL,
  BANKS_URL,
  SUBBANKS_URL,
  TEMP_PHOTOS_URL
}


/*
  /!* 获取页面信息 *!/
  /!* 商家申请查看 *!/
var BDREGISTER_APPLFILLING_URL = HOST_URL + "/register/businfo/"
var BDREGISTER_APPLFILLING_TYPE = "get"


  /!* 分店修改 *!/
var BDREGISTER_BRAEDITFILLING_URL = HOST_URL + "/bus-manage/branches/detail/"
var BDREGISTER_BRAEDITFILLING_TYPE = "get"


  /!* 分店注册查询表格 *!/
var BDREGISTER_BRALIST_URL = HOST_URL + "/bus-manage/buses/search/"
var BDREGISTER_BRALIST_TYPE = "get"

  /!* 分店注册信息提交 *!/
var BDREGISTER_BRAREGISTER_URL = HOST_URL + "/bus-manage/branches/add/"
var BDREGISTER_BRAREGISTER_TYPE = "post"

  /!* 删除新店(分店) *!/
var BDREGISTER_DELETE_URL = new Function("id",'return HOST_URL + "/register/applys/"+id+"/delete/"')
var BDREGISTER_DELETE_TYPE = "post"
*/

/*
/!* ***********商家列表（busList）*************** *!/
  /!* 获取基本信息 *!/
var BUSLIST_BASIC_URL = HOST_URL + "/bus-manage/businfo/"
var BUSLIST_BASIC_TYPE = "get"

  /!* 获取身份证信息 *!/
var BUSLIST_ID_URL = HOST_URL + "/bus-manage/idinfo/"
var BUSLIST_ID_TYPE = "get"

  /!* 获取营业执照信息 *!/
var BUSLIST_BLIC_URL = HOST_URL + "/bus-manage/blinfo/"
var BUSLIST_BLIC_TYPE = "get"

  /!* 获取餐饮许可证信息 *!/
var BUSLIST_SLIC_URL = HOST_URL + "/bus-manage/slinfo/"
var BUSLIST_SLIC_TYPE = "get"

  /!* 获取结算信息 *!/
var BUSLIST_SETTLER_URL = HOST_URL + "/bus-manage/settleinfo/"
var BUSLIST_SETTLER_TYPE = "get"

  /!* 获取合约信息 *!/
var BUSLIST_CONSTRA_URL = HOST_URL + "/register/treaty/get/"
var BUSLIST_CONSTRA_TYPE = "get"

  /!* 获取商家列表信息 *!/
var BUSLIST_BRANCH_URL = HOST_URL + "/bus-manage/branches/"
var BUSLIST_BRANCH_TYPE = "get"

  /!* 提交商家列表 *!/
var BUSLIST_SUBMIT_URL = HOST_URL + "/bus-manage/change-business-status/"
var BUSLIST_SUBMIT_TYPE = "post"

  /!* 提交合约 *!/
var BUSLIST_SUBMITCONSTRA_URL = HOST_URL + "/register/treaty/post/"
var BUSLIST_SUBMITCONSTRA_TYPE = "post"
*/
/* ***********基本通用资料********* */
/* 获取节假日 */
/*
 var FESTIVALS_URL = HOST_URL + "/items/festivals/"
 var FESTIVALS_TYPE = "get"


 /!* 上传excel文件 *!/
 var EXCEL_UPLOAD_URL = HOST_URL + "/bus-manage/settlement/items/utasks/"
 var EXCEL_UPLOAD_TYPE = "post"


 /!* ********************* 审核 ********************* *!/
 /!* *********商家审核（busVerify）********* *!/
 /!* 信息填充 *!/
 var BDVERIFY_FILLING_URL = HOST_URL + "/bus-manage/busedit-details/"
 var BDVERIFY_FILLING_TYPE = "get"

 /!* 商家申请表格 *!/
 var BDVERIFY_APPLYTABLE_URL = HOST_URL + "/register/pendingver/"
 var BDVERIFY_APPLYTABLE_TYPE = "get"

 /!* 商家信息修改表格 *!/
 var BDVERIFY_EDITTABLE_URL = HOST_URL + "/bus-manage/busedit-items/"
 var BDVERIFY_EDITTABLE_TYPE = "get"

 /!* 商家申请通过（驳回） *!/
 var BDVERIFY_APPLYPASS_URL = HOST_URL + "/register/verify/"
 var BDVERIFY_APPLYPASS_TYPE = "post"

 /!* 商家信息修改通过（驳回） *!/
 var BDVERIFY_EDITPASS_URL = HOST_URL + "/bus-manage/busedit-verify/"
 var BDVERIFY_EDITPASS_TYPE = "post"

 /!* *********项目审核（projectVerify）********** *!/
 /!* 表格 *!/
 var PROVERIFY_TABLE_URL = HOST_URL + "/items/"
 var PROVERIFY_TABLE_TYPE = "get"

 /!* 信息填充 *!/
 var PROVERIFY_FILLING_URL = HOST_URL + "/items/detail/"
 var PROVERIFY_FILLING_TYPE = "get"

 /!* 提交同意（驳回） *!/
 var PROVERIFY_PASS_URL = HOST_URL + "/items/verify/"
 var PROVERIFY_PASS_TYPE = "post"

 /!* ********** 结款审核（settleVerify） ********** *!/
 /!* 结款申请（记录） *!/
 var CHECKVERIFY_APPLY_URL = HOST_URL + "/bus-manage/settlement/items/"
 var CHECKVERIFY_APPLY_TYPE = "get"

 /!* 商家银行账户修改（记录） *!/
 var CHECKVERIFY_BANKEDIT_URL = HOST_URL + "/bus-manage/bank/items/"
 var CHECKVERIFY_BANKEDIT_TYPE = "get"

 /!* 退款（记录）表格 *!/
 var CHECKVERIFY_REFUNDRECORD_URL = HOST_URL + "/bus-manage/settlement/coupons/refunds/"
 var CHECKVERIFY_REFUNDRECORD_TYPE = "get"

 /!* 获取所有的项目 *!/
 var CHECKVERIFY_FILLING_URL = HOST_URL + "/bus-manage/bank/detail/"
 var CHECKVERIFY_FILLING_TYPE = "get"

 /!* 结款成功（失败） *!/
 var CHECKVERIFY_SUCCESS_SEARCH_URL = HOST_URL + "/bus-manage/settlement/items/verify/"
 var CHECKVERIFY_SUCCESS_SEARCH_TYPE = "post"

 /!* 操作退款 团购券号码查询 *!/
 var CHECKVERIFY_REFUND_SEARCH_URL = HOST_URL + "/bus-manage/settlement/coupons/"
 var CHECKVERIFY_REFUND_SEARCH_TYPE = "get"

 /!* 操作退款 *!/
 var CHECKVERIFY_REFUND_URL = HOST_URL + "/bus-manage/settlement/coupons/refund/"
 var CHECKVERIFY_REFUND_TYPE = "post"

 /!* 商家银行账户修改 *!/
 var CHECKVERIFY_EDITINFO_URL = HOST_URL + "/bus-manage/bank/verify/"
 var CHECKVERIFY_EDITINFO_TYPE = "post"


 /!* ********************* 项目管理 ************************* *!/
 /!* *****项目列表（projectList）**** *!/
 /!* 表格 *!/
 var PROLIST_TABLE_URL = HOST_URL + "/items/edit_up/"
 var PROLIST_TABLE_TYPE = "get"

 /!* 提交脉点 *!/
 var PROLIST_JM_URL = HOST_URL + "/items/image_words/add/"
 var PROLIST_JM_TYPE = "post"

 /!* 获取脉点 *!/
 var PROLIST_JMDATA_URL = HOST_URL + "/items/image_words/"
 var PROLIST_JMDATA_TYPE = "get"


 /!* ******************** 活动管理 ********************* *!/
 /!* *****优惠券管理（EMcouponsManage）****** *!/
 /!* 表格 *!/
 var EVENTS_CMTABLE_URL = HOST_URL + "/activities/coupons/"
 var EVENTS_CMTABLE_TYPE = "get"

 /!* 修改优惠券  *!/
 var EVENTS_CMEDIT_URL = new Function("coupon_id",'return HOST_URL + "/activities/coupons/"+coupon_id+"/update/"')
 var EVENTS_CMEDIT_TYPE = "post"

 /!* 获取优惠券信息  *!/
 var EVENTS_CMGETINFO_URL = new Function("coupon_id",'return HOST_URL + "/activities/coupons/"+coupon_id+"/info/"')
 var EVENTS_CMGETINFO_TYPE = "get"

 /!* 删除优惠券 *!/
 var EVENTS_CMDELETE_URL = new Function("coupon_id",'return HOST_URL + "/activities/coupons/"+coupon_id+"/delete/"')
 var EVENTS_CMDELETE_TYPE = "post"

 /!* 查看对应优惠券门店 (wholeShopsTable) *!/
 var EVENTS_CMVIEWSHOPS_URL = new Function("coupon_id",'return HOST_URL + "/activities/coupons/"+coupon_id+"/buses/"')
 var EVENTS_CMVIEWSHOPS_TYPE = "get"

 /!* 新增优惠券（门店搜索） *!/
 var EVENTS_CMSEARCHSHOPS_URL = HOST_URL + "/activities/buses/"
 var EVENTS_CMSEARCHSHOPS_TYPE = "get"

 /!* 新增优惠券（新增） *!/
 var EVENTS_CMADDSHOPS_URL = HOST_URL + "/activities/coupons/add/"
 var EVENTS_CMADDSHOPS_TYPE = "post"


 /!* *****新增活动（EMaddEvents）****** *!/
 /!* 优惠券列表(表格) *!/
 var EVENTS_CLTABLE_URL = HOST_URL + "/activities/coupons/"
 var EVENTS_CLTABLE_TYPE = "get"

 /!* 新增活动 *!/
 var EVENTS_ONLINE_URL = HOST_URL + "/activities/add/"
 var EVENTS_ONLINE_TYPE = "post"


 /!* *****活动列表（EMeventsList）****** *!/
 /!* 表格 *!/
 var EVENTS_ELTABLE_URL = HOST_URL + "/activities/"
 var EVENTS_ELTABLE_TYPE = "get"

 //查看活动下的券（表格）
 var EVENTS_VIEWEVENT_URL = new Function("activity_id",'return HOST_URL + "/activities/"+activity_id+"/coupons/"')
 var EVENTS_VIEWEVENT_TYPE = "get"

 //修改活动（获取信息）
 var EVENTS_EDITINFO_URL = new Function("activity_id",'return HOST_URL + "/activities/"+activity_id+"/info/"')
 var EVENTS_EDITINFO_TYPE = "get"

 //修改活动
 var EVENTS_EDITEVENT_URL = new Function("activity_id",'return HOST_URL + "/activities/"+activity_id+"/update/"')
 var EVENTS_EDITEVENT_TYPE = "post"

 //下线活动
 var EVENTS_OFFLINEINFO_URL = new Function("activity_id",'return HOST_URL + "/activities/"+activity_id+"/down/"')
 var EVENTS_OFFLINEINFO_TYPE = "POST"

 //删除活动
 var EVENTS_ELDELETE_URL = new Function("activity_id",'return HOST_URL + "/activities/"+activity_id+"/delete/"')
 var EVENTS_ELDELETE_TYPE = "post"


 /!* ********************* 商家管理 ********************** *!/
 /!* ****系统公告（systemInform）***** *!/
 /!* 提交 *!/
 var SYSTEMINFO_SUBMIT_URL = HOST_URL + "/notice/"
 var SYSTEMINFO_SUBMIT_TYPE = "post"

 /!* *******举报（complaints）****** *!/
 /!* 表格 *!/
 var COMPAINTS_TABLE_URL = HOST_URL + "/reports/"
 var COMPAINTS_TABLE_TYPE = "get"

 /!* 提交 *!/
 var COMPAINTS_SUBMIT_URL = HOST_URL + "/reports/put/"
 var COMPAINTS_SUBMIT_TYPE = "post"

*/
