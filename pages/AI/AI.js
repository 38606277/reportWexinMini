var network = require("../../utils/network.js");
Array.prototype.indexOf = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) return i;
  }
  return -1;
};

Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    localStorgeSearchList: [],
    value: '',
    data: [],
    out: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    let searchList = wx.getStorageSync('searchList');
    if (undefined == searchList || searchList == '' || searchList == null) {
      searchList = [];
    }
    that.setData({
      localStorgeSearchList: searchList
    });
    //wx.removeStorageSync('userInfo');
  },
  clearLocalStorge:function() {
    wx.removeStorageSync('searchList');
    this.setData({
      localStorgeSearchList: []
    });
  },
  searchfouce:function() {
    const searchList = wx.getStorageSync('searchList');
    if (undefined != searchList && searchList != '' && searchList != null && searchList.length > 0) {
      this.setData({
        localStorgeSearchList: searchList
      });
    } else {
      this.setData({
        localStorgeSearchList: []
      });
    }
  },
  getQueryResult: function(value) {
    let searchList = wx.getStorageSync('searchList');
    if (undefined == searchList || searchList == '' || searchList == null) {
      searchList = [value];
    } else if (searchList.length == 10) {
      var index = searchList.indexOf(value);
      if (index > -1) {
        searchList.remove(value);
      } else {
        searchList.pop();
      }
      searchList.unshift(value);
    } else {
      var index = searchList.indexOf(value);
      if (index > -1) {
        searchList.remove(value);
      }
      searchList.unshift(value);
    }
    wx.setStorageSync('searchList', searchList);
    let param = {};
    var that = this;
    network.request({
      url: getApp().globalPath + '/reportServer/nlp/getResult/' + value,
      data: '',
      header: {
        'content-type': 'application/json',
        'credentials': '{ UserCode: "system", Pwd: "KfTaJa3vfLE=" }'
      },
      method: 'POST',
      success: function (res) {
        that.setData({ data: res.data.data.list, out: res.data.data.out });
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    
  },
  onClickTag: function(value) {
    this.setData({ value: value.item });
  },
  onClearSearch: function() {
    this.setData({ value: '' });
  },
  onChange: function (value) {
    this.setData({ value });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  }
})