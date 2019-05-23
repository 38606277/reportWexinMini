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
    list: [],
    out: [],
    totalSize:0,
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
  },//监听input值的改变
  bindChange(res) {
    this.setData({
      value: res.detail.value
    })
  },
  cleanInput() {
    //button会自动清空，所以不能再次清空而是应该给他设置目前的input值
    this.setData({
      value: this.data.value
    });
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
  getQueryResult: function() {
    var message = this.data.value;
    if (message != null && message!=""){
      let key = 'value';
      this.setData({ [key]: "" });
      let searchList = wx.getStorageSync('searchList');
      if (undefined == searchList || searchList == '' || searchList == null) {
        searchList = [message];
      } else if (searchList.length == 10) {
        var index = searchList.indexOf(message);
        if (index > -1) {
          searchList.remove(message);
        } else {
          searchList.pop();
        }
        searchList.unshift(message);
      } else {
        var index = searchList.indexOf(message);
        if (index > -1) {
          searchList.remove(message);
        }
        searchList.unshift(message);
      }
      wx.setStorageSync('searchList', searchList);
      var that = this;
      let qryParam = [{ in: { begindate: "", enddate: "", org_id: "", po_number: "", vendor_name: "电讯盈科" } }];
      network.request({
        url: getApp().globalPath + '/reportServer/query/execQuery/2/87',
        data: JSON.stringify(qryParam),
        header: {
          'content-type': 'application/json',
          'credentials': '{ UserCode: "system", Pwd: "KfTaJa3vfLE=" }'
        },
        method: 'POST',
        success: function (res) {
          if (res.data.resultCode == "1000") {
            that.setData({ list: res.data.data.list, out: res.data.data.out });
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  onClickTag: function(e) {
    this.setData({ value: e.currentTarget.dataset.key});
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