// pages/communicatePage/communicatePage.js

// function setstorage(k,d){
// wx.setStorage({
//   key: 'k',
//   data: 'd',
//   success: function(res) {},
//   fail: function(res) {},
//   complete: function(res) {},
// })

// }
var app = getApp()
var systemInfo = wx.getSystemInfoSync();
function showtoast(msg) {
  wx.showToast({
    title: msg,
    icon: 'none',
    // image: 'none',
    duration: 1700,
    mask: false,
    success: function(res) {},
    fail: function(res) {},
    complete: function(res) {},
  })
}

var id, session;

Page({
  data: {
    schoolArray: ['学校', '大连工业大学'],
    objectSchoolArray: [{
      id: 0,
      name: ""
    }, {
      id: 1,
      name: "dlpu"
    }],
    school: 0,
    schoolName: "",
    ifnew: 0
  },
  onLoad: function(options) {
    app.globalData.touristmodel = 0//初始不为游客模式
    id = wx.getStorageSync('id')
    session = wx.getStorageSync('session')
    var animation1 = wx.createAnimation({
      duration: 1600,
      timingFunction: 'ease',
      delay: 0
    });
    var animation2 = wx.createAnimation({
      duration: 1600,
      timingFunction: 'ease',
      delay: 0
    });
    var animation3 = wx.createAnimation({
      duration: 1600,
      timingFunction: 'ease',
      delay: 0
    });
    animation1.translateY(700 / 750 * systemInfo.windowWidth).step().opacity(1).step()
    animation2.translateY(-1000 / 750 * systemInfo.windowWidth).step()
    animation3.translateY(700 / 750 * systemInfo.windowWidth).step()
    this.setData({
      logotext: animation1.export(),
      mainwrap: animation2.export(),
      logo: animation3.export()
    })
    if (id && session) {
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
          console.log('自动登录返回登录信息，userData为', userdata)
          //验证session状态
          if (userdata.data.code == 1) {
            //登录正常
            console.log('登录正常')
            //跳转至首页
            wx.switchTab({
              url: '../../index/index',
              success: function(res) {
                console.log(res)
              },
              fail: function(res) {
                console.log(res)
              },
              complete: function(res) {},
            })

          } else {
            //登录状态不为1，自动登录失败
            //清除本地缓存
            wx.clearStorageSync()
            showtoast('登录凭证失效请重新登陆')

          }
        },
        fail: function() {},
        complete: function() {},
      })
    } else {
      console.log('未获取到本地id，session')
    }

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  bindPickerChange: function(e) {
    //选择学校的滚轮
    this.setData({
      school: e.detail.value,
      schoolName: this.data.objectSchoolArray[e.detail.value].name
    })
  },



  login: function(e) { //表单
    var that = this
    if (!that.data.schoolName) {
      showtoast('请选择学校哦')
    } else if (!e.detail.value.uact) {
      showtoast('请输入学号哦')
    } else if (!e.detail.value.upwd) {
      showtoast('密码咋还不填了呢？？？')
    } else {
      //输入框均不为空

      wx.request({
        url: 'https://www.theonlyobserver.cn/user/login.php',
        data: {
          u: e.detail.value.uact,
          p: e.detail.value.upwd,
          s: that.data.schoolName
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          console.log("提交成功后返回的值", res)
          if (res.data.data.session) {
            console.log("登陆成功！")
            // console.log("表单内容成功提交", e.detail.value);
            console.log("教务处账号：", e.detail.value.uact, "密码：", e.detail.value.upwd, "学校：", that.data.schoolName); //act为教务处账号，pwd为教务处密码
            wx.setStorage({
              key: 'uact',
              data: e.detail.value.uact,
              success: function() {},
              fail: function() {},
              complete: function() {},
            })
            wx.setStorage({
              key: 'id',
              data: res.data.data.id,
              success: function() {
                id = res.data.data.id
                app.globalData.id = res.data.data.id
              },
              fail: function() {},
              complete: function() {},
            })
            wx.setStorage({
              key: 'session',
              data: res.data.data.session,
              success: function() {
                session = res.data.data.session
                app.globalData.session = res.data.data.session
                console.log('存储本地id，session，学号', id, session, e.detail.value.uact)

              },
              fail: function() {},
              complete: function() {},
            })
            wx.setStorage({
              key: 'userData',
              data: res,
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
            //判断是不是新人，是的话弹出新人提示界面
            if (res.data.data.new) {
              that.setData({
                datanew: res.data.data.new,
                ifnew: 1
              })
            } else {
              //不是新人直接跳转到主页面

              wx.switchTab({
                url: '../../index/index',
                success: function(res) {},
                fail: function(res) {},
                complete: function(res) {},
              })
            }

          } else {
            console.log("登录失败")
            switch (res.data.code) {
              case 2:
                {
                  showtoast("数据丢失")
                  break
                }
              case 3:
                {
                  showtoast("权限限制")
                  break
                }
              case 4:
                {
                  showtoast("学号/密码错误")
                  break
                }
            }

          }
        },
        fail: function(res) {
          showtoast('服务器维护中…')
        },
        complete: function(res) {},
      })

    }





  },
  getUserInfo: function(e) {
    console.log(e.detail.userInfo)
    wx.setStorage({
      key: 'userInfo',
      data: e.detail.userInfo,
      success: function(res) {
        console.log("用户信息已存储", e.detail.userInfo)
      }
    })
    wx.request({
      url: 'https://theonlyobserver.cn/user/updatauserinfo.php',
      data: {
        i: id,
        p: session,
        d: JSON.stringify(e.detail.userInfo)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res)
        wx.switchTab({
          url: '../../index/index',
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })

  },
  nowxinfo: function() {
    wx.switchTab({
      url: '../homePage',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  touristModel:function(){
    wx.clearStorageSync()
    app.globalData.touristmodel = 1
    console.log('app.globalData.touristmodel', app.globalData.touristmodel)
    wx.switchTab({
      url: '../../index/index',
      success: function(res) {
        showtoast('已进入游客模式，部分功能受限')
      }
    })
  }
})