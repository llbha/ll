const common = require('./common.js');

/*
 * 时间戳转换为yyyy-MM-dd hh:mm:ss 格式  formatDate()
 * inputTime   时间戳
 */
function formatDate(inputTime) {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//正式版本接口路径
const formalUlr = common.formalUlr;

//切换服务器 false为开发服务器 true为正式服务器
const DEBUG = true;

let random;

//封装接口
const http = ({
  url = "",
  params,
  ...other
} = {}) => {
  wx.showLoading({
    title: "加载中"
  });
  return new Promise(function(resolve, reject) {
    wx.request({
      url: `${!DEBUG ? testUrl : formalUlr}${url}`,
      data: params,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      ...other,
      success: function(res) {
        resolve(res);
        wx.hideLoading();
      },
      fail: function(res) {
        reject(res);
        wx.hideLoading();
      }
    })
  })
}

//函数节流
function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }
  let _lastTime = null;
  // 返回新的函数
  return function() {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments) //将this和参数传给原函数
      _lastTime = _nowTime;
    }
  }
}


module.exports = {
  throttle: throttle,
  DEBUG: DEBUG,
  formatDate: formatDate,
  get(url, params = {}) {
    return http({
      url,
      params,
      method: "GET"
    });
  },
  post(url, params = {}) {
    return http({
      url,
      params,
      method: "POST"
    });
  },
  put(url, params = {}) {
    return http({
      url,
      params,
      method: "put"
    });
  },
  patch(url, params = {}) {
    return http({
      url,
      params,
      method: "patch"
    });
  },
  myDelete(url, params = {}) {
    return http({
      url,
      params,
      method: "delete"
    });
  },

}