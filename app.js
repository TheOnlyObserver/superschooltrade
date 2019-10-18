//app.js
App({
  onLaunch: function() {

  },
  onShow: function() {
    console.log('程序由后台转至前台')
  },
  globalData: {
    userInfo: null,
    id: wx.getStorageSync('id'),
    session: wx.getStorageSync('session'),
    touristmodel:0
  }
})