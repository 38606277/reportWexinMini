// pages/chat/chat.js
function getData(dataArr) {
  // const dataArr = [];
  for (let i = 0; i < 20; i++) {
    dataArr.push(i);
  }
  return dataArr;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    meg: null,
    respon: [],
    megArray: [],
    isWrite: true,
    saying: false,
    refreshing: false,
    down: true,
    height: '',
    datas:[]
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
    //const hei = this.data.height - ReactDOM.findDOMNode(this.ptr).offsetTop;
    setTimeout(() => this.setData({
      //height: hei,
      datas: getData(this.data.datas),
    }), 0);
  },
  sendMessage: function() {
    var that = this;
    console.log(this.data);
    var message = this.data.meg;
    if (message === '') {
      alert('不能发送空白消息哦')
    } else {
      this.setData({
        megArray: [...this.data.megArray, message]
      })
   
      wx.request('http://www.tuling123.com/openapi/api?key=f0d11b6cae4647b2bd810a6a3df2136f&info=' + message, {
        method: 'POST',
        type: 'cors'
      }).then(function (response) {
        return response.json();
        //return "hello";//response.json()
      }).then(function (detail) {
        if (detail.code === 100000) {
          return (that.setData({ respon: [...that.data.respon, detail.text] }, () => {
            // var el = ReactDOM.findDOMNode(that.refs.msgList);
            // el.scrollTop=el.scrollHeight;
            let anchorElement = document.getElementById("scrolld");
            anchorElement.scrollIntoView();
          }))
        } else {
          return (that.setData({ respon: [...that.data.respon, "不知道你说什么,好像服务器发生错误"] }, () => {
            // var el = ReactDOM.findDOMNode(that.refs.msgList);
            // el.scrollTop=el.scrollHeight;
            let anchorElement = document.getElementById("scrolld");
            anchorElement.scrollIntoView();
          }))
        }
      })
      this.data.meg = ''
    }
  },
  handleData(e) {
    console.log(e.target.value);
    this.setData({
      meg: e.target.value
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

  }
})