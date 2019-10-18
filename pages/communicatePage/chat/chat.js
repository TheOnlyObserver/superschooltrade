var app = getApp()
var myId = 0
var chatWithId = 0
var chatWithImg = 0
var chatContentArr = new Array
// var chatTimeArr = new Array
var chatDateArr = new Array
var textareaContent = ''
var dateNow = Date.parse(new Date) / 1000
var newMsg = new Array
var utils = require("../../../utils/util.js");
var chathistory = 1;
var ifOnShow = 0

Page({
  data: {
    sendmsging: 0,
    textareacontent: '',
    myid: app.globalData.id
  },
  onLoad: function(options) {
    var that = this
    myId = app.globalData.id
    chatWithId = options.chatwithid
    console.log('id', chatWithId)
    chatWithImg = options.chatwithimg
    that.setData({
      chatwithimgurl: chatWithImg,
      myimgurl: wx.getStorageSync('userData').data.data.data.img,
      chatwithid: chatWithId
    })
    wx.request({
      url: 'https://theonlyobserver.cn/message/getsession.php',
      data: {
        i: app.globalData.id,
        p: app.globalData.session,
        s: chatWithId,
        t: ''
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log('res', res)
        if (res.data.code == 6) {
          wx.showToast({
            title: '初次见面，请多关照',
            icon: 'none',

            duration: 1500,
            mask: false
          })
        } else if (res.data.code == 1) {
          chatContentArr = res.data.data.data
          for (var i = 0; i < res.data.data.totalTime.length; i++) {
            chatDateArr[i] = res.data.data.totalTime[res.data.data.totalTime.length - 1 - i]
          }
          console.log('排序后的历史消息时间数组', chatDateArr)
          for (var i = 0; i < chatContentArr.length; i++) { //时间戳转化为时间
            chatContentArr[i].time = utils.formatTimeTwo(chatContentArr[i].time, "M-D h:m:s")
          }
          that.setData({
            chatwithid: chatWithId,
            chatlistarr: chatContentArr,
            myid: app.globalData.id
          })
          wx.createSelectorQuery().select('#scrollview').boundingClientRect(function(rect) {
            // 使页面滚动到底部
            wx.pageScrollTo({
              scrollTop: rect.bottom + 999999
            })
          }).exec()
          app.socket.socketCallback({
            m: function(res) {
              if (ifOnShow == 1) {
                console.log('聊天界面消息回调', res)
                for (var i = 0; i < res.data.length; i++) {
                  res.data[i].time = utils.formatTimeTwo(res.data[i].time, "M-D h:m:s")
                }
                chatContentArr = chatContentArr.concat(res.data)
                console.log('newMsg', newMsg)
                that.setData({
                  chatlistarr: chatContentArr
                })
                wx.createSelectorQuery().select('#scrollview').boundingClientRect(function(rect) {
                  // 使页面滚动到底部
                  wx.pageScrollTo({
                    scrollTop: rect.bottom + 999999
                  })
                }).exec()
              }

            }

          })

        }

      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onShow: function(options) {
    var that = this
    ifOnShow = 1
  },
  textareaContentChange: function(e) {
    textareaContent = e.detail.value
  },
  sendMsg: function() {
    var that = this
    if (textareaContent == '') {
      wx.showToast({
        title: '暂不支持意识传输',
        icon: 'none',
        duration: 1500,
        mask: false
      })
    } else {

      that.setData({ //点击发送后，禁止重复发送请求
        sendmsging: 1
      })
      wx.request({
        url: "https://theonlyobserver.cn/message/send.php",
        data: {
          i: app.globalData.id,
          p: app.globalData.session,
          s: chatWithId,
          d: JSON.stringify(textareaContent)
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          console.log('res', res)
          if (res.data.code == 1) {
            //信息发送成功
            newMsg = [{
              data: textareaContent,
              time: utils.formatTimeTwo(dateNow, "M-D h:m:s"),
              user: app.globalData.id
            }]
            textareaContent = '' //清空输入框
            chatContentArr = chatContentArr.concat(newMsg)
            console.log('newMsg', newMsg)
            that.setData({ //发送成功后，恢复发送按钮点击许可
                textareacontent: textareaContent,
                chatlistarr: chatContentArr,
                sendmsging: 0
              }),
              wx.createSelectorQuery().select('#scrollview').boundingClientRect(function(rect) {
                // 使页面滚动到底部
                wx.pageScrollTo({
                  scrollTop: rect.bottom + 999999
                })
              }).exec()


          }
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    }

  },
  onPullDownRefresh: function() {
      var that = this
      if (chathistory >= chatDateArr.length) {
        wx.showToast({
          title: '暂无更早消息记录',
          icon: 'none',
          duration: 1500,
          mask: false
        })
      } else {
        wx.request({
          url: 'https://theonlyobserver.cn/message/getsession.php',
          data: {
            i: app.globalData.id,
            p: app.globalData.session,
            s: chatWithId,
            t: chatDateArr[chathistory]
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: function(res) {
            console.log('res', res)
            if (res.data.code == 1) {
              chathistory++;
              chatContentArr = res.data.data.data.concat(chatContentArr)
              console.log('0', chatContentArr)
              for (var i = 0; i < res.data.data.data.length; i++) {
                chatContentArr[i].time = utils.formatTimeTwo(chatContentArr[i].time, "M-D h:m:s")
              }
              console.log('1', chatContentArr)
              that.setData({
                chatwithid: chatWithId,
                chatlistarr: chatContentArr,
                myid: app.globalData.id
              })
            }
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      }

      wx.stopPullDownRefresh()
    }

    ,
  onUnload: function() {
    chatDateArr = []
    chathistory = 1
    ifOnShow = 0
  }
})