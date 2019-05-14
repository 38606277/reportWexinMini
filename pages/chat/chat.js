const app = getApp();
// var websocket = require("../../utils/websocket.js");
var network = require("../../utils/network.js");
var utils   = require("../../utils/util.js");
var GetList = function (that) {
  var mInfo = {
    'from_userId': that.data.userId, 'to_userId': that.data.to_userId,
    'pageNumd': that.data.page, 'perPaged': 6
  }
  network.request({
    url: getApp().globalPath + '/reportServer/chat/getChatByuserID',
    data: JSON.stringify(mInfo),
    header: {
      'content-type': 'application/json',
      'credentials': '{ UserCode: "system", Pwd: "KfTaJa3vfLE=" }'
    },
    method: 'POST',
    success: function (res) {
      var list = res.data.data;
      var newdata = [];
      if (list.length > 0) {
        for (var i = 0; i < list.length; i++) {
          for (var key in list[i]) {
            if (key == "message_time") {
              var val = list[i][key];
              if (null != val) {
                val = utils.date_time(val);
                list[i][key] = val;
              }
            }
          }
          newdata.unshift(list[i]);
        }
        newdata = newdata.concat(that.data.newslist);
        ++that.data.page;
      } else {
        newdata = newdata.concat(that.data.newslist);
      }
      that.setData({ newslist: newdata });
      that.bottom()
    }
  });
}
Page({
  /**
  * 页面的初始数据
  */
  data: {
    newslist: [],
    userInfo: {},
    scrollTop: 0,
    scrollHeight: 0,
    increase: false,//图片添加区域隐藏
    aniStyle: true,//动画效果
    message: "",
    previewImgList: [],
    to_userId:0,
    userId:null,
    avatarUrl:'',
    page:1,
    chatName:'机器人',
    burl: getApp().globalPath,
    modalHidden: true,
    dictionaryList: [],
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.onLoad()
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function () {
    var userInfo = wx.getStorageSync('userInfo');
    if (undefined != userInfo && null != userInfo && '' != userInfo) {
      this.setData({
        userId: userInfo.id,
        UserCode: userInfo.userCode,
        Pwd: userInfo.pwd,
        isLogin: true,
        avatarUrl: userInfo.icon == undefined ? '' : userInfo.icon.replace(/\\/g, "/")
      })
    }
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    var mInfo = {
      'from_userId': this.data.userId, 'to_userId': this.data.to_userId,
      'pageNumd': this.data.page, 'perPaged': 6
    }
   
    network.request({
      url: getApp().globalPath + '/reportServer/chat/getChatByuserID',
      data: JSON.stringify(mInfo),
      header: {
        'content-type': 'application/json',
        'credentials': '{ UserCode: "system", Pwd: "KfTaJa3vfLE=" }'
      },
      method: 'POST',
      success: function (res) {
        var list = res.data.data;
        var newdata = [];
        if (list.length > 0) {
          for (var i = 0; i < list.length; i++) {
            for (var key in list[i]) {
              if (key == "message_time") {
                var val = list[i][key];
                if (null != val) {
                  val = utils.date_time(val);
                  list[i][key] = val;
                }
              }
              if (key == "post_message") {
                var val = list[i][key];
                if (null != val) {
                  if (utils.isJSON(val)){
                    val = JSON.parse(val);
                    list[i][key] = val;
                  }
                }
              }
            }
            
            newdata.unshift(list[i]);
          }
          newdata = newdata.concat(that.data.newslist);
          ++that.data.page;
        } else {
          newdata = newdata.concat(that.data.newslist);
        }
        that.setData({ newslist: newdata });
        that.bottom()
      }}
    );
  },
  /**
   * 显示弹窗
   */
  buttonTap: function (e) {
    this.setData({
      modalHidden: false,
      dictionaryList: e.currentTarget.dataset['index']
    })
  },
   /**
   * 点击取消
   */
  modalConfirm: function () {
    this.setData({
      modalHidden: true, dictionaryList: []
    });
  },
  //   该方法绑定了页面滑动到底部的事件
  bindDownLoad: function () {
    var that = this;
    GetList(that);
  },
  //   该方法绑定了页面滚动时的事件
  scroll: function (event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },

  // 页面卸载

  onUnload() {
    // wx.closeSocket();
    // wx.showToast({
    //   title: '连接已断开~',
    //   icon: "none",
    //   duration: 2000
    // })
  },
  //事件处理函数
  send: function () {
    var flag = this;
    var flagtw = this;
    if (this.data.message.trim() == "") {
      wx.showToast({
        title: '消息不能为空哦~',
        icon: "none",
        duration: 2000
      })
    } else {
      setTimeout(function () {
        flag.setData({
          increase: false
        })
      }, 500)
     
      //先保存发送信息
      var message = this.data.message;
      this.data.message = '';
      let userInfo = {
        'from_userId': this.data.userId,
        'to_userId': this.data.to_userId,
        'post_message': message,
        'message_type': '0',
        'message_state': '0'
      }
      network.request({
        url: getApp().globalPath + '/reportServer/chat/createChat',
        data: JSON.stringify(userInfo),
        header: {
          'content-type': 'application/json',
          'credentials': '{ UserCode: "system", Pwd: "KfTaJa3vfLE=" }'
        },
        method: 'POST',
        success: function (resSend) {
          if (resSend.data.resultCode == "1000") {
            var timestamp = Date.parse(new Date());
            timestamp = timestamp / 1000;
            var a2 = [{ 
              'from_userId': flag.data.userId, 
              'post_message': message, 
              'to_userId': flag.data.to_userId,
              'message_state':'0',
              'message_type':'0',
              'message_time': utils.formatTime(new Date())
             }];
            var a4 = flag.data.newslist;
            var a3 = a4.concat(a2);
            flag.setData({
              newslist: a3
            });
            flag.bottom()
              network.request({
                url: getApp().globalPath + '/reportServer/nlp/getResult/' + message,
                data: null,
                header: {
                  'content-type': 'application/json',
                  'credentials': '{ UserCode: "system", Pwd: "KfTaJa3vfLE=" }'
                },
                method: 'POST',
                success: function (resBack) {
                  if (resBack.data.resultCode== "1000") {
                    var timestampes = Date.parse(new Date());
                    timestampes = timestampes / 1000;
                    var ba2 = [{
                      'from_userId': flag.data.to_userId,
                      'post_message': resBack.data.post_message,
                      'message_type': resBack.data.message_type,
                      'to_userId': flag.data.userId,
                      'message_state': '0',
                      'message_time': utils.formatTime(new Date())}];
                    var ba3 = flag.data.newslist.concat(ba2);
                    flag.setData({
                      newslist: ba3
                    });
                    flagtw.bottom()
                  }else{
                    var timestampes = Date.parse(new Date());
                    timestampes = timestampes / 1000;
                    var ba2 = [{
                      'from_userId': flag.data.to_userId,
                      'post_message':'暂无消息',
                      'message_type': '0',
                      'to_userId': flag.data.userId,
                      'message_state': '0',
                      'message_time': utils.formatTime(new Date())
                    }];
                    var ba3 = flag.data.newslist.concat(ba2);
                    flag.setData({
                      newslist: ba3
                    });
                    flagtw.bottom()
                  }
                 
                }
              })
          }
        }})
      
      // websocket.send('{ "content": "' + this.data.message + '", "date": "' + utils.formatTime(new Date()) + '","type":"text", "nickName": "' + this.data.userInfo.nickName + '", "avatarUrl": "' + this.data.userInfo.avatarUrl + '" }')

     // this.bottom()

    }

  },

  //监听input值的改变

  bindChange(res) {

    this.setData({

      message: res.detail.value

    })

  },

  cleanInput() {

    //button会自动清空，所以不能再次清空而是应该给他设置目前的input值

    this.setData({

      message: this.data.message

    })

  },

  increase() {

    this.setData({

      increase: true,

      aniStyle: true

    })

  },

  //点击空白隐藏message下选框

  outbtn() {

    this.setData({

      increase: false,

      aniStyle: true

    })

  },
  //发送图片
  chooseImage() {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: getApp().globalPath + '/reportServer/uploadFile/uploadFile', //服务器地址
          filePath: tempFilePaths[0],
          name: 'file',
          headers: {
            'Content-Type': 'form-data'
          },
          success: function (res) {
            if (res.data) {
             
              var ba2 = [{
                'from_userId': that.data.userId,
                'post_message': '暂无消息',
                'message_type': 'image',
                'to_userId': that.data.to_userId,
                'message_state': '0',
                'message_time': utils.formatTime(new Date())
              }];
              var ba3 = that.data.newslist.concat(ba2);
              that.setData({
                newslist: ba3,
                increase: false
              });
              // websocket.send('{"images":"' + res.data + '","date":"' + utils.formatTime(new Date()) + '","type":"image","nickName":"' + that.data.userInfo.nickName + '","avatarUrl":"' + that.data.userInfo.avatarUrl + '"}')
              that.bottom()
            }
          }
        })
      }
    })
  },
  //图片预览
  previewImg(e) {
    var that = this
    //必须给对应的wxml的image标签设置data-set=“图片路径”，否则接收不到
    var res = e.target.dataset.src
    var list = this.data.previewImgList //页面的图片集合数组
    //判断res在数组中是否存在，不存在则push到数组中, -1表示res不存在
    if (list.indexOf(res) == -1) {
      this.data.previewImgList.push(res)
    }
    wx.previewImage({
      current: res, // 当前显示图片的http链接

      urls: that.data.previewImgList // 需要预览的图片http链接列表

    })

  },

  //聊天消息始终显示最底端

  bottom: function () {

    var query = wx.createSelectorQuery()

    query.select('#flag').boundingClientRect()

    query.selectViewport().scrollOffset()

    query.exec(function (res) {

      wx.pageScrollTo({

        scrollTop: res[0].bottom // #the-id节点的下边界坐标

      })

      res[1].scrollTop // 显示区域的竖直滚动位置

    })

  }

})