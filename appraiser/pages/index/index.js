const util = require('../../utils/util.js');
const config = require('../../utils/config.js');
const check = require('../../utils/check.js');
const common = require('../../utils/common.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    pagenum: 1,
    userID: wx.getStorageSync('username'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.addInfo()
  },

  onShow: function(options) {
    var that = this
    that.setData({
      pagenum: 1,
      userID: wx.getStorageSync('username'),
    })
    that.addInfo()
  },


  //下拉刷新
  onPullDownRefresh: function() {
    wx.showToast({
      title: 'loading....',
      icon: 'loading',
    })
    let that = this;
    that.addInfo()
    that.setData({
      pagenum: 1,
      userID: wx.getStorageSync('username'),
    })
    // wx.showNavigationBarLoading() //在标题栏中显示加载
      setTimeout(function () {
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },


  /**
   * 上拉加载数据
   */
  onReachBottom: function() {
    wx.showToast({
      title: 'loading....',
      icon: 'loading',
      duration: 500,
    })
    let that = this;
    that.setData({
      pagenum: that.data.pagenum + 1, //每次触发上拉事件，把pagenum+1
    })
    that.fetchOrderList();
  },


  /**
   * 请求数据
   */
  fetchOrderList: function() {
    let that = this
    let pagenum = that.data.pagenum
    wx.request({
      url: 'https://api.aiera.tech/aiera/adm/orders/list',
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      method: 'POST',
      data: {
        sortOrder: "desc",
        pageSize: 10,
        pageNumber: pagenum,
      },
      success: function(res) {
        console.log('pagenum', pagenum)
        console.log('res', res.data)
        if ("0" == res.data.code) {
          let list = res.data.rows;
          that.setData({
            list: that.data.list.concat(list)
          })
          console.log('list', list)
        } else if ('401' == res.data.code) {
          console.log('token值失效')
          app.gettoken()
          setTimeout(function () {
            that.fetchOrderList()
          }, 1000);
        } else {
          console.log('list', list)
        }
      }
    })
  },


  /**
   * 加载初始化数据
   */
  addInfo: function() {
    var that = this
    wx.request({
      url: 'https://api.aiera.tech/aiera/adm/orders/list',
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      method: 'POST',
      data: {
        sortOrder: "desc",
        pageSize: 10,
        pageNumber: 1,
      },
      success: function(res) {
        console.log('res', res.data)
        if ("0" == res.data.code) {
          let list = res.data.rows;
          that.setData({
            list
          })
          console.log('list', list)
        } else if ('401' == res.data.code) {
          console.log('token失效')
          app.gettoken()
          setTimeout(function () {
            that.addInfo()
          }, 1000);
        } else {
          console.log('list', list)
        }
      }
    })
  },


// 图片加载失败 默认照片
  errorFunction: function(event) {
    console.log(event)
    var index = event.currentTarget.dataset.num
    var img = 'list[' + index + '].picFilePath'
    this.setData({
      [img]: '/img/handle/'
    })
  },


  /**
   * 进入鉴定中心(刷新)
   */
  index: function(e) {
    var data = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },



  /**
   * 跳转到鉴别数量页面
   */
  statistics: function(e) {
    wx.navigateTo({
      url: '/pages/statistics/statistics'
    })
  },



  /**
   * 退出登录
   */
  quit: function(e) {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },


  /**
   * 进入鉴定详情页
   */
  detailpage: function(e) {
    var data = e.currentTarget.dataset
    console.log('data', data.index)
    data = JSON.stringify(data.index)
    wx.navigateTo({
      url: '/pages/identify/identify?item=' + data
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


})