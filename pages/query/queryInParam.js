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
    date: new Date().toString(),
    dictData: [],
    modalHidden: true,
    dictionaryList:[],
    totald:0,
    pageNumd:1,
    paramValue:null,
    paramName:null,
    paramModalValue:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ classId: options.classId, qryId: options.qryId});
  },
  bindKeyInput(e) {
    var fieldName = e.currentTarget.id;
    var value = e.detail.value;
    const _k2 = `inParam.${fieldName}` // 拼接动态属性
    this.setData({
      [_k2]: value
    });
  },
  bindDateChange(e) {
    var fieldName = e.currentTarget.id;
    var value = e.detail.value;
    const _k2 = `inParam.${fieldName}` // 拼接动态属性
    this.setData({
      [_k2]: value
    });
  },
  bindchangeInput: function (e) {
    var fieldName = e.currentTarget.id;
    var value = e.detail.value;
    const _k2 = `inParam.${fieldName}` // 拼接动态属性
    this.setData({
      [_k2]: value
    })
  },
  bindSelectChange(e) {
    var fieldName = e.currentTarget.id;
    var value = e.detail.id;
    const _k2 = `inParam.${fieldName}` // 拼接动态属性
    this.setData({
      [_k2]: value
    });
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
      success: function (res) {
        let inColumns = res.data.data.in;
        let outColumns = res.data.data.out;
        for (let  i = 0; i < inColumns.length;i++){
          if ("Select" == inColumns[i].render){
            that.getDiclist(inColumns[i].in_id, inColumns[i].dict_id, "Select");
          } else if ("InputButton" == inColumns[i].render){
            that.openModelClick(inColumns[i].in_id, inColumns[i].dict_id);
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
    page.perPaged = 10;
    page.searchDictionary = '';
    var that = this;
    network.request({
      url: getApp().globalPath +'/reportServer/dict/getDictValueByID/' + dictId,
      data: {},
      header: {
        'content-type': 'application/json',
        'credentials': '{ UserCode: "system", Pwd: "KfTaJa3vfLE=" }'
      },
      method: 'POST',
      success: function (res) {
        let objs = that.data.dictData;
        if (type == "TagSelect") {
          objs[dictId] = res.data.data;
        } else {
          objs[dictId] = res.data.data;
        }
        that.setData({
          dictData: objs
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
    let str=JSON.stringify(that.data.inParam);
    let strout = JSON.stringify(that.data.outData);
    wx.navigateTo({
      url: '/pages/query/queryResult?qryId=' + that.data.qryId + '&classId=' + that.data.classId + '&inParam=' + str + '&outPram=' + strout
    })
  },
   //打开模式窗口
  openModelClick(name, dict_id) {
    this.setData({
      dictionaryList: [], paramValue: dict_id, paramName: name,totald: 0 }, function () {
        this.loadModelData(dict_id);
    });
  },
  loadModelData(dict_id) {
    let page = {};
    page.pageNumd = this.data.pageNumd;
    page.perPaged = 10;
    page.searchDictionary = '';
    var that = this;
    network.request({
      url: getApp().globalPath + '/reportServer/dict/getDictValueByID/' + dict_id,
      data: JSON.stringify(page),
      header: {
        'content-type': 'application/json',
        'credentials': '{ UserCode: "system", Pwd: "KfTaJa3vfLE=" }'
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          dictionaryList: res.data.data,
          totald: res.data.totald
        });
      }
    });
  },
  //上一页
  uppage(){
   let curpag= this.data.pageNumd - 1;
    if (curpag!=0){
      this.setData({
        pageNumd: curpag
      }, () => {
        this.loadModelData(this.data.paramValue)
      });
    }
  }, 
  //下一页
  downpage() {
    this.setData({
      pageNumd: this.data.pageNumd +1
    }, () => {
      this.loadModelData(this.data.paramValue)
    });
  },
  radioChange(e) {
    var value = e.detail.value;
    this.setData({
      paramModalValue: value
    });
  },
  /**
   * 显示弹窗
   */
  buttonTap: function () {
    this.setData({
      modalHidden: false
    })
  },

  /**
   * 点击取消
   */
  modalCandel: function () {
    // do something
    this.setData({
      modalHidden: true, paramModalValue: null
    })
  },

  /**
   *  点击确认
   */
  modalConfirm: function () {
    var fieldName = this.data.paramName;
    var value = this.data.paramModalValue;
    const _key = `inParam.${fieldName}` // 拼接动态属性
    this.setData({
      [_key]: value, modalHidden: true, paramModalValue:null
    });
    console.log(this.data.inParam)

  }  
})