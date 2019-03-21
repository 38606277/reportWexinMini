var network = require("../../utils/network.js");
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    list:[],
    burl: getApp().globalPath,
    imgUrls: [
      { url: './../../static/image/a.png', code:"1",name:'1'},
      { url: './../../static/image/java.png', code: "1", name: '1' },
      { url: './../../static/image/elm.jpg', code: "1", name: '1' },
      { url: './../../static/image/a.png', code: "1", name: '1' },
      { url: './../../static/image/a.png', code: "1", name: '1' },
      { url: './../../static/image/a.png', code: "1", name: '1' },
      { url: './../../static/image/a.png', code: "1", name: '1' }
      ],
    indicatorDots: true,
    autoplay: true
  },
  swipclick(e) {
    wx.navigateTo({
      url: e.currentTarget.id
    })
    // this.setData({
    //   indicatorDots: !this.data.indicatorDots
    // })
  },
 
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    network.request({
      url: getApp().globalPath + '/reportServer/query/getAllQueryClass',
      data: '',
      header: {
        'content-type': 'application/json',
        'credentials': '{ UserCode: "system", Pwd: "KfTaJa3vfLE=" }'
      },
      method: 'POST',
      success: function (res) {
        var lists = res.data.data;
        for(var i=0;i<lists.length;i++){
          for (var key in lists[i]) {
            if (key == "img_file") {
             var val= lists[i][key];
              if (null!=val){
                val = val.replace(/\\/g, "/")
                lists[i][key] = val;
              }
            }
          }
        }
        that.setData({
          list: lists
        });
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  tourl(e){
    wx.navigateTo({
      url: 'userList'
    })
  }
  
})
