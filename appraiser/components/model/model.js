let app = getApp();

Component({
  properties: {
    showModalAni: {
      type: Boolean,
      value: false
    }
  },
  data: {}, // 私有数据，可用于模板渲染
  methods: {
    getUserInfo(e) {
      if (e.detail.userInfo) {
        app.globalData.userInfo = e.detail.userInfo
        this.triggerEvent('myevent')
      }
    }
  }
})
