var network = require("../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classId:'',
    list:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({'classId':options.id});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    network.request({
      url: getApp().globalPath +'/reportServer/query/getQueryByClassID/' + that.data.classId,
      data: '',
      header: {
        'content-type': 'application/json',
        'credentials': '{ UserCode: "system", Pwd: "KfTaJa3vfLE=" }'
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          list: res.data
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  showData: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/query/queryInParam?classId=' + this.data.classId+'&qryId=' + id
    })
  }
})