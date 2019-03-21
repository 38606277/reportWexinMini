//初始化数据
function tabbarinit() {
  return [
    {
      "current": 0,
      "pagePath": "/pages/index/index",
      "iconPath": "../../static/image/icon/index.png",
      "selectedIconPath": "../../static/image/icon/index_on.png",
      "text": "主页"
    },
    {
      "current": 0,
      "pagePath": "/pages/query/queryList",
      "iconPath": "../../static/image/icon/jifen.png",
      "selectedIconPath": "../../static/image/icon/jifen_on.png",
      "text": "数据查询"

    },
    {
      "current": 0,
      "pagePath": "/pages/AI/AI",
      "iconPath": "../../static/image/icon/ais.png",
      "selectedIconPath": "../../static/image/icon/ais_on.png",
      "text": "AI"
    },
    {
      "current":0,
      "pagePath": "/pages/chat/chat",
      "iconPath": "../../static/image/icon/chart.png",
      "selectedIconPath": "../../static/image/icon/chart_on.png",
      "text": "聊天"
    },
    {
      "current": 0,
      "pagePath": "/pages/user/user",
      "iconPath": "../../static/image/icon/my.png",
      "selectedIconPath": "../../static/image/icon/my_on.png",
      "text": "我的"
    }
  ]

}
//tabbar 主入口
function tabbarmain(bindName = "tabdata", id, target) {
  var that = target;
  var bindData = {};
  var otabbar = tabbarinit();
  otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']//换当前的icon
  otabbar[id]['current'] = 1;
  bindData[bindName] = otabbar
  that.setData({ bindData });
}

module.exports = {
  tabbar: tabbarmain
}
