const util = require('../../utils/util.js');
const config = require('../../utils/config.js');
const check = require('../../utils/check.js');
const common = require('../../utils/common.js');
const gettoday = require('../../utils/getToday.js');
const app = getApp();

const date = new Date(); //获取系统日期
const years = []
const months = []
const days = []
const bigMonth = [1, 3, 5, 7, 8, 10, 12]

console.log('今天', gettoday.getToday())

//将日期分开写入对应数组

//年
for (let i =
    1990; i <= date.getFullYear(); i++) {
  years.push(i);
}

//月
for (let i =
    1; i <= 12; i++) {
  months.push(i);
}

//日
for (let i =
    1; i <= 31; i++) {
  days.push(i);
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    years: years,
    year: date.getFullYear(),
    months: months,
    month: 2,
    days: days,
    day: 2,
    value: [9999, gettoday.getToday().split("-")[1] - 1, gettoday.getToday().split("-")[2] - 1],
    showModalStatus: false,
    userID: wx.getStorageSync('username'),
    today: gettoday.getToday(),
    def: true,
    status: '',
    showModal: false,
    right_time: gettoday.getToday(),
    left_time: gettoday.getToday(),
    leftSelect: '',
    rightSeclect: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.addInfo()
  },


  /**
   * 加载初始化数据
   */
  addInfo: function() {
    var that = this
    wx.request({
      url: 'https://api.aiera.tech/aiera/sys/orders/userCheckCountlist',
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      method: 'POST',
      data: {
        enddate: that.data.right_time,
        startdate: that.data.left_time,
        pageSize: 100,
        pageNumber: 1,
      },
      success: function(res) {
        console.log('res', res.data)
        if ("0" == res.data.code) {
          // let list = res.data.rows;
          that.setData({
            list: res.data.rows
          })
          console.log('获取鉴定结果list', res.data.rows)
        } else if ('401' == res.data.code) {
          console.log('token值失效')
          app.gettoken()
          that.addInfo()
          
        }else {
          console.log('获取鉴别结果list', res.data.rows)
        }
      }
    })

  },


  //下拉刷新
  onPullDownRefresh: function () {
    wx.showToast({
      title: 'loading....',
      icon: 'loading'
    })
    let that = this;
    that.addInfo()
    // wx.showNavigationBarLoading() //在标题栏中显示加载
      setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);

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
   * 进入鉴别中心(刷新)
   */
  index: function(e) {
    var data = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/index/index'
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



  //搜集推送码  --保存推送码
  saveFormId: function(e) {
    console.log("推送码", e.detail.formId)
    let formId = e.detail.formId; //获取推送码
    //要在真机调试下，才有推送码
    if (formId != 'the formId is a mock one') {
      app.collectFormIds(formId); //保存推送码
    }
  },


  //显示对话框
  showModal: function() {

    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })

    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })

    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },


  //隐藏对话框
  hideModal: function() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })

    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })

    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },


  // 下拉选择时间
  pull_down: function(e) {
    var that = this
    that.showModal()
    this.setData({
      showModalStatus: true,
      leftSelect: '_ischose',
      rightSeclect: ''
    })
  },


  //判断元素是否在一个数组
  contains: function(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) {
        return true;
      }
    }
    return false;
  },

  setDays: function(day) {
    const temp = [];
    for (let i = 1; i <= day; i++) {
      temp.push(i)
    }
    this.setData({
      days: temp,
    })
  },


  showLoading: function() {
    wx.showLoading({
        title: '加载中...',
      }),
      setTimeout(function() {
        wx.hideLoading()
      }, 2000)
  },

  //选择滚动器改变触发事件
  bindChange: function(e) {
    const val = e.detail.value;
    //判断月的天数
    const setYear =
      this.data.years[val[0]];
    const setMonth =
      this.data.months[val[1]];
    const setDay =
      this.data.days[val[2]]

    // console.log(setYear + '-' + setMonth + '-' + setDay);

    //闰年
    if (setMonth ===
      2) {
      if (setYear %
        4 === 0 && setYear %
        100 !== 0) {
        // console.log('非闰年')
        this.setDays(29);
      } else {
        // console.log('闰年')
        this.setDays(28);
      }
    } else {
      //大月
      if (this.contains(bigMonth, setMonth)) {
        this.setDays(31)
      } else {
        this.setDays(30)
      }
    }
    this.setData({
      year: setYear,
      month: setMonth,
      day: setDay
    })

    // 保存选择时间 
    // this.setData({
    //   chose_time: setYear + '-' + setMonth + '-' + setDay
    // })

    if (this.data.leftSelect != '') {
      this.setData({
        left_time: setYear + '-' + setMonth + '-' + setDay
      })

      // 超过当前日期默认为为当前日期
      var start_date = new Date(this.data.today.replace(/-/g, "/")); //今天
      var end_date = new Date(this.data.left_time.replace(/-/g, "/")); //选择时间
      var days = end_date.getTime() - start_date.getTime();
      var day = parseInt(days / (1000 * 60 * 60 * 24));
      // console.log("超过了几天", day)
      if (day > 0) {
        this.setData({
          left_time: this.data.today
        })
      } else {
        this.setData({
          left_time: setYear + '-' + setMonth + '-' + setDay
        })
      }

    } else if (this.data.rightSeclect != '') {

      this.setData({
        right_time: setYear + '-' + setMonth + '-' + setDay
      })

      // 超过当前日期默认为为当前日期
      var start_date = new Date(this.data.today.replace(/-/g, "/")); //今天
      var end_date = new Date(this.data.right_time.replace(/-/g, "/")); //选择时间
      var days = end_date.getTime() - start_date.getTime();
      var day = parseInt(days / (1000 * 60 * 60 * 24));
      // console.log("超过了几天",day)
      if (day > 1) {
        this.setData({
          right_time: this.data.today
        })
      } else {
        this.setData({
          right_time: setYear + '-' + setMonth + '-' + setDay
        })
      }

    }
    // console.log(this.data.chose_time, this.data.left_time, this.data.right_time)
  },


  // 开始时间选择事件
  left_time: function(e) {
    var that = this;
    that.setData({
      leftSelect: '_ischose',
      rightSeclect: ''
    })
  },

  // 结束时间选择事件
  right_time: function(e) {
    var that = this;
    that.setData({
      leftSelect: '',
      rightSeclect: '_ischose',
      right_time: that.data.left_time
    })
  },

  // 提交选择时间段 获取新数据
  to_confirm: function(e) {
    var that = this;
    var start_date = new Date(this.data.left_time.replace(/-/g, "/"));
    var end_date = new Date(this.data.right_time.replace(/-/g, "/"));
    var days = end_date.getTime() - start_date.getTime();
    var day = parseInt(days / (1000 * 60 * 60 * 24));
    console.log(day)
    if (day >= 0) {
      that.addInfo()
      that.hideModal()
    } else {
      wx.showToast({
        title: '开始时间大于结束时间',
        icon: 'none',
        duration: 2000,
      })
    }
  }

})