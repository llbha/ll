const config = require('./utils/config.js');
const util = require('./utils/util.js');
//app.js

App({
  onLaunch: function() {
    var that = this

    //调用方法，判断用户是否登录
    that.onGetStroeToken();

    //检查手机机型
    that.checkIsIPhoneX();

    //判断版本，提示用户升级
    that.check_version();


    wx.login({
      success: res => {
        console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey
        wx.request({
          url: "https://api.aiera.tech/aiera/adm/openid",
          header: {
            'content-type': 'application/json',
          },
          method: 'POST',
          data: {
            code: res.code,
          },
          success: function (res) {
            console.log("获取openid成功", res.data);
            if (res.data.code == "0") {
              // wx.setStorageSync('session_key', res.data.session_key)
              wx.setStorageSync('openid', res.data.openid)
              if (res.data.unionid){
                wx.setStorageSync('unionid', res.data.unionid)
              }
            } else {
              console.log('获取openid失败：', res.data.msg);
            }
          },
          fail: function (res) {
            console.log('请求openid失败：', res.errMsg);
          },
        })
      }
   });

  //   wx.getSetting({
  //     success: res => {
  //       if (res.authSetting['scope.userInfo']) {
  //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
  //         wx.getUserInfo({
  //           success: res => {
  //             // 可以将 res 发送给后台解码出 unionId
  //             console.log(res)

  //             if (!wx.getStorageSync("unionid")) {
  //             wx.request({
  //               url: "https://api.aiera.tech/aiera/sys/WxUnionId",
  //               header: {
  //                 'content-type': 'application/json',
  //               },
  //               method: 'POST',
  //               data: {
  //                 sessionKey: wx.getStorageSync("session_key"),
  //                 encryptedData: res.encryptedData,
  //                 iv: res.iv
  //               },
  //               success: function (res) {
  //                 console.log("获取unionid成功", res.data);
  //                 if (res.data.code == "0") {
  //                   wx.setStorageSync('unionid', res.data.data.unionId)
  //                   wx.setStorageSync('userInfo', res.data.data)
  //                 } else {
  //                   console.log('获取unionid失败：', res.data.msg);
  //                 }
  //               },
  //             })

  //           }else{
  //               wx.setStorageSync('userInfo', res.userInfo)
  //           }
  //         }
  //         })
  //     }
  //     }
  //   })
  },


  //重新获取token
  gettoken: function(){
  let params = {
    'username': wx.getStorageSync('username'),
    'password': wx.getStorageSync('password'),
    'openid': wx.getStorageSync('openid'),
    'source': 'mini_program'
  }
  console.log(params)
  let url = '/aiera/adm/login';
  util.post(url, params).then(function (res) {
    // console.log("登录llll", res.data.token)
    if ("0" == res.data.code) {
      let token = res.data.token;
      wx.setStorageSync('token', token);
    } else {
      console.log('获取token失败')
    }
})
},


  // 判断用户是否登录
  onGetStroeToken: function() {
    let token = wx.getStorageSync("token");
    console.log("token", token)
    if (token) {
      wx.switchTab({
        url: '/pages/index/index',
      });
    } else {
      wx.reLaunch({
        url: '/pages/login/login',
      })
    }
  },



  // 判断手机机型
  checkIsIPhoneX: function() {
    const self = this
    wx.getSystemInfo({
      success: function(res) {
        // 或者根据 screenHeight 进行判断
        if (res.screenHeight >= 812) {
          self.globalData.isIPX = true
        }
      }
    })
  },


  //保存推送码
  collectFormIds: function(formId) {
    let formIds = this.globalData.globalFormIds; // 获取全局推送码数组
    if (!formIds) {
      formIds = [];
    }
    let data = {
      "formid": formId,
      "expire": this.formatTimestamp(new Date().getTime() + 604800000), // 7天后的过期时间戳
      "openid": wx.getStorageSync('openid')
    }
    formIds.push(data);
    this.globalData.globalFormIds = formIds; // 保存推送码并赋值给全局变量
    // console.log(this.globalData.globalFormIds);
    // let num = this.globalData.globalFormIds.length
    // console.log(num);
    // if (num == 10) {
      this.uploadFormIds()
    // }
  },
  //上传推送码
  uploadFormIds: function() {
    // console.log('推送成功');
    // this.globalData.globalFormIds = ''
    var that = this
    // console.log('eeeee', wx.getStorageSync('token'))
    wx.request({
      url: 'https://api.aiera.tech/aiera/adm/upload/wxformid',
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      method: 'POST',
      data: {
        data: this.globalData.globalFormIds
      },
      success: function(res) {
        console.log('list', res)
        if ("0" == res.data.code) {
          console.log('推送成功');
          that.globalData.globalFormIds = ''
        } else {
          console.log('推送失败')
          that.globalData.globalFormIds = ''
        }
      }
    })

  },


  //时间格式化 时间戳-->yyyy-MM-dd HH:mm:ss
  formatTimestamp: function(timestamp) {
    var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = this.change(date.getDate()) + ' ';
    var h = this.change(date.getHours()) + ':';
    var m = this.change(date.getMinutes()) + ':';
    var s = this.change(date.getSeconds());
    return Y + M + D + h + m + s;
  },
  change: function(t) {
    if (t < 10) {
      return "0" + t;
    } else {
      return t;
    }
  },



  //检查版本，让用户更新版本
  check_version: function() {
    // 检测是否可以调用getUpdateManager检查更新
    if (!wx.canIUse("getUpdateManager")) return;
    //调用wx.getUpdateManager()对象
    let updateManager = wx.getUpdateManager();
    // 获取全局唯一的版本更新管理器，用于管理小程序更新
    updateManager.onCheckForUpdate(function(res) {
      // 监听向微信后台请求检查更新结果事件 
      console.log("是否有新版本：" + res.hasUpdate);
      if (res.hasUpdate) {
        //如果有新版本                
        // 小程序有新版本，会主动触发下载操作        
        updateManager.onUpdateReady(function() {
          //当新版本下载完成，会进行回调          
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，单击确定重启小程序',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启小程序               
                updateManager.applyUpdate();
              }
            }
          })
        })


        //小程序有新版本，会主动触发下载操作（无需开发者触发）        
        updateManager.onUpdateFailed(function() {
          //当新版本下载失败，会进行回调          
          wx.showModal({
            title: '提示',
            content: '检查到有新版本，但下载失败，请稍后尝试',
            showCancel: false,
          })
        })
      }
    });
  },

  //全局变量
  globalData: {
    userInfo: null,
    login: false,
    isIPX: false,
    globalFormIds: '', //推送码
  },


})