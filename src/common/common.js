/* 根据权限选择进入哪一个页面
  * perms: 用户所有权限
  * path: router指向路径
*/
function pageToContent(perms) {
  var path = null;
  if (perms.item_list === 1) {  /* 管理员账号 */
    path = "/setting";
  } else {                      /* BD */
    if (perms.bus_apply === 1 || perms.bus_register === 1) {
      if (perms.bus_apply === 1) {
        path = "/bus_apply";
      } else {
        path = "/bus_register/:type";
      }
    } else {  /* 审核人员 */
      if (perms.bus_verify === 1 || perms.checkout_verify === 1 || perms.project_verify === 1) {
        if (perms.bus_verify === 1) {
          path = "/bus_review/:type";
        } else if (perms.checkout_verify === 1) {
          path = "/checkout_verify/:type";
        } else {
          path = "/project_verify/:type";
        }
      }
    }
  }
  return path;
}


/* 获取url参数
 * path: 路径
 * name: 参数名称
*/
function getUrlParameters(path, name) {
  var str = path.split("/");
  var ss = str[str.length - 1];
  var hash = ss.split("#");
  var res = decodeURI(hash[hash.length - 1]);
  // 构造一个含有目标参数的正则表达式对象
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = res.match(reg);
  // 返回参数值
  if (r != null) {
    return unescape(r[2]);
  } else {
    return "";
  }
}
/* 商家中心获取url参数 */
function getParmString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r !== null) {
    return unescape(r[2]);
  } else {
    return null;
  }
}


/* 设置cookie属性值
  * cookieName:cookie属性名
  * value:cookie属性值,
  * time:时间
*/
function setCookie(cookieName, value, days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = cookieName + "=" + encodeURIComponent(value) + ";expires=" + date.toUTCString();
  } else {
    document.cookie = cookieName + "=" + value;
  }
}
/* 读取cookie */
function getCookie(cookieName) {
  var res = null;
  var where = document.cookie;
  var cook = where.split(";");
  for (var i = 0; i < cook.length; i++) {
    let arr = cook[i].split("=");
    if (cookieName === arr[0].replace(/(^\s*)|(\s*$)/g, "")) {
      if (arr.length > 1) {
        res = decodeURIComponent(arr[1]);
      }
    }
  }
  return res;
}
/* 删除cookie */
function clearCookie(cookieName) {
  if (document.cookie.indexOf(cookieName + "=") !== -1) {
    var date = new Date();
    // 将date设置为 time 天以后的时间
    date.setDate(date.getTime() - 1);
    document.cookie = cookieName + "=" + "" + ";expires=" + date.toUTCString();
  }
}


/* 获取对象数组中指定属性下的值(省市区等根据id查找名称)
 * arr: 查找的数组
 * ser: 查询值
 * id: 指定对象属性名称
 * name: 指定对象属性名称
*/
function getValue(arr, ser, id, name) {
  var value = "";
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i];
    if (item[id] === ser) {
      value = item[name];
      break;
    }
  }
  return value;
}


/* ************ 验证 ************
* value: 输入值
* title: 名称
*/
/* 姓名验证 */
function isName(value) {
  var obj = {};
  if (value === "") {
    obj = {flag: false, error: "请输入姓名"};
  } else {
    if (/^\s+$/.test(value)) {
      obj = {flag: false, error: "请输入姓名"};
    } else {
      if (!(/^[\x21-\x7e\u4e00-\u9fa5]{1,30}$/.test(value))) {
        obj = {
          flag: false,
          error: "姓名为1~30位，且只能包含数字、字母及除空格外的特殊符号"
        };
      } else {
        obj = {flag: true, error: ""};
      }
    }
  }
  return obj;
}
/* 手机号码验证 */
function isPhone(value) {
  var obj = {};
  if (value === "") {
    obj = {flag: false, error: "请填写手机号码"};
  } else {
    if (/^\s+$/.test(value)) {
      obj = {flag: false, error: "请填写手机号码"};
    } else {
      if (!(/^1\d{10}$/.test(value))) {
        obj = {flag: false, error: "手机号码格式不正确"};
      } else {
        obj = {flag: true, error: ""};
      }
    }
  }
  return obj;
}

/* 后台审核 */
/* 账户验证 账号长度为2~63位，且只能包含数字、字母及. _ - */
function isAccount(value) {
  var obj = {};
  if (value === "") {
    obj = {flag: false, error: "请输入账号"};
  } else {
    if (/^\s+$/.test(value)) {
      obj = {flag: false, error: "请输入账号"};
    } else {
      if (!(/^[\w\d._-]{2,63}$/.test(value))) {
        obj = {flag: false, error: "账号为2~63位，且只能包含数字、字母及. _ -"};
      } else {
        obj = {flag: true, error: ""};
      }
    }
  }
  return obj;
}
/* 密码验证 */
function isPassword(value) {
  var obj = {};
  if (!(/^[\x21-\x7e]{6,63}$/.test(value))) {   // 匹配键盘上所有可见字符
    obj = {
      flag: false,
      error: "密码为6~32位，且只能包含数字、字母及除空格外的特殊符号"
    };
  } else {
    obj = {flag: true, error: ""};
  }
  return obj;
}

/* 营业执照,餐饮许可证名称 */
/* eslint-disable no-useless-escape */
function isLicName(value, title) {
  var obj = {};
  if (value === "") {
    obj = {flag: false, error: "请填写" + title + "名称"};
  } else {
    if (/^\s+$/.test(value)) {
      obj = {flag: false, error: "请填写正确的" + title + "名称"};
    } else {
      if (!(/^[a-zA-Z\u4e00-\u9fa5\d\(\)]{1,}$/.test(value))) {
        obj = {flag: false, error: "请填写正确的" + title + "名称"};
      } else {
        obj = {flag: true, error: ""};
      }
    }
  }
  return obj;
}
/* 营业执照,餐饮许可证,证件号码 */
function isLicNumber(value, title) {
  var obj = {};
  if (value === "") {
    obj = {flag: false, error: "请填写" + title};
  } else {
    if (/^\s+$/.test(value)) {
      obj = {flag: false, error: title + "格式不正确"};
    } else {
      if (!(/^[a-zA-Z\d]{1,}$/.test(value))) {
        obj = {flag: false, error: title + "格式不正确"};
      } else {
        obj = {flag: true, error: ""};
      }
    }
  }
  return obj;
}
/* 营业执照,餐饮许可证地址 */
/* eslint-disable no-useless-escape */
function isLicAdd(value, title) {
  var obj = {};
  if (value === "") {
    obj = {flag: false, error: "请填写" + title + "地址"};
  } else {
    if (/^\s+$/.test(value)) {
      obj = {flag: false, error: title + "地址" + "格式不正确"};
    } else {
      if (!(/^[a-zA-Z\u4e00-\u9fa5\d\(\)]{1,}$/.test(value))) {
        obj = {flag: false, error: title + "地址" + "格式不正确"};
      } else {
        obj = {flag: true, error: ""};
      }
    }
  }
  return obj;
}

/* 银行卡号 */
function isbankNumber(value) {
  var obj = {};
  if (value === "") {
    obj = {flag: false, error: "请填写银行卡号"};
  } else {
    if (/^\s+$/.test(value)) {
      obj = {flag: false, error: "请填写正确的银行卡号"};
    } else {
      if (!(/^\d{1,}$/.test(value))) {
        obj = {flag: false, error: "请填写正确的银行卡号"};
      } else {
        obj = {flag: true, error: ""};
      }
    }
  }
  return obj;
}

/* 人均 */
function isCostPerPerson(value) {
  var obj = {};
  if (value === "") {
    obj = {flag: false, error: "请填写人均"};
  } else {
    if (/^\s+$/.test(value)) {
      obj = {flag: false, error: "请填写人均"};
    } else {
      if (!(/^\d{1,4}$|^(\d{1,4})\.(\d{1,2})$/.test(value))) {
        obj = {flag: false, error: "人均为不高于4位且最多包含两位小数的数字"};
      } else {
        obj = {flag: true, error: ""};
      }
    }
  }
  return obj;
}
/* 月销售额 */
function isSalePerMonth(value) {
  var obj = {};
  if (/^\s+$/.test(value)) {
    obj = {flag: false, error: "请填写月销售额"};
  } else {
    if (!(/^\d{1,9}$|^(\d{1,9})\.(\d{1,2})$/.test(value))) {
      obj = {flag: false, error: "月销售额为不高于9位且最多包含两位小数的数字"};
    } else {
      obj = {flag: true, error: ""};
    }
  }
  return obj;
}
/* 佣金比例 */
function iscommision(value) {
  var obj = {};
  if (value === "") {
    obj = {flag: false, error: "请填写佣金比例"};
  } else {
    if (/^\s+$/.test(value)) {
      obj = {flag: false, error: "请填写佣金比例"};
    } else {
      if (!(/^\d{1,}$|^(\d{1,})\.(\d{1,})$/.test(value))) {
        obj = {flag: false, error: "佣金比例必须为数字"};
      } else {
        obj = {flag: true, error: ""};
      }
    }
  }
  return obj;
}
/* 整数 */
function isInteger(value, title) {
  var obj = {};
  if (value === "") {
    obj = {flag: false, error: "请填写" + title};
  } else {
    if (/^\s+$/.test(value)) {
      obj = {flag: false, error: "请填写" + title};
    } else {
      if (!(/^\d{1,}$/.test(value))) {
        obj = {flag: false, error: title + "必须为数字"};
      } else {
        obj = {flag: true, error: ""};
      }
    }
  }
  return obj;
}


/* 模态框
* fun: 执行函数；
* isRight: 正确还是错误标志（true为正确标志，false为错误标志）；
* tips: 提示信息；
* visible: 显示与否（true为显示，false为隐藏）
*/
function modalHide(fun) {
  setTimeout(fun, 2000);
}

/* 节假日对比
 * dateFestivals：节假日期比对数据
 * begin: 开始时间
 * end: 结束时间
*/
function compareFestival(dateFestivals, begin, end) {
  var res = "";
  for (let i = 0; i < dateFestivals.length; i++) {
    if (begin === dateFestivals[i].begin_date_ex && end === dateFestivals[i].end_date_ex) {
      res = dateFestivals[i].name;
    }
  }
  return res;
}


/* 比较数据是否相同 */
/* 普通数组 */
function compareArrData(arr1, arr2) {
  var flag = false;
  if (arr1.length !== arr2.length) {
    return false;
  } else {
    for (let i = 0; i < arr1.length; i++) {
      for (let j = 0; j < arr2.length; j++) {
        if (arr1[i] !== arr2[j]) {
          return false;
        } else {
          flag = true;
        }
      }
    }
  }
  return flag;
}
/* 对象数组 */
function compareObjArrData(arr1, arr2) {
  var flag = false;
  if (arr1.length !== arr2.length) {
    return false;
  } else {
    for (let i = 0; i < arr1.length; i++) {
      for (let key in arr1[i]) {
        for (let j = 0; j < arr2.length; j++) {
          if (arr1[i][key] !== arr2[j][key]) {
            return false;
          } else {
            flag = true;
          }
        }
      }
    }
  }
  return flag;
}

module.exports = {
  pageToContent,
  getUrlParameters,
  getParmString,
  setCookie,
  getCookie,
  clearCookie,
  getValue,
  isName,
  isAccount,
  isPassword,
  isPhone,
  isLicName,
  isLicNumber,
  isLicAdd,
  isbankNumber,
  isCostPerPerson,
  isSalePerMonth,
  iscommision,
  isInteger,
  modalHide,
  compareArrData,
  compareObjArrData,
  compareFestival
};
