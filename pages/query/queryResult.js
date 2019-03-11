var  network = require("../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qryId:null,
    classId:null,
    inParam:null,
    outParam:null,
    list:null,
    startIndex: 1, perPage: 10, 
    totalSize: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var jsonObj= JSON.parse(options.outPram);
    for (var i = 0; i < jsonObj.length;i++){
      for (var key in jsonObj[i]) {
        if (key == "OUT_ID" || key =="out_id"){
          jsonObj[i][key] = jsonObj[i][key].toUpperCase();
         // delete (jsonObj[i][key]);
        }
      }
    }
    this.setData({ qryId: options.qryId, classId: options.classId, inParam: JSON.parse(options.inParam), outParam: jsonObj });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this;
    let page = {};
    page.startIndex = 1;
    page.perPage = 10;
    let aParam = [{ "in": this.data.inParam },page];
    network.request({
      url: getApp().globalPath +'/reportServer/query/execQuery/' + that.data.classId + '/' + that.data.qryId,
      header: {
        'content-type': 'application/json',
        'credentials': '{ UserCode: "system", Pwd: "KfTaJa3vfLE=" }'
      },
      method: "POST",
      data: JSON.stringify(aParam),
      success: function (res) {
        that.setData({ list: res.data.data.list, totalSize:res.data.data.totalSize});
      }
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
   
    var that = this;
    if (that.data.totalSize != that.data.list.length){
        that.setData({ startIndex: that.data.startIndex+1});
        let page = {};
        page.startIndex = that.data.startIndex;
        page.perPage = that.data.perPage;
        let aParam = [{ "in": that.data.inParam }, page];
        network.request({
          url: getApp().globalPath + '/reportServer/query/execQuery/' + that.data.classId + '/' + that.data.qryId,
          header: {
            'content-type': 'application/json',
            'credentials': '{ UserCode: "system", Pwd: "KfTaJa3vfLE=" }'
          },
          method: "POST",
          data: JSON.stringify(aParam),
          success: function (res) {
            var moment_list = that.data.list;
            for (var i = 0; i < res.data.data.list.length; i++) {
              moment_list.push(res.data.data.list[i]);
            }
            that.setData({ list: moment_list });
          }
        })
    }else{
      // wx.showLoading({
      //   title: '',
      // })

      // setTimeout(function () {
      //   wx.hideLoading()
      // }, 2000)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})