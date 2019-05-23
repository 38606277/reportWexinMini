var network = require("../../utils/network.js");
var wxchart = require('../../utils/wxcharts');
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    list:[],
    burl: getApp().globalPath,
    imgUrls: [
      { url: './../../static/image/banner/banner.png', code: "1", name: '1' },
      { url: './../../static/image/banner/banner2.png', code: "2", name: '2' },
      { url: './../../static/image/banner/banner3.png', code: "3", name: '3' },
      { url: './../../static/image/banner/banner4.png', code: "4", name: '4' },
      { url: './../../static/image/banner/banner5.png', code: "5", name: '5' },
      { url: './../../static/image/banner/banner6.png', code: "6", name: '6' }
      ],
    indicatorDots: true,
    autoplay: true
  },
  swipclick(e) {
    // wx.navigateTo({
    //   url: e.currentTarget.id
    // })
    // this.setData({
    //   indicatorDots: !this.data.indicatorDots
    // })
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
    that.barShow()
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  toai:function(){
    wx.switchTab({
      url: '../AI/AI'
    })
  },
  toChat: function () {
    //如果跳转的路径已经在app.json文件中的TabBar选项中注册，跳转方法需要用wx.switchTab方法来跳转
    wx.switchTab({
      url: '../chat/chat'
    })
  },
  barShow: function () {
    let bar = {
      canvasId: 'barGraph',
      type: 'column',
      categories: ['2012', '2013', '2014', '2015', '2016', '2017'],
      series: [{
        name: '树状报表',
        data: [15, 20, 45, 37, 4, 80]
      }],
      yAxis: {
        format: function (val) {
          return val + '万';
        }
      },
      width: 320,
      height: 200
    }
    new wxchart(bar)
  }
})