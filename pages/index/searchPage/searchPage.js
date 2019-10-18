var searchContent; //从上页面接受搜索信息
var vanTabsChangeIndex = 0
var goodsPage = 0;
var sellerPage = 0
var goodsArr = new Array
var sellerArr = new Array
const app = getApp()
function search(searchcontent, that) {

}


Page({
  data: {

  },

  onLoad: function(options) {
    this.setData({
      touristmodel: app.globalData.touristmodel
    })
    goodsPage = 0
    sellerPage = 0
    goodsArr = []
    sellerArr = []
    var that = this
    searchContent = options.searchcontent
    that.setData({
      lastsearchcontent: options.searchcontent
    })
    console.log('searchContent', searchContent)
    wx.request({
      url: 'https://theonlyobserver.cn/object/select.php',
      data: {
        e: goodsPage,
        m: 'x',
        d: searchContent
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },

      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log('res', res)
        if (res.data.data.length == 0) {
          wx.showToast({
            title: '没有更多数据了哦',
            icon: 'none',
            duration: 1500,
            mask: false
          })
        } else {
          goodsArr = res.data.data
          that.setData({
            goodslist: goodsArr
          })
        }

      },
      fail: function(res) {},
      complete: function(res) {},
    })




  },
  getInput: function(e) {
    searchContent = e.detail.value
  },
  search: function() {
    goodsPage = 0
    sellerPage = 0
    goodsArr = []
    sellerArr = []
    var that = this
    console.log('searchContent', searchContent)
    if (vanTabsChangeIndex == 0){
      wx.request({
        url: 'https://theonlyobserver.cn/object/select.php',
        data: {
          e: goodsPage,
          m: 'x',
          d: searchContent
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },

        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          console.log('res', res)
          if (res.data.data.length == 0) {
            wx.showToast({
              title: '没有更多数据了哦',
              icon: 'none',
              duration: 1500,
              mask: false
            })
          } else {
            goodsArr = res.data.data
            that.setData({
              goodslist: goodsArr
            })
          }

        },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (vanTabsChangeIndex == 1){
      wx.request({
        url: 'https://theonlyobserver.cn/object/select.php',
        data: {
          e: sellerPage,
          m: 'u',
          d: searchContent
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },

        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          console.log('res', res)
          if (res.data.data.length == 0) {
            wx.showToast({
              title: '没有更多数据了哦',
              icon: 'none',
              duration: 1500,
              mask: false
            })
          } else {
            sellerArr = res.data.data
            that.setData({
              sellerarr:sellerArr
            })
          }

        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
   
  },
  vanTabsChange: function(e) {
    var that = this
    console.log('标签索引', e.detail.index)
    vanTabsChangeIndex = e.detail.index
    if (vanTabsChangeIndex == 1 && sellerArr.length == 0) {
      wx.request({
        url: 'https://theonlyobserver.cn/object/select.php',
        data: {
          e: sellerPage,
          m: 'u',
          d: searchContent
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },

        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          console.log('res', res)
          sellerArr = res.data.data
          that.setData({
            sellerarr : sellerArr 
          })
          res.data.data
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  },
  onReachBottom: function() {
    var that = this;
    console.log('触发上拉触底函数')
    goodsPage++; //请求页数+1
    //执行新商品页面请求
    if(vanTabsChangeIndex == 0){
      wx.request({
        url: 'https://theonlyobserver.cn/object/select.php',
        data: {
          e: goodsPage,
          m: 'x',
          d: searchContent
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },

        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          console.log('res', res)
          if (res.data.data.length == 0) {
            wx.showToast({
              title: '没有更多数据了哦',
              icon: 'none',
              duration: 1500,
              mask: false
            })
          } else {
            goodsArr = goodsArr.concat(res.data.data)
            that.setData({
              goodslist: goodsArr
            })
          }

        },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (vanTabsChangeIndex == 1){
      wx.request({
        url: 'https://theonlyobserver.cn/object/select.php',
        data: {
          e: goodsPage,
          m: 'u',
          d: searchContent
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },

        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          console.log('res', res)
          if (res.data.data.length == 0) {
            wx.showToast({
              title: '没有更多数据了哦',
              icon: 'none',
              duration: 1500,
              mask: false
            })
          } else {
            sellerArr = sellerArr.concat(res.data.data)
            that.setData({
              sellerarr: sellerArr
            })
          }

        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
   



  },
  outTouristModel: function () {
    app.globalData.touristmodel = 0
    wx.navigateTo({
      url: '../../homePage/login/login'
    })
  }

})