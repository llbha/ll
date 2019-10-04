const util = require('../../utils/util.js');
const config = require('../../utils/config.js');
const app = getApp();

Page({
  data: {
    logs: []
  },
 
  //搜集推送码  --保存推送码
  saveFormId: function (e) {
    console.log("推送码", e.detail.formId)
  },

  click: function(){
    console.log('12333')
  }
})
