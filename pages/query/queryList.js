var network = require("../../utils/network.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    burl: getApp().globalPath,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    network.request({
      url: getApp().globalPath +'/reportServer/query/getAllQueryClass',
      data: '',
      header: {
        'content-type': 'application/json',
        'credentials': '{ UserCode: "system", Pwd: "KfTaJa3vfLE=" }'
      },
      method: 'POST',
      success: function (res) {
        var lists = res.data.data;
        for (var i = 0; i < lists.length; i++) {
          for (var key in lists[i]) {
            if (key == "img_file") {
              var val = lists[i][key];
              if (null != val) {
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
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  /**
   * 下拉刷新(请求服务获取数据并赋值)
   */
  pullDownRefreshData: function (context) {
    let params = {
      pageIndex: 1,
    };
    network.request("", params, function (res) {
      wx.stopPullDownRefresh();
      if (res.code == 0) {
        context.setData({
          tradeList: res.data,
        });
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  showData:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/query/queryClass?id=' + id
    })
  }
})