const util = require('../../utils/util.js');
const config = require('../../utils/config.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: '',
    navbarActiveIndex: 0,
    navbarTitle: '',
    phone: ''
  },

  /**
   * 获取用户名
   */
  getUsername: function(e) {
    this.setData({
      username: e.detail.value
    })
  },
  /**
   * 获取密码
   */
  getPassword: function(e) {
    this.setData({
      password: e.detail.value
    })
  },

  /**
   * 登录
   */
  login: function() {
    let that = this;
    let name = that.data.username;
    let password = that.data.password;
    if (!name) {
      wx.showToast({
        icon: 'none',
        title: '请填入用户名',
        duration: 1000
      })
      return;
    }
    if (!password) {
      wx.showToast({
        icon: 'none',
        title: '请填入密码',
        duration: 1000
      })
      return;
    }

    let params = {
      'username': name,
      'password': password,
      'openid': wx.getStorageSync('openid'),
      'source': 'mini_program'
    }

    console.log(params)
    let url = config.api.login;
    util.post(url, params).then(function(res) {
      console.log("登录", res)
      if ("0" == res.data.code) {
        let token = res.data.token;
        wx.setStorageSync('token', token);
        wx.setStorageSync('username', params.username);
        wx.setStorageSync('password', params.password);
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 2000
        })
        that.clearInputEvent();
        wx.redirectTo({
          url: '../index/index',
        })
      } else if ('405' == res.data.code) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      } else if ('406' == res.data.code) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      } else if ('402' == res.data.code) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: '网络异常，请稍候再试',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },


  //搜集推送码  --保存推送码
  saveFormId: function(e) {
    console.log("推送码", e.detail.formId)
    let formId = e.detail.formId; //获取推送码
    //要在真机调试下，才有推送码
    if (formId != 'the formId is a mock one') {
      app.collectFormIds(formId); //保存推送码
    }
  },


  /**
   * 重置
   */
  clearInputEvent: function() {
    this.setData({
      username: '',
      password: '',

    })
  },
})