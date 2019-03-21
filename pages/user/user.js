var network = require("../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    UserCode: '',
    Pwd: '',
    isLogin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    if (undefined != userInfo && null != userInfo && '' != userInfo){
      this.setData({
        UserCode: userInfo.userCode,
        Pwd: userInfo.pwd,
        isLogin:true
      })
    }
  },
  logout:function(e){
    this.setData({ isLogin: false, UserCode: '',Pwd:'' });
    wx.removeStorageSync('userInfo');
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },
  bindKeyInput(e) {
    var fieldName = e.currentTarget.id;
    var value = e.detail.value;
    this.setData({
      [fieldName]: value
    });
  },
  checkLoginInfo(loginInfo) {
    let userCode = loginInfo.UserCode,
      Pwd = loginInfo.Pwd;
    // 判断用户名为空
    if (typeof userCode !== 'string' || userCode.length === 0) {
      return {
        status: false,
        msg: '用户名不能为空！'
      }
    }
    // 判断密码为空
    if (typeof Pwd !== 'string' || Pwd.length === 0) {
      return {
        status: false,
        msg: '密码不能为空！'
      }
    }
    return {
      status: true,
      msg: '验证通过'
    }
  },
  formSubmit: function (e) {
    var that = this;
    var loginInfo = {
      UserCode: that.data.UserCode,
      Pwd: that.data.Pwd,// "KfTaJa3vfLE=",
      import: "",
      isAdmin: ""
    },
    checkResult = that.checkLoginInfo(loginInfo);
    checkResult.states = true;
    // 验证通过
    if (checkResult.status) {
      network.request({
        url: getApp().globalPath +'/reportServer/user/encodePwd',
        data: loginInfo.Pwd,
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {
          loginInfo.Pwd = res.data.encodePwd;
          network.request({
            url: getApp().globalPath +'/reportServer/user/Reactlogin',
            data: JSON.stringify(loginInfo),
            header: {
              'content-type': 'application/json',
            },
            method: 'POST',
            success: function (response) {
              if (undefined != response.data.data && null != response.data.data) {
                let datas = response.data.data;
                wx.setStorageSync('userInfo', datas);
                that.setData({ isLogin:true})
              } else {
                alert("登录失败，请检查用户名与密码");
              }
            },
            fail: function (res) {
              alert("登录失败，请检查用户名与密码");
            }
          });
        }, 
        fail: function (res) {
           alert("登录失败，请检查用户名与密码"); 
        }
      });
    }
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