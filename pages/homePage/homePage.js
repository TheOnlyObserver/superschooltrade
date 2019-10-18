//index.js
//获取应用实例
var userInfo
var id, session
const app = getApp()

Page({
  data: {
    loginStatus: "loginSignup/loginSignup",
    headPortrait: "../../images/personalPortrait.png",
    nickName: '游客',
    userCollege: "未知",
    userMajor: "未知",
    userGrade: "未知",
    globaldataid: app.globalData.id,
    focusamount: 0,
    fansamount: 0
  },
  onLoad: function(e) {
   
    if (!app.globalData.id || !app.globalData.session) {
      return
    }
    var that = this
    id = wx.getStorageSync('id')
    session = wx.getStorageSync('session')

    wx.request({
      url: 'https://theonlyobserver.cn/user/getuserinfo.php',
      data: {
        'i': id,
        'p': session
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(userdata) {
        console.log('获取用户信息，获取到的userData为', userdata)
        if (userdata.data.code == 6) {
          console.log('登录凭证失效')
          wx.navigateTo({
            url: 'login/login'
          })
        }
        //获取用户信息成功，将其存至本地
        wx.setStorage({
          key: 'userData',
          data: userdata,
          success: function() {
            console.log('获取用户信息并至本地，本地userData为', userdata)

            //更新头像
            that.setData({

              imgurl: decodeURIComponent(userdata.data.data.data.img)
            })
          },
          fail: function() {},
          complete: function() {},
        })

        wx.request({
          url: 'https://theonlyobserver.cn/user/getuserinfo.php',
          data: {
            i: app.globalData.id,
            p: app.globalData.session,
            m: 5
          },
          success: function(res) {
            console.log(JSON.parse(res.data.data).length)
            that.setData({
              fansamount: JSON.parse(res.data.data).length
            })
          }
        })
        wx.request({
          url: 'https://theonlyobserver.cn/user/getuserinfo.php',
          data: {
            i: app.globalData.id,
            p: app.globalData.session,
            m: 2
          },
          success: function(res) {
            console.log(JSON.parse(res.data.data).length)
            that.setData({
              focusamount: JSON.parse(res.data.data).length
            })
          }
        })
      },
      fail: function() {},
      complete: function() {},
    })

  },
  onShow: function(e) {
    this.setData({
      touristmodel: app.globalData.touristmodel
    })
    var that = this
    if (!app.globalData.id || !app.globalData.session) {
      return
    }
    wx.getStorage({
      key: 'userData',
      success: function(res) {
        console.log("我的主页界面获取到本地存储服务器中用户数据", res.data)
        console.log('建立数据', decodeURIComponent(res.data.data.data.data.img), decodeURIComponent(res.data.data.data.data.nick))
        that.setData({
          headPortrait: decodeURIComponent(res.data.data.data.data.img),
          nickName: decodeURIComponent(res.data.data.data.data.nick)

        })
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  touristModel: function() {
    wx.showToast({
      title: '权限不足，功能受限',
      icon: 'none',
      duration: 1500,
    })
  },
  outTouristModel: function() {
    app.globalData.touristmodel = 0
    wx.navigateTo({
      url: 'login/login'
    })
  }


})