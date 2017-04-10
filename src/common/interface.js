// const HOST_URL = "https://shopmanagedev.jinmailife.com";
// const CENTER_URL = "https://businessdev.jinmailife.com";

const HOST_URL = "https://shopmanage-test.jinmailife.com";
const CENTER_URL = "https://business-test.jinmailife.com";

/* 商家中心注册 */
const CNTER_REGISTER = HOST_URL + "/register/save-bus/";

// 登录 post
const ACCOUNTS_LOGIN_URL = HOST_URL + "/account-manage/login/";
// 自动登录 get
const AUTO_LOGIN_URL = HOST_URL + "/account-manage/verlogin/";
// 修改账户密码 post
const ACCOUNTS_PASSWORD_URL = HOST_URL + "/account-manage/change-password/";
// 用户登出 post
const ACCOUNTS_LOGOUT_URL = HOST_URL + "/account-manage/logout/";

/* 账户管理 */
// 表格获取 get
const ACCOUNTS_TABLE_URL = HOST_URL + "/account-manage/employees/";

// 添加用户 post
const ACCOUNTS_ADD_URL = HOST_URL + "/account-manage/add-employee/";

// 修改资料 post
const ACCOUNTS_EDITINFO_URL = HOST_URL + "/account-manage/modify-profile/";

// 修改密码 post
const ACCOUNTS_EDITPWD_URL = HOST_URL + "/account-manage/reset-password/";

// 删除 post
const ACCOUNTS_DELETE_URL = HOST_URL + "/account-manage/delete-employee/";

// 冻结 post
const ACCOUNTS_FROZEN_URL = HOST_URL + "/account-manage/change-avail/";


/* 基本信息 */
/* 商家分类资料 */
// 合作行业 get
const CATEGORY_URL = HOST_URL + "/register/lclass/";
// 品类 get
const LCLASS_URL = HOST_URL + "/register/mclass/";
// 子分类 get
const SCLASS_URL = HOST_URL + "/register/sclass/";

/* 省市区资料 */
// 获取省 get
const PROVINCE_URL = HOST_URL + "/register/provinces/";
// 获取市 get
const CITY_URL = HOST_URL + "/register/cities/";
// 获取区 get
const DISTRICT_URL = HOST_URL + "/register/districts/";
// 获取商圈 get
const CITYNEAR_URL = HOST_URL + "/register/citynears/";

/* 银行资料 */
// 银行省 get
const BANK_PROVINCES_URL = HOST_URL + "/register/admiprovinces/";
// 银行市 get
const BANK_CITIES_URL = HOST_URL + "/register/admicities/";
// 银行总行信息 get
const BANKS_URL = HOST_URL + "/register/banks/";
// 银行分行信息 get
const SUBBANKS_URL = HOST_URL + "/register/subbanks/";

// 上传图片 post
const TEMP_PHOTOS_URL = HOST_URL + "/register/upload-tmpimage/";

// 获取节假日 get
const FESTIVALS_URL = HOST_URL + "/items/festivals/";


/* BD */
/* 商家分配 */
// 表格 get
const BDAPPLY_TABLE_URL = HOST_URL + "/register/applys/";
// 获取所有带有商家分配权限的BD get
const BDAPPLY_LIST_URL = HOST_URL + "/register/bds/";
// 分配 post
const BDAPPLY_ASSIGN_URL = HOST_URL + "/register/assign-work/";


/* 商家注册 */
// 表格 get
const BDREGISTER_TABLE_URL = HOST_URL + "/register/registers/";
// 商家申请查看 get
const BDREGISTER_APPLFILLING_URL = HOST_URL + "/register/businfo/";
// 新店注册资料查看 get
const BDREGISTER_EDITFILLING_URL = HOST_URL + "/register/pendingverinfo/";
// 新店注册信息提交 post
const BDREGISTER_NEWREGISTER_URL = HOST_URL + "/register/busregister/";
// 删除新店(分店) post
const BDREGISTER_DELETE_URL = function(id) {
  return HOST_URL + "/register/applys/" + id + "/delete/";
};

// 分店修改 get
const BDREGISTER_BRAEDITFILLING_URL = HOST_URL + "/bus-manage/branches/detail/";
// 分店注册查询表格 get
const BDREGISTER_BRALIST_URL = HOST_URL + "/bus-manage/buses/search/";
// 分店注册信息提交 post
const BDREGISTER_BRAREGISTER_URL = HOST_URL + "/bus-manage/branches/add/";


/* 商家列表 */
// 获取表格 get
const BUSLIST_TABLE_URL = HOST_URL + "/bus-manage/buslist/";
// 下载
const BUSLIST_DOWNLOAD_URL = HOST_URL + "/bus-manage/buses/download/";
// 获取商家列表信息 get
const BUSLIST_BRANCH_URL = HOST_URL + "/bus-manage/branches/";
// 获取基本信息 get
const BUSLIST_BASIC_URL = HOST_URL + "/bus-manage/businfo/";
// 获取营业执照信息 get
const BUSLIST_BLIC_URL = HOST_URL + "/bus-manage/blinfo/";
// 获取餐饮许可证信息 get
const BUSLIST_SLIC_URL = HOST_URL + "/bus-manage/slinfo/";
// 获取合约信息 get
const BUSLIST_CONSTRA_URL = HOST_URL + "/register/treaty/get/";
// 获取身份证信息 get
const BUSLIST_ID_URL = HOST_URL + "/bus-manage/idinfo/";
// 获取结算信息 get
const BUSLIST_SETTLER_URL = HOST_URL + "/bus-manage/settleinfo/";
// 提交合约 post
const BUSLIST_SUBMITCONSTRA_URL = HOST_URL + "/register/treaty/post/";
// 提交商家列表 post
const BUSLIST_SUBMIT_URL = HOST_URL + "/bus-manage/change-business-status/";

/* 商家审核 */
// 商家申请表格 get
const BDVERIFY_APPLYTABLE_URL = HOST_URL + "/register/pendingver/";
// 商家信息修改表格 get
const BDVERIFY_EDITTABLE_URL = HOST_URL + "/bus-manage/busedit-items/";
// 商家申请通过（驳回） post
const BDVERIFY_APPLYPASS_URL = HOST_URL + "/register/verify/";
// 商家信息修改 获取数据 get
const BDVERIFY_FILLING_URL = HOST_URL + "/bus-manage/busedit-details/";
// 商家信息修改通过（驳回） post
const BDVERIFY_EDITPASS_URL = HOST_URL + "/bus-manage/busedit-verify/";


/* 项目审核 */
// 表格 get
const PROVERIFY_TABLE_URL = HOST_URL + "/items/";
// 信息填充 get
const PROVERIFY_FILLING_URL = HOST_URL + "/items/detail/";
// 提交同意（驳回） post
const PROVERIFY_PASS_URL = HOST_URL + "/items/verify/";


/* 结款审核 */
// 结款申请（记录） get
const CHECKVERIFY_APPLY_URL = HOST_URL + "/bus-manage/settlement/items/";
// 结款申请(下载当日任务)
const CHECKVERIFY_APPLY_TODYDL_URL = HOST_URL + "/bus-manage/settlement/items/dtasks/";
// 结款申请(上传结款信息)
const EXCEL_UPLOAD_URL = HOST_URL + "/bus-manage/settlement/items/utasks/";
// 结款申请记录(下载结款明细)
const CHECKVERIFY_RECORD_DOWNLOAD_URL = HOST_URL + "/bus-manage/settlement/items/drecord/";
// 结款成功（失败） post
const CHECKVERIFY_SUCCESS_SEARCH_URL = HOST_URL + "/bus-manage/settlement/items/verify/";
// 商家银行账户修改（记录） get
const CHECKVERIFY_BANKEDIT_URL = HOST_URL + "/bus-manage/bank/items/";
// 商家银行账户修改查看 get
const CHECKVERIFY_FILLING_URL = HOST_URL + "/bus-manage/bank/detail/";
// 商家银行账户修改 post
const CHECKVERIFY_EDITINFO_URL = HOST_URL + "/bus-manage/bank/verify/";
// 退款（记录）表格 get
const CHECKVERIFY_REFUNDRECORD_URL = HOST_URL + "/bus-manage/settlement/coupons/refunds/";
// 操作退款 团购券号码查询 get
const CHECKVERIFY_REFUND_SEARCH_URL = HOST_URL + "/bus-manage/settlement/coupons/";
// 操作退款 post
const CHECKVERIFY_REFUND_URL = HOST_URL + "/bus-manage/settlement/coupons/refund/";


/* 项目管理 */
// 项目列表
// 表格 get
const PROLIST_TABLE_URL = HOST_URL + "/items/edit_up/";
// 提交脉点 post
const PROLIST_JM_URL = HOST_URL + "/items/image_words/add/";
// 获取脉点 get
const PROLIST_JMDATA_URL = HOST_URL + "/items/image_words/";
// 新增优惠券（门店搜索） get
const EVENTS_CMSEARCHSHOPS_URL = HOST_URL + "/activities/buses/";



/* 活动管理 */
// 优惠券管理
// 表格 get
const EVENTS_CMTABLE_URL = HOST_URL + "/activities/coupons/";
// 查看对应优惠券门店 get
const EVENTS_CMVIEWSHOPS_URL = function(id) {
  return HOST_URL + "/activities/coupons/" + id + "/buses/";
};
// 删除优惠券 post
const EVENTS_CMDELETE_URL = function(id) {
  return HOST_URL + "/activities/coupons/" + id + "/delete/";
};
// 新增优惠券（新增）post
const EVENTS_CMADDSHOPS_URL = HOST_URL + "/activities/coupons/add/";
// 修改优惠券  post
const EVENTS_CMEDIT_URL = function(id) {
  return HOST_URL + "/activities/coupons/" + id + "/update/";
};
// 获取优惠券信息  get
const EVENTS_CMGETINFO_URL = function(id) {
  return HOST_URL + "/activities/coupons/" + id + "/info/";
};
// 优惠券列表(表格) get
const EVENTS_CLTABLE_URL = HOST_URL + "/activities/coupons/";
// 新增活动 post
const EVENTS_ONLINE_URL = HOST_URL + "/activities/add/";
// 修改活动 post
var EVENTS_EDITEVENT_URL = function(id) {
  return HOST_URL + "/activities/" + id + "/update/";
};
// 修改活动（获取信息） get
const EVENTS_EDITINFO_URL = function(id) {
  return HOST_URL + "/activities/" + id + "/info/";
};
// 活动列表
// 表格 get
const EVENTS_ELTABLE_URL = HOST_URL + "/activities/";
// 删除活动 post
const EVENTS_ELDELETE_URL = function(id) {
  return HOST_URL + "/activities/" + id + "/delete/";
};
// 下线活动 post
const EVENTS_OFFLINEINFO_URL = function(id) {
  return HOST_URL + "/activities/" + id + "/down/";
};
// 查看活动下的券（表格）get
const EVENTS_VIEWEVENT_URL = function(id) {
  return HOST_URL + "/activities/" + id + "/coupons/";
};


/* 商家管理 */
// 系统公告
// 提交 post
const SYSTEMINFO_SUBMIT_URL = HOST_URL + "/notice/";
// 举报
// 表格 get
const COMPAINTS_TABLE_URL = HOST_URL + "/reports/";
// 提交 post
const COMPAINTS_SUBMIT_URL = HOST_URL + "/reports/put/";


module.exports = {
  HOST_URL,
  CENTER_URL,
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
  BDREGISTER_APPLFILLING_URL,
  BDREGISTER_EDITFILLING_URL,
  BDREGISTER_NEWREGISTER_URL,
  BDREGISTER_DELETE_URL,
  BDREGISTER_BRAEDITFILLING_URL,
  BDREGISTER_BRALIST_URL,
  BDREGISTER_BRAREGISTER_URL,
  BUSLIST_TABLE_URL,
  BUSLIST_DOWNLOAD_URL,
  BUSLIST_BRANCH_URL,
  BUSLIST_BASIC_URL,
  BUSLIST_BLIC_URL,
  BUSLIST_SLIC_URL,
  BUSLIST_CONSTRA_URL,
  BUSLIST_ID_URL,
  BUSLIST_SETTLER_URL,
  BUSLIST_SUBMITCONSTRA_URL,
  BUSLIST_SUBMIT_URL,
  BDVERIFY_APPLYTABLE_URL,
  BDVERIFY_EDITTABLE_URL,
  BDVERIFY_APPLYPASS_URL,
  BDVERIFY_FILLING_URL,
  BDVERIFY_EDITPASS_URL,
  PROVERIFY_TABLE_URL,
  PROVERIFY_FILLING_URL,
  PROVERIFY_PASS_URL,
  CHECKVERIFY_APPLY_URL,
  CHECKVERIFY_RECORD_DOWNLOAD_URL,
  CHECKVERIFY_APPLY_TODYDL_URL,
  CHECKVERIFY_SUCCESS_SEARCH_URL,
  CHECKVERIFY_EDITINFO_URL,
  EXCEL_UPLOAD_URL,
  CHECKVERIFY_BANKEDIT_URL,
  CHECKVERIFY_FILLING_URL,
  CHECKVERIFY_REFUNDRECORD_URL,
  CHECKVERIFY_REFUND_SEARCH_URL,
  CHECKVERIFY_REFUND_URL,
  PROLIST_TABLE_URL,
  PROLIST_JMDATA_URL,
  PROLIST_JM_URL,
  SYSTEMINFO_SUBMIT_URL,
  COMPAINTS_TABLE_URL,
  COMPAINTS_SUBMIT_URL,
  EVENTS_CMTABLE_URL,
  EVENTS_CMVIEWSHOPS_URL,
  EVENTS_CMDELETE_URL,
  EVENTS_CMSEARCHSHOPS_URL,
  EVENTS_CMADDSHOPS_URL,
  EVENTS_CMEDIT_URL,
  EVENTS_CMGETINFO_URL,
  EVENTS_CLTABLE_URL,
  EVENTS_ONLINE_URL,
  EVENTS_EDITINFO_URL,
  EVENTS_EDITEVENT_URL,
  EVENTS_ELTABLE_URL,
  EVENTS_ELDELETE_URL,
  EVENTS_OFFLINEINFO_URL,
  EVENTS_VIEWEVENT_URL,
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
  TEMP_PHOTOS_URL,
  FESTIVALS_URL,
  CNTER_REGISTER
};
