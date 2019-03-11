var network = require("../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qryId:null,
    classId:null,
    inData:null,
    outData:null,
    inParam: {},
    selectArray: [{
          "id": "10",
          "text": "会计类"
        }, {
          "id": "21",
          "text": "工程类"
        }]
      },
      date: new Date(),  
      dictData:null,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ classId: options.classId, qryId: options.qryId});
  },
  bindDateChange(e) {
    var fieldName = e.currentTarget.id;
    var value = e.detail.value;
    //this.data.inParam[fieldName] = value;

    const _k2 = `inParam.${fieldName}` // 拼接动态属性
    this.setData({
      [_k2]: value
    })
    // var { inParam } = this.data;
    // var newData = inParam.map(item => ({ ...item }));
    // newData[fieldName] = value;
    // this.setData({ inParam: newData });

    console.log(this.data.inParam);
  },
  bindchangeInput: function (e) {
    //var that=this;
   // console.log(e.currentTarget.id, e.detail.value);
    var fieldName = e.currentTarget.id;
    var value = e.detail.value;
    const _k2 = `inParam.${fieldName}` // 拼接动态属性
    this.setData({
      [_k2]: value
    })
    //this.data.inParam[fieldName] = value;
    console.log(this.data.inParam);
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    network.request({
      url: getApp().globalPath+'/reportServer/query/getQueryParam/' + that.data.qryId,
      data: '',
      header: {
        'content-type': 'application/json',
        'credentials': '{ UserCode: "system", Pwd: "KfTaJa3vfLE=" }'
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        console.log(res.data);
        let inColumns = res.data.data.in;
        let outColumns = res.data.data.out;
        for (var i = 0; i < inColumns;i++){
          if ("Select" == inColumns[i].render){
            this.getDiclist(inColumns[i].in_id, inColumns[i].dict_id, "Select");
          }
        }
        that.setData({
          inData: res.data.data.in, outData: res.data.data.out
        });
        that.data.inData.map((item) => that.data.inParam[item.in_id] = '');
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //根据条件列的dict_id进行查询数据字典
  getDiclist(in_id, dictId, type) {
    let page = {};
    page.pageNumd = 1;
    page.perPaged = 15;
    page.searchDictionary = '';
    var that = this;
    network.request({
      url: getApp().globalPath +'/reportServer/dict/getDictValueByID/' + dictId,
      data: JSON.stringify(page),
      header: {
        'content-type': 'application/json',
        'credentials': '{ UserCode: "system", Pwd: "KfTaJa3vfLE=" }'
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        that.setData({
          dictData: res.data
        });
      }
    });
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
  formSubmit: function (e) {
    var that = this;
    // let paramStr = "";
    // for (let key of Object.keys(this.data.inParam)) {
    //   paramStr = paramStr + "," + key + ':' + this.state.inParam[key];
    // }
    // paramStr = paramStr.substring(1, paramStr.length);
    let str=JSON.stringify(that.data.inParam);
    let strout = JSON.stringify(that.data.outData);
    console.log(that.data.inParam);
    wx.navigateTo({
      url: '/pages/query/queryResult?qryId=' + that.data.qryId + '&classId=' + that.data.classId + '&inParam=' + str + '&outPram=' + strout
    })
  },

})