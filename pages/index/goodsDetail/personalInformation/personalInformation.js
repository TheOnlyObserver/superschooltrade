//index.js
//获取应用实例
const app = getApp()
var goodsListPage = 0
var sellerId = new Array;
var goodsListArr = new Array;
var goodsDetailUtils = require('../goodsDetailUtils.js')
var goodsListIfNewArrCanSetVersion = new Array
var ifIFocus = 0
var fansAmount //用于承接粉丝数
// var fansList = new Array;
Page({
  data: {
    ififocus: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      touristmodel: app.globalData.touristmodel
    })
    var that = this
    goodsListPage = 0
    goodsListArr = []
    goodsListIfNewArrCanSetVersion = []
    fansAmount = 0
    ifIFocus = 0 //数据初始化
    sellerId[0] = options.sellerid;

    console.log(sellerId)

    wx.request({ //请求当前用户信息
      url: 'https://theonlyobserver.cn/user/getuseropeninfo.php',
      data: {
        i: sellerId
      },
      success: function(res) {
        console.log(res.data.data[sellerId[0]])
        // fansList = res.data.data[sellerId[0]].fllowme
        for (var i = 0; i < res.data.data[sellerId[0]].followme.length; i++) {
          if (res.data.data[sellerId[0]].followme[i] == app.globalData.id) {
            ifIFocus = 1
          }
        }
        fansAmount = res.data.data[sellerId[0]].followme.length
        that.setData({
          sellerinfo: res.data.data[sellerId[0]],
          fansamount: fansAmount, //更新粉丝数
          ififocus: ifIFocus
        })
        wx.setNavigationBarTitle({ //更新顶部导航栏文字
          title: res.data.data[sellerId[0]].nick + '的个人主页',
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })





    wx.request({ //请求该用户发布的商品信息
      url: 'https://theonlyobserver.cn/object/select.php',
      data: {
        e: goodsListPage,
        d: sellerId[0],
        m: 2
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        goodsListArr = res.data.data
        console.log('获取到发布的商品列表', goodsListArr)
        //循环转化商品新旧状态
        for (var i = 0; i < goodsListArr.length; i++) {

          goodsListIfNewArrCanSetVersion[i] = goodsDetailUtils.ifNew(goodsListArr[i].new)

        }

        that.setData({
          goodslistarr: goodsListArr,
          ifnew: goodsListIfNewArrCanSetVersion
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })

  },
  onReachBottom: function() {
    var that = this
    goodsListPage++;
    wx.request({
      url: 'https://theonlyobserver.cn/user/getuseropeninfo.php',
      data: {
        i: sellerId
      },
      success: function(res) {
        console.log(res.data.data[sellerId[0]])
        that.setData({
          sellerinfo: res.data.data[sellerId[0]]
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })

    wx.request({
      url: 'https://theonlyobserver.cn/object/select.php',
      data: {
        e: goodsListPage,
        d: sellerId[0],
        m: 2
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        goodsListArr = goodsListArr.concat(res.data.data)
        console.log('继续获取到发布的商品列表', goodsListArr)
        //循环转化商品新旧状态
        for (var i = 0; i < goodsListArr.length; i++) {

          goodsListIfNewArrCanSetVersion[i] = goodsDetailUtils.ifNew(goodsListArr[i].new)

        }

        that.setData({
          goodslistarr: goodsListArr,
          ifnew: goodsListIfNewArrCanSetVersion
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })




  },
  ifFocus: function() {
    var that = this
    if (!ifIFocus) {
      wx.request({
        url: 'https://theonlyobserver.cn/user/follow.php',
        data: {
          i: app.globalData.id,
          p: app.globalData.session,
          s: sellerId[0],
          m: 1
        },
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          console.log(res)
          if (res.data.code == 1) {
            ifIFocus = 1
            wx.showToast({
              title: '关注成功',
              icon: 'none',
              duration: 1500,
              mask: false
            })
            that.setData({
              ififocus: 1,
              fansamount: ++fansAmount
            })
          }
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    } else if (ifIFocus) {
      wx.request({
        url: 'https://theonlyobserver.cn/user/follow.php',
        data: {
          i: app.globalData.id,
          p: app.globalData.session,
          s: sellerId[0],
          m: 2
        },
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          if (res.data.code == 1) {
            ifIFocus = 0
            wx.showToast({
              title: '取消关注成功',
              icon: 'none',
              duration: 1500,
              mask: false
            })
            that.setData({
              ififocus: 0,
              fansamount: --fansAmount
            })
          }
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    }

  },
  chatWith: function() {
    if (sellerId[0]) {
      wx.navigateTo({
        url: '../../../communicatePage/chat/chat?chatwithid=' + sellerId[0] + '&chatwithimg=' + this.data.sellerinfo.img,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
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
      url: '../../../homePage/login/login'
    })
  }

})