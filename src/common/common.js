/**
 * 设置cookie属性值
 * cookieName cookie属性名
 * value cookie属性值
 * time 时间
 */
// 设置cookie
function setCookie (cookieName, value, days) {
  if (days) {
    var date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = cookieName + "=" + value + ";expires=" + date.toUTCString()
  } else {
    document.cookie = cookieName + "=" + value
  }
}

// 读取cookie
function getCookie (cookieName) {
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
function clearCookie (cookieName) {
  if (document.cookie.indexOf(cookieName + "=") !== -1) {
    var date = new Date()
    // 将date设置为 time 天以后的时间
    date.setDate(date.getTime() - 1)
    document.cookie = cookieName + "=" + "" + ";expires=" + date.toUTCString()
  }
}

module.exports = {
  setCookie,
  getCookie,
  clearCookie
}
