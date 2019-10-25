let api = {
  login: '/aiera/adm/login', //登录
  userinfo: '/aiera/adm/user/info', //用户信息
  order_list: '/aiera/adm/orders/list', //鉴定列表
  getopenid: '/aiera/sys/WxOpenId',  //获取openid
  userCheckCountlist :"/aiera/sys/orders/userCheckCountlist",  //获取用户鉴定数量
  orderdetail: "/aiera/adm/ordersDetail/list",  //获取详情订单
  updateorder: "/aiera/adm/orders/update"   // 提交鉴定结果
  
}

//正式版
let appID = {
  appid: 'wx910260a7095a5e24'
}


// module.exports.appSecret = appSecret;
module.exports.appID = appID;
module.exports.api = api;