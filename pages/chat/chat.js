var network = require("../../utils/network.js");
var utils  = require("../../utils/util.js");
var canUseReachBottom = true;//触底函数控制变量
let recorderManager = wx.getRecorderManager();
var GetList = function (that) {
  //canUseReachBottom = false;
  that.setData({
    hidden: false
  });
  var mInfo = {
    'from_userId': that.data.userId, 'to_userId': that.data.to_userId,
    'pageNumd': that.data.page, 'perPaged': that.data.pageSize
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
                if (utils.isJSON(val)) {
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
       // canUseReachBottom = true;
      } else {
        newdata = newdata.concat(that.data.newslist);
      }
      that.setData({ newslist: newdata, hidden: true });
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
    start_scroll:0,
    hidden: true, 
    scrollHeight: 0,
    message: "",
    previewImgList: [],
    to_userId:0,
    userId:null,
    avatarUrl:'',
    page:1,
    pageSize:6,
    chatName:'机器人',
    burl: getApp().globalPath,
    modalHidden: true,
    dictionaryList: [],
    toView: '',
    hud_top: (wx.getSystemInfoSync().windowHeight - 150) / 2,
    hud_left: (wx.getSystemInfoSync().windowWidth - 150) / 2,
    startY:0,
    startpoint:0,
    recordStatus:false,
    startTime:0,
    recordingTimeqwe: 0,//录音计时
    setInter: "",//录音名称
    isSaying:false
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function () {
   
  },
  onShow:function(){
    var userInfo = wx.getStorageSync('userInfo');
    if (undefined != userInfo && null != userInfo && '' != userInfo) {
      this.setData({
        userId: userInfo.id,
        UserCode: userInfo.userCode,
        Pwd: userInfo.pwd,
        isLogin: true,
        avatarUrl: userInfo.icon == undefined ? '' : userInfo.icon
      })
    }
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - 30
        });
      }
    });
    var mInfo = {
      'from_userId': this.data.userId, 'to_userId': this.data.to_userId,
      'pageNumd': this.data.page, 'perPaged': this.data.pageSize
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
                  if (utils.isJSON(val)) {
                    val = JSON.parse(val);
                    list[i][key] = val;
                  }
                }
              }
            }
            newdata.unshift(list[i])
          }
          newdata = newdata.concat(that.data.newslist)
          ++that.data.page;
        } else {
          newdata = newdata.concat(that.data.newslist)
        }
        that.setData({ newslist: newdata })
        that.bottom()
      }
    }
    )
  },
  /**
   * 显示弹窗
   */
  buttonTap: function (e) {
    var that=this
    that.setData({
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
  //   该方法绑定了页面滑动到顶部的事件
  bindUpperLoad: function () {
    var that = this;
    GetList(that);
  },
  // 页面卸载
  onUnload() {
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
            flag.bottom();
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
                  var ba2 = [{
                    'from_userId': flag.data.to_userId,
                    'post_message': resBack.data.post_message,
                    'message_type': resBack.data.message_type,
                    'to_userId': flag.data.userId,
                    'message_state': '0',
                    'message_time': utils.formatTime(new Date())}];
                  var ba3 = flagtw.data.newslist.concat(ba2);
                  flagtw.setData({
                    newslist: ba3
                  });
                  flagtw.bottom();
                }else{
                  var ba2 = [{
                    'from_userId': flag.data.to_userId,
                    'post_message':'暂无消息',
                    'message_type': '0',
                    'to_userId': flag.data.userId,
                    'message_state': '0',
                    'message_time': utils.formatTime(new Date())
                  }];
                  var ba3s = flagtw.data.newslist.concat(ba2);
                  flagtw.setData({
                    newslist: ba3s
                  });
                  flagtw.bottom();
                }
              }
            })
          }
        }})
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
    });
  },
  //聊天消息始终显示最底端
  bottom: function () {
    this.setData({
      toView: 'row_' + (this.data.newslist.length - 1)
    });
  },
  longTap:function () {
    console.log("长按")
    // wx.showToast({
    //   title: '我是长按'
    // })
    this.openRecording()
  }, 
  recordStart: function (e) {
    // 触摸开始
    var startY = e.touches[0].clientY;
    // 记录初始Y值
    this.setData({
      startY: startY,
      recordStatus: true,
      isSaying:true,
      startTime: e.timeStamp
    });
  },
  recordMove: function (e) {
    // 触摸移动
    var movedY = e.touches[0].clientY;
    var distance = this.data.startY - movedY;
    // 距离超过50，取消发送
    if (distance > 50){
      this.setData({
        recordStatus: false,
        isSaying:false
      });
      recorderManager.stop();
    }
  },
  recordEnd: function (e) {
    var that = this;
    var recordStatus = that.data.recordStatus;
    console.log(recordStatus);
    that.setData({ isSaying:false});
    if (recordStatus) {
      var endTime = e.timeStamp;
      var speakTime = endTime - that.data.startTime;
      //如果录音时间太短，提示
      if (speakTime < 350) {
        wx.showToast({
          title: '说话时间太短',
          icon: 'none',
        })
        recorderManager.stop();
      } else { 
      // 不论如何，都结束录音
      this.shutRecording()
      }
    }else{
      recorderManager.stop();
    }
  }, 
  mytouchstart: function (e) {
    var that = this;
    wx.createSelectorQuery().select('#scroll-wrap').fields({
      scrollOffset: true,
      size: true
    }, function (rect) {
      that.data.start_scroll = rect.scrollTop;
     // self.data.height = rect.height;
    }).exec();
    //开始触摸，获取触摸坐标
    that.setData({ startpoint: e.touches[0].clientY });
  },
  //触摸点移动
  mytouchend: function (e) {
    //当前触摸点坐标
    var that = this;
    var curPoint = e.changedTouches[0].clientY;
    var startpoint = that.data.startpoint;
   // if (!canUseReachBottom) return;
    //比较pageY值
    if (curPoint>startpoint && curPoint - startpoint> 20 && that.data.start_scroll==0) {
        GetList(that);
    }
  }, //录音计时器
  recordingTimer: function () {
    var that = this;
    //将计时器赋值给setInter
    that.data.setInter = setInterval(
      function () {
        var time = that.data.recordingTimeqwe + 1;
        that.setData({
          recordingTimeqwe: time
        })
      }
      , 1000);
  },
  //开始录音
  openRecording: function () {
    var that = this;
    const options = {
      duration: 60000, //指定录音的时长，单位 ms，最大为10分钟（600000），默认为1分钟（60000）
      sampleRate: 16000, //采样率
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 96000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
      frameSize: 50, //指定帧大小，单位 KB
    }
    //开始录音计时   
    that.recordingTimer();
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('。。。开始录音。。。')
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },

  //结束录音
  shutRecording: function () {
    var that = this;
    recorderManager.stop();
    recorderManager.onStop((res) => {
      console.log('。。停止录音。。', res.tempFilePath)
      const { tempFilePath } = res;
      //结束录音计时  
      clearInterval(that.data.setInter);
      that.setData({ recordStatus:false});
      //上传录音
      wx.uploadFile({
        url: getApp().globalPath + '/reportServer/MyVoiceApplication/uploadmp3',//这是你自己后台的连接
        filePath: tempFilePath,
        name: "file",//后台要绑定的名称
        header: {
          "Content-Type": "multipart/form-data",
          'credentials': '{ UserCode: "system", Pwd: "KfTaJa3vfLE=" }'
        },
        success: function (ress) {
          //console.log(ress.data);
          var val = ress.data;
          if(val!=null && val!=""){
            if (utils.isJSON(val)) {
              val = JSON.parse(val);
            }
            let key ='message';
            that.setData({ [key]: val.data.content});
          }
          // wx.showToast({
          //   title: '保存完成',
          //   icon: 'success',
          //   duration: 2000
          // })
        },
        fail: function (ress) {
          console.log("。。录音保存失败。。");
        }
      })
    })
  },
  //录音播放
  recordingAndPlaying: function (eve) {
    wx.playBackgroundAudio({
      //播放地址
      dataUrl: '' + eve.currentTarget.dataset.gid + ''
    })
  }
})
