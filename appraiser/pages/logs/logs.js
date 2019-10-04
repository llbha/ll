const util = require('../../utils/util.js');
const config = require('../../utils/config.js');
const app = getApp();

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    setInterval(function () {
      this.saveFormId()
      console.log("轮播请求1秒触发一次");
    }, 2000) 
  },

  //搜集推送码  --保存推送码
  saveFormId: function (e) {
    console.log("推送码", e.detail.formId)
  },

})
