// pages/homePage/myFocus/myFocus.js
var app = getApp()
var myFocusIdArr = new Array;
var myFocusArr = new Array;

function getMyFocus(that) {
  wx.request({
    url: 'https://theonlyobserver.cn/user/getuserinfo.php',
    data: {
      i: app.globalData.id,
      p: app.globalData.session,
      m: 2
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: function(res) {
      myFocusIdArr = JSON.parse(res.data.data)
      console.log('我关注的用户ID列表', myFocusIdArr)
      wx.request({
        url: 'https://theonlyobserver.cn/user/getuseropeninfo.php',
        data: {
          i: myFocusIdArr
        },
        success: function(res) {
          //循环为myFocusArr赋值
          for (var i = 0; i < myFocusIdArr.length; i++) {
            myFocusArr[i] = res.data.data[myFocusIdArr[myFocusIdArr.length - 1 - i]]
          }
          that.setData({
            myfocusarr: myFocusArr,
            myfocusidarr: myFocusIdArr
          })
          console.log('我关注的用户信息列表', myFocusArr)
        }
      })
    },
    fail: function(res) {},
    complete: function(res) {}
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  
    var that = this
    getMyFocus(that)


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
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
        instance.close();
        wx.showModal({
          title: '确认取消关注吗',
          content: '',
          showCancel: true,
          cancelText: '不取消',
          cancelColor: '',
          confirmText: '确认',
          confirmColor: '#FF0000',
          success: function(res) {
            if (res.confirm) {
              console.log('取消关注用户id', myFocusIdArr[myFocusIdArr.length-1- event.currentTarget.dataset['index']])
              wx.request({
                url: 'https://theonlyobserver.cn/user/follow.php',
                data: {
                  i: app.globalData.id,
                  p: app.globalData.session,
                  s: myFocusIdArr[myFocusIdArr.length - 1 - event.currentTarget.dataset['index']],
                  m: 2
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                dataType: 'json',
                responseType: 'text',
                success: function(res) {
                  console.log('取消关注', res)
                  myFocusIdArr = []
                  myFocusArr = []
                  getMyFocus(that)
                },
                fail: function(res) {},
                complete: function(res) {},
              })
            }
          }
        })
        break;
    }
  }
})