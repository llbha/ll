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
    showModal: false,
    showModel_true: false,
    showModel_false: false,
    showModel_unknow: false,
    showModel_upply: false,

    addlables: false,

    //toast默认不显示  
    isShowToast: false,

    status: '',
    userId: '',
    list: [],
    userID: wx.getStorageSync('username'),

    orderId: '',
    reason_list: [],
    remarks: '',
    reason: [],

    obj: {
      'type': "manual",
      'value': '',
      'time':'',
    },

    labels: [],

    add_list:[],

    checks: [{
        name: "鞋标铺平高清",
        value: '0',
        checked: false
      },
      {
        name: "中底走线闪光灯聚焦拍全",
        value: '1',
        checked: false
      },
      {
        name: "另一个中底",
        value: '2',
        checked: false
      },
      {
        name: "另一个鞋垫背面",
        value: '3',
        checked: false
      },
      {
        name: "钢印",
        value: '4',
        checked: false
      },
      {
        name: "鞋盒侧标拉近高清",
        value: '5',
        checked: false
      },
      {
        name: "鞋盒背面合格证",
        value: '6',
        checked: false
      },
      {
        name: "鞋撑背面刻字",
        value: '7',
        checked: false
      },
      {
        name: "鞋底boost英文字母上面的白色三角部位再拍，拍清晰，找个光线好的地方或开闪光灯拍",
        value: '8',
        checked: false
      },
      {
        name: "鞋垫的反面有一个三叶草（阿迪）的logo，中间侧面有排英文+数字，这两个部位再拍，开闪光灯拍",
        value: '9',
        checked: false
      },
      {
        name: "鞋盒尺码标再拍，照近照大拍清晰，开闪光灯拍",
        value: '10',
        checked: false
      },
      {
        name: "鞋内尺码标再拍，把手机拿到鞋外把鞋掰开拍，开闪光灯拍",
        value: '11',
        checked: false
      },
      {
        name: "鞋垫抽出，鞋内底后脚跟部位再拍，开闪光灯拍",
        value: '12',
        checked: false
      },
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    let it = options.item
    let item = JSON.parse(it)
    console.log('item', item)
    that.setData({
      item
    })
    let orderId = that.data.item.orderId
    console.log('orderId', orderId)
    that.setData({
      orderId
    })

    that.getData()

  },


  getData: function() {
    var that = this
    wx.request({
      // url: 'https://api.aiera.tech/aiera/adm/ordersDetail/list',
      url: common.formalUlr + config.api.orderdetail,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      method: 'POST',
      data: {
        sortOrder: "desc",
        pageSize: 100,
        pageNumber: 1,
        orderId: this.data.orderId,
      },
      success: function(res) {
        console.log('res', res.data)
        if ("0" == res.data.code) {
          let list = res.data.rows;
          let order_info = res.data.order_info
          order_info.create_time = util.formatDate(order_info.create_time)
          order_info.update_time = util.formatDate(order_info.update_time)
          let reason_list = res.data.order_info.reason
          if(that.data.item.orderStatus == "8"){

            let rea_list = []
            let n_list = []
            for (var i in reason_list) {
              let a = i
              let b = Number(i) + 1
              if (b < reason_list.length) {
                let c = reason_list[i].time
                let d = reason_list[b].time
                if (c != d) {
                  n_list.push(b)
                }
              }
            }
            n_list.push(reason_list.length)
            for (var i in n_list) {
              let e = i
              let f = n_list[e]
              if (e == 0) {
                let add_rea = []
                for (var j = 0; j < f; j++) {
                  add_rea.push(reason_list[j])
                }
                rea_list.push(add_rea)
              } else {
                let g = n_list[Number(e) - 1]
                let add_rea = []
                for (var j = g; j < f; j++) {
                  add_rea.push(reason_list[j])
                }
                rea_list.push(add_rea)
              }
            }



            let r_list = []
            let num_list = []
            for (var i in list) {
              let num = i
              let nums = Number(i) + 1
              if(nums <list.length){
                let f = list[i].createTime
                let s = list[nums].createTime
                if (f != s) {
                  num_list.push(nums)
                }
              }
            }
            num_list.push(list.length)
            console.log(',,,', num_list)
            for (var i in num_list){
              let n = i
              let ns = num_list[n]
              if(n == 0){
                let add_pic = []
                for (var j = 0; j < ns; j++) {
                  add_pic.push(list[j])
                }
                r_list.push(add_pic)
              }else{
                let k = num_list[Number(n)-1]
                let add_pic = []
                for (var j = k; j < ns; j++) {
                  add_pic.push(list[j])
                }
                r_list.push(add_pic)
              }
            }
            console.log("r_pic", r_list);
            console.log("rea_list", rea_list);
            that.setData({
              r_list: r_list,
              rea_list: rea_list
            })
          }
        
          that.setData({
            list,
            order_info,
            reason_list
          })
          console.log('res_list', list)
        } else if ('401' == res.data.code) {
          console.log('token失效')
          app.gettoken()
          setTimeout(function () {
            that.getData()
          }, 1000);
        }else {
          console.log('list', list)
        }

      }

    })
  },



  onShow: function() {
    let that = this;
    //检查用户是否登录
    if (check.check()) {
      that.getUserinfo();
    }
  },

  // 获取用户信息
  getUserinfo: function() {
    var that = this
    wx.request({
      // url: 'https://api.aiera.tech/aiera/adm/user/info',
      url: common.formalUlr + config.api.userinfo,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      method: 'POST',
      success: function(res) {
        console.log('userId', res.data)
        if ("0" == res.data.code) {
          that.setData({
            userId: res.data.user.userId
          })
        } else if ('401' == res.data.code) {
          console.log('token失效')
          app.gettoken()
      setTimeout(function () {
            that.getUserinfo()
          }, 1000);
        }
      }

    })
  },


  /**
   * 点击图片放大查看细节
   */
  check_pic: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var url = e.currentTarget.dataset.url;
    var previewImgArr = [];
    //通过循环在数据链里面找到和这个id相同的这一组数据，然后再取出这一组数据当中的图片
    var data = that.data.list;
    console.log('ooo', data)
    for (var i in data) {
      if (id == data[i].orderId) {
        previewImgArr.push(data[i].picUrl);
      }
    }
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: previewImgArr // 需要预览的图片http链接列表
    })
  },


  /**
   * 鉴定结果弹窗  
   */
  showDialogBtn: function() {
    var that = this
    let status = this.data.status
    if (status == true) {
      this.setData({
        showModal_true: true,
      })
    }
    if (status == 'false') {
      this.setData({
        showModal_false: true,
      })
    }
    if (status == 'unknow') {
      this.setData({
        showModal_unknow: true,
      })
    }
    if (status == 'supply') {
      this.setData({
        showModalStatus: true,
        showModal: true,
      })
      console.log('...........')
    }
    this.setData({
      showModal: true,
    })
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
  hideModals: function() {
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

  // 获取标签值
  clicks: function(e) {

    if (this.endTime - this.startTime < 350) {
      console.log("点击")
      let index = e.currentTarget.dataset.index;
      let arrs = this.data.checks;
      if (arrs[index].checked == false) {
        arrs[index].checked = true;
      } else {
        arrs[index].checked = false;
      }
      let reason_list = []
      let labels = []
      let object = this.data.object
      console.log(arrs)
      for (let i = 0; i < arrs.length; ++i) {
        if (arrs[i].checked == true) {
          console.log(i, arrs[i].name)
          labels.push(arrs[i].name)
          this.setData({
            labels: labels
          })
        }
      }
      for (var i in labels) {
        reason_list.push({
          'type': 'auto',
          'value': labels[i]
        })
      }
      console.log(reason_list)
      this.setData({
        reason_list: reason_list,
        checks: arrs
      })
    }
  },

  // 获取问题补充说明
  getRemarks: function(e) {
    let remarks = e.detail.value
    this.setData({
      remarks: remarks
    })
    console.log(remarks)
  },


  close: function() {
    this.hideModals();
    this.setData({
      showModalStatus_4: false
    })
  },


  /**
   * 弹出框蒙层截断touchmove事件
   */

  preventTouchMove_true: function(e) {
    var that = this
    var data = e.currentTarget.dataset
    console.log('....', data.status)
    that.showModal()
    that.showDialogBtn()
    this.triggerEvent('preventTouchMove_true', data.status);
    this.setData({
      status: data.status
    })
  },

  preventTouchMove_false: function(e) {
    var that = this
    var data = e.currentTarget.dataset
    console.log('....', data.status)
    that.showModal()
    that.showDialogBtn()
    this.setData({
      status: data.status
    })
  },

  preventTouchMove_unknow: function(e) {
    var that = this
    var data = e.currentTarget.dataset
    console.log('....', data.status)
    that.showModal()
    that.showDialogBtn()
    this.setData({
      status: data.status
    })
  },

  preventTouchMove_supply: function(e) {
    var that = this
    var data = e.currentTarget.dataset
    console.log('....', data.status)
    that.showModal()
    this.setData({
      status: data.status,
      showModalStatus_4: true
    })
  },

  to_confirm: function(e) {
    var that = this
    var data = e.currentTarget.dataset
    console.log('....', data.status)
    that.showDialogBtn()
    this.setData({
      status: data.status,
      showModalStatus_4: false,
    })
  },


  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false,
      showModalStatus: false
    });
  },


  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function() {
    this.hideModal();
  },


  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function(e) {
    var that = this
    var data = e.currentTarget.dataset
    let result = data.id
    let orderStatus = ''
    let reason = that.data.reason
    let obj = that.data.obj
    let object = that.data.object
    let reason_list = that.data.reason_list
    console.log('@@@', result, obj)
    this.hideModal();
    if (result == 'true') {
      orderStatus = 2
    }
    if (result == 'false') {
      orderStatus = 1
    }
    if (result == 'unknow') {
      orderStatus = 3
    }
    if (result == 'supply') {
      orderStatus = 5
    }
    if (that.data.remarks || that.data.reason_list) {
      this.setData({
        ['obj.value']: that.data.remarks
      })
      reason_list.unshift(that.data.obj)
      // 添加时间戳
      var timestamp = Date.parse(new Date()) / 1000
      console.log('aaa', timestamp)
      for (var i in reason_list) {
        reason_list[i]['time'] = timestamp
      }
    }
    if(reason_list=='null'){
      this.setData({
        reason_list:[]
      })
    }
    console.log("reason_list", that.data.reason_list)

    wx.request({
      // url: 'http://192.168.117.128:8004/aiera/adm/orders/update',
      url: common.formalUlr + config.api.updateorder,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      method: 'POST',
      data: {
        orderStatus: orderStatus,
        update_user_id: that.data.userId,
        orderId: that.data.orderId,
        reason: that.data.reason_list
      },
      success: function(res) {
        console.log('res', res.data)
        if ("0" == res.data.code) {
          console.log('success')
          // data = JSON.stringify(that.data.item)
          // wx.navigateTo({
          //   url: '/pages/identify/identify?item=' + data
          // })
          wx.reLaunch({
            url: '/pages/index/index',
          })
        } else if ('401' == res.data.code) {
          console.log('token值失效')
          app.gettoken()
         setTimeout(function () {
            that.onConfirm()
          }, 1000);

        }else {
          console.log('fail')
        }
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

  load: function(e) {
    let val = e.currentTarget.dataset.val;

    // wx.showToast({
    //   title: val,
    //   duration: 3000,//提示的延迟时间，单位毫秒，默认：1500 
    //   icon: 'none'
    // })

    //设置toast时间，toast内容  
    this.setData({
      isShowToast: true,
      toastText: val
    });

    // this.showToast(val);  

  },


  //  定时Toast框效果
  showToast(val) {
    var that = this;
    that.setData({
      isShowToast: true,
      toastText: val,
    });

    setTimeout(function() { //toast消失
      that.setData({
        isShowToast: false
      });
    }, 3500);
  },

  bindTouchStart: function(e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function(e) {
    this.endTime = e.timeStamp;
    this.setData({
      isShowToast: false,
      toastText: ''
    })
  }


})