// pages/communicatePage/communicatePage.js
var app = getApp();
var communicateList = new Array
var communicateUserInfoArr = new Array
var communicateIdList = new Array
var communicateTimeArr = new Array
var newMessageIdArr = new Array
var utils = require("../../utils/util.js")
// var communicateList



Page({
  data: {
    communicatelistimgurl: "",
    chatwithnickname: "测试名字",
    chatwithcontent: "测试内容测试内容测试内容测试内容测试内容测试内容",
    roughtime: "13:39"
  },
  onShow() {
    this.setData({
      touristmodel: app.globalData.touristmodel
    })
    var that = this;
    //页面展示时
    //第一步，清除tabbar消息提示红点
    wx.removeTabBarBadge({
      index: 1,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    //第二步，获取聊天列表并实例化
    //临时，需修改
    if (!app.globalData.id || !app.globalData.session) {
      return
    }
    wx.request({
      url: 'https://theonlyobserver.cn/message/getmessagelist.php',
      data: {
        i: app.globalData.id,
        p: app.globalData.session
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log('res', res)
        for (var i = 0; i < res.data.data.user.length; i++) {
          communicateList[i] = res.data.data[res.data.data.user[res.data.data.user.length - 1 - i]]
          communicateIdList[i] = res.data.data.user[[res.data.data.user.length - 1 - i]]
          communicateTimeArr[i] = utils.formatTimeTwo(res.data.data[res.data.data.user[res.data.data.user.length - 1 - i]].time, "M-D h:m:s")
        }
        wx.request({
          url: 'https://theonlyobserver.cn/user/getuseropeninfo.php',
          data: {
            i: JSON.stringify(communicateIdList)
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: function(res) {
            // console.log('res', res)
            for (var i = 0; i < communicateIdList.length; i++) {
              communicateUserInfoArr[i] = res.data.data[communicateIdList[i]]
            }
            that.setData({
              communicateuserinfoarr: communicateUserInfoArr
            })
            console.log('communicateUserInfoArr', that.data.communicateuserinfoarr)
          },
          fail: function(res) {},
          complete: function(res) {},
        })
        that.setData({
          communicatelist: communicateList,
          communicatetimearr: communicateTimeArr,
          communicateidlist: communicateIdList
        })
        console.log('communicateList', communicateList)
        console.log('communicateidlist', that.data.communicateidlist)
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onLoad: function() {
    console.log(this.route)
    var that = this
    var newMessage = wx.getStorageSync('newmessage')
    console.log('newMessage为', newMessage)
    for (var i = 0; i < newMessage.lenth; i++) {
      var k = 0
      for (var j = 0; j < newMessageIdArr.lenth; j++) {
        if (newMessageIdArr[j] == newMessage[i].user) k++;
      }
      if (k == 0) {
        newMessageIdArr.push(newMessage[i].user)
      }
    }
    console.log('newMessageIdArr为', newMessageIdArr)
    if (newMessageIdArr.length > 0) {
      that.setData({
        newmessageid: newMessageIdArr[newMessageIdArr.length - 1]
      })
    }
    wx.removeStorage({
      key: 'newmessage'
    })
    app.socket.socketCallback({
      m: function(res) {
        console.log('本页消息回调', res)
        if (newMessageIdArr.length == 0) {
          newMessageIdArr[0] = res.data.user
        } else {
          for (var i = 0; i < newMessageIdArr.length;) {
            if (newMessageIdArr[i] == res.data.user) {
              newMessageIdArr.splice(i, 1);
              i--;
            }
            i++;
            if (i == newMessageIdArr.length) {
              newMessageIdArr[i] = res.data.user
              break
            }
          }
        }
        that.setData({
          newmessageid: newMessageIdArr[newMessageIdArr.length - 1]
        })
        if (!app.globalData.id || !app.globalData.session) {
          return
        }
        wx.request({
          url: 'https://theonlyobserver.cn/message/getmessagelist.php',
          data: {
            i: app.globalData.id,
            p: app.globalData.session
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          dataType: 'json',
          responseType: 'text',
          success: function(res) {
            console.log('res', res)
            for (var i = 0; i < res.data.data.user.length; i++) {
              communicateList[i] = res.data.data[res.data.data.user[res.data.data.user.length - 1 - i]]
              communicateIdList[i] = res.data.data.user[[res.data.data.user.length - 1 - i]]
              communicateTimeArr[i] = utils.formatTimeTwo(res.data.data[res.data.data.user[res.data.data.user.length - 1 - i]].time, "M-D h:m:s")
            }
            wx.request({
              url: 'https://theonlyobserver.cn/user/getuseropeninfo.php',
              data: {
                i: JSON.stringify(communicateIdList)
              },
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              method: 'POST',
              dataType: 'json',
              responseType: 'text',
              success: function(res) {
                console.log('res', res)
                for (var i = 0; i < communicateIdList.length; i++) {
                  communicateUserInfoArr[i] = res.data.data[communicateIdList[i]]
                }
                that.setData({
                  communicateuserinfoarr: communicateUserInfoArr
                })
                console.log('communicateUserInfoArr', that.data.communicateuserinfoarr)
              },
              fail: function(res) {},
              complete: function(res) {},
            })
            that.setData({
              communicatelist: communicateList,
              communicatetimearr: communicateTimeArr,
              communicateidlist: communicateIdList
            })
            console.log('communicateList', communicateList)
            console.log('communicateidlist', that.data.communicateidlist)
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      }
    })
  },
  //vant框架滑动单元格组件
  onClose(event) {
    var that = this
    const {
      position,
      instance
    } = event.detail;
    switch (position) {
      case 'left':
      case 'cell':
      case 'outside':
        instance.close();
        break;
      case 'right':
        wx.showModal({
          title: '确认删除该聊天吗',
          //  content: none,
          showCancel: true,
          cancelText: '取消',
          cancelColor: '',
          confirmText: '删除',
          confirmColor: '#FF0000',
          success: function(res) {
            if (res.confirm) { //确认删除该聊天
              wx.request({
                url: 'https://theonlyobserver.cn/message/delmessagelist.php',
                data: {

                  i: app.globalData.id,
                  p: app.globalData.session,
                  s: communicateIdList[event.currentTarget.dataset['index']]
                },
                header: {
                  "content-type": "application/x-www-form-urlencoded"
                },
                method: 'POST',
                dataType: 'json',
                responseType: 'text',
                success: function(res) {
                  communicateList = []
                  communicateIdList = []
                  communicateTimeArr = []
                  console.log('res', res)
                  for (var i = 0; i < res.data.data.user.length; i++) {
                    communicateList[i] = res.data.data[res.data.data.user[res.data.data.user.length - 1 - i]]
                    communicateIdList[i] = res.data.data.user[[res.data.data.user.length - 1 - i]]
                    communicateTimeArr[i] = utils.formatTimeTwo(res.data.data[res.data.data.user[res.data.data.user.length - 1 - i]].time, "M-D h:m:s")
                  }
                  wx.request({
                    url: 'https://theonlyobserver.cn/user/getuseropeninfo.php',
                    data: {
                      i: JSON.stringify(communicateIdList)
                    },
                    header: {
                      "content-type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    dataType: 'json',
                    responseType: 'text',
                    success: function(res) {
                      console.log('res', res)
                      for (var i = 0; i < communicateIdList.length; i++) {
                        communicateUserInfoArr[i] = res.data.data[communicateIdList[i]]
                      }
                      that.setData({
                        communicateuserinfoarr: communicateUserInfoArr
                      })
                      console.log('communicateUserInfoArr', that.data.communicateuserinfoarr)
                    },
                    fail: function(res) {},
                    complete: function(res) {},
                  })
                  that.setData({
                    communicatelist: communicateList,
                    communicatetimearr: communicateTimeArr,
                    communicateidlist: communicateIdList

                  })
                  console.log('communicateUserInfoArr', that.data.communicateuserinfoarr)
                },
                fail: function(res) {},
                complete: function(res) {},
              })
            }
          }
        })
        break;
    }
  },
  clearNewMessage: function(e) {
    console.log('点击的聊天对象id是', e.currentTarget.id)
    for (var i = 0; i < newMessageIdArr.length; i++) {
      if (newMessageIdArr[i] == e.currentTarget.id) {
        newMessageIdArr.splice(i, 1)
      }
    }
    if (newMessageIdArr.length > 0) {
      this.setData({
        newmessageid: newMessageIdArr[newMessageIdArr.length - 1]
      })
    } else {
      this.setData({
        newmessageid: ' '
      })
    }


  },

  outTouristModel: function() {
    app.globalData.touristmodel = 0
    wx.navigateTo({
      url: '../homePage/login/login'
    })
  }
});