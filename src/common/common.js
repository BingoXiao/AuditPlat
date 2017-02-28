// 获取url参数
function getUrlParameters(path, name) {
  var str = path.split("/")
  var ss = str[str.length - 1]
  var hash = ss.split("#")
  var res = hash[hash.length - 1]
  // 构造一个含有目标参数的正则表达式对象
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
  var r = res.match(reg)
  // 返回参数值
  if (r != null) {
    return unescape(r[2])
  } else {
    return ""
  }
}

// 设置cookie属性值
// cookieName cookie属性名, value cookie属性值, time 时间
function setCookie(cookieName, value, days) {
  if (days) {
    var date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = cookieName + "=" + value + ";expires=" + date.toUTCString()
  } else {
    document.cookie = cookieName + "=" + value
  }
}

// 读取cookie
function getCookie(cookieName) {
  var acookie = document.cookie.split("; ")
  for (var i = 0; i < acookie.length; i++) {
    var arr = acookie[i].split("=")
    if (cookieName === arr[0]) {
      if (arr.length > 1) {
        return unescape(arr[1])
      }
    } else {
      return null
    }
  }
}

// 删除cookie
function clearCookie(cookieName) {
  if (document.cookie.indexOf(cookieName + "=") !== -1) {
    var date = new Date()
    // 将date设置为 time 天以后的时间
    date.setDate(date.getTime() - 1)
    document.cookie = cookieName + "=" + "" + ";expires=" + date.toUTCString()
  }
}


/* ************ 验证 ************ */
// 姓名验证
function isName(value) {
  var obj = {}
  if (value === "") {
    obj = {flag: false, error: "请输入姓名"}
  } else {
    if (/^\s+$/.test(value)) {
      obj = {flag: false, error: "请输入姓名"}
    } else {
      if (!(/^[\x21-\x7e\u4e00-\u9fa5]{1,30}$/.test(value))) {
        obj = {
          flag: false,
          error: "姓名为1~30位，且只能包含数字、字母及除空格外的特殊符号"
        }
      } else {
        obj = {flag: true, error: ""}
      }
    }
  }
  return obj
}

// 手机号码验证
function isPhone(value) {
  var obj = {}
  if (value === "") {
    obj = {flag: false, error: "请填写手机号码"}
  } else {
    if (/^\s+$/.test(value)) {
      obj = {flag: false, error: "请填写手机号码"}
    } else {
      if (!(/^1\d{10}$/.test(value))) {
        obj = {flag: false, error: "手机号码格式不正确"}
      } else {
        obj = {flag: true, error: ""}
      }
    }
  }
  return obj
}

// 后台审核
// 账户验证 账号长度为2~63位，且只能包含数字、字母及. _ -
function isAccount(value) {
  var obj = {}
  if (value === "") {
    obj = {flag: false, error: "请输入账号"}
  } else {
    if (/^\s+$/.test(value)) {
      obj = {flag: false, error: "请输入账号"}
    } else {
      if (!(/^[\w\d._-]{2,63}$/.test(value))) {
        obj = {flag: false, error: "账号为2~63位，且只能包含数字、字母及. _ -"}
      } else {
        obj = {flag: true, error: ""}
      }
    }
  }
  return obj
}

// 密码验证
function isPassword(value) {
  var obj = {}
  if (!(/^[\x21-\x7e]{6,63}$/.test(value))) {   // 匹配键盘上所有可见字符
    obj = {
      flag: false,
      error: "密码为6~32位，且只能包含数字、字母及除空格外的特殊符号"
    }
  } else {
    obj = {flag: true, error: ""}
  }
  return obj
}

// 营业执照,餐饮许可证名称
function isLicName(value, str) {
  var obj = {}
  if (value === "") {
    obj = {flag: false, error: "请填写" + str + "名称"}
  } else {
    if (/^\s+$/.test(value)) {
      obj = {flag: false, error: "请填写正确的" + str + "名称"}
    } else {
      if (!(/^[a-zA-Z\u4e00-\u9fa5\d]{1,}$/.test(value))) {
        obj = {flag: false, error: "请填写正确的" + str + "名称"}
      } else {
        obj = {flag: true, error: ""}
      }
    }
  }
  return obj
}

// 营业执照,餐饮许可证号码
function isLicNumber(value, str) {
  var obj = {}
  if (value === "") {
    obj = {flag: false, error: "请填写" + str + "注册号"}
  } else {
    if (/^\s+$/.test(value)) {
      obj = {flag: false, error: str + "注册号" + "格式不正确"}
    } else {
      if (!(/^[a-zA-Z\d]{1,}$/.test(value))) {
        obj = {flag: false, error: str + "注册号" + "格式不正确"}
      } else {
        obj = {flag: true, error: ""}
      }
    }
  }
  return obj
}

// 营业执照,餐饮许可证地址
function isLicAdd(value, str) {
  var obj = {}
  if (value === "") {
    obj = {flag: false, error: "请填写" + str + "地址"}
  } else {
    if (/^\s+$/.test(value)) {
      obj = {flag: false, error: str + "地址" + "格式不正确"}
    } else {
      if (!(/^[a-zA-Z\u4e00-\u9fa5\d]{1,}$/.test(value))) {
        obj = {flag: false, error: str + "地址" + "格式不正确"}
      } else {
        obj = {flag: true, error: ""}
      }
    }
  }
  return obj
}


/* 模态框 */
function modalHide(fun) {
  setTimeout(fun, 2000)
}


module.exports = {
  getUrlParameters,
  setCookie,
  getCookie,
  clearCookie,
  isName,
  isAccount,
  isPassword,
  isPhone,
  isLicName,
  isLicNumber,
  isLicAdd,
  modalHide
}
