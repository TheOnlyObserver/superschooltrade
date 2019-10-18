// pages/homePage/saveList/saveList.js
var app = getApp();
var goodsListPage = 0;
var goodsListIdArr = new Array
var goodsListArr = new Array
var goodsAddTimeArr = new Array
var util = require('../../../utils/util.js');

Page({
  data: {

  },
  onLoad(options) {
    //页面加载时初始化数据
    var that = this;
    goodsListPage = 0;
    goodsListIdArr = []
    var goodsListArr = []
    var goodsAddTimeArr = []
    this.setData({
      goodslistarr: [],
      goodslistidarr: [],
      goodsaddtimearr: []
    })
    //页面加载时
    // console.log(options.goodslistmode) //列表模式
    //请求商品列表
    wx.request({
      url: 'https://theonlyobserver.cn/user/getuserinfo.php',
      data: {
        p: app.globalData.session,
        i: app.globalData.id,
        m: 3
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res) {
        console.log('id', app.globalData.id)
        goodsListIdArr = JSON.parse(res.data.data)
        console.log('获取个人商品列表成功，goodsListIdArr', goodsListIdArr)
        wx.request({
          url: 'https://theonlyobserver.cn/object/getobjectinfoa.php',
          data: {
            o: JSON.stringify(goodsListIdArr)
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: function(res) {
            // goodsListArr = res.data.data
            console.log('获取个人商品列表成功，res.data.data', res.data.data)
            //利用goodsListIdArr倒序循环取 goodsListArr值
            for (var i = goodsListIdArr.length - 1; i >= 0; i--) {
              goodsListArr[goodsListIdArr.length - 1 - i] = res.data.data[goodsListIdArr[i]]
            }
            console.log('个人商品列表排序成功，goodsListArr', goodsListArr)
            that.setData({
              goodslistarr: goodsListArr,
              goodslistidarr: goodsListIdArr,
              goodsaddtimearr: goodsAddTimeArr
            })
          },
          fail: function(res) {},
          complete: function(res) {},
        })
        // for (var i = 0; i < goodsListArr.length; i++) {
        //   goodsAddTimeArr[i] = util.formatTimeTwo(res.data.data[i].time, 'Y-M-D h:m:s')
        // }

        // console.log(goodsAddTimeArr)
      }
    })

  },
 

  onUnload: function() {


  },
   //vant框架滑动单元格点击删除时触发
  onClose(event) {
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
        {
          instance.close();
          var that = this
          wx.showModal({
            title: '确认取消收藏该商品吗',
            // content: '',
            showCancel: true,
            cancelText: '不取消',
            cancelColor: '',
            confirmText: '确认取消',
            confirmColor: '#FF0000',
            success: function(res) {
              if (res.confirm) {
                console.log('确认取消收藏', res)
                //当前删除商品id
                console.log('取消收藏商品id', goodsListIdArr[goodsListIdArr.length - 1 - event.currentTarget.dataset['index']])
                // goodsListArr[event.currentTarget.dataset['index']]
                wx.request({
                  url: 'https://theonlyobserver.cn/object/save.php',
                  data: {
                    i: app.globalData.id,
                    p: app.globalData.session,
                    o: goodsListIdArr[goodsListIdArr.length - 1 - event.currentTarget.dataset['index']],
                    m: 2
                  },
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  method: 'POST',
                  dataType: 'json',
                  responseType: 'text',
                  success: function(res) {
                    wx.showToast({
                      title: '取消收藏成功',
                      icon: 'none',
                      duration: 1500,
                      mask: false
                    })
                    //取消收藏成功
                    console.log(res)

                    //重新请求商品列表，并更新数据
                    //请求商品列表
                    wx.request({
                      url: 'https://theonlyobserver.cn/user/getuserinfo.php',
                      data: {
                        p: app.globalData.session,
                        i: app.globalData.id,
                        m: 3
                      },
                      header: {
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      method: 'POST',
                      success: function(res) {
                        console.log('id', app.globalData.id)
                        goodsListIdArr = JSON.parse(res.data.data)
                        console.log('获取个人商品列表成功，goodsListIdArr', goodsListIdArr)
                        wx.request({
                          url: 'https://theonlyobserver.cn/object/getobjectinfoa.php',
                          data: {
                            o: JSON.stringify(goodsListIdArr)
                          },
                          header: {
                            'content-type': 'application/x-www-form-urlencoded'
                          },
                          method: 'POST',
                          dataType: 'json',
                          responseType: 'text',
                          success: function(res) {
                            // goodsListArr = res.data.data
                            console.log('获取个人商品列表成功，res.data.data', res.data.data)
                            goodsListArr = []
                            //利用goodsListIdArr倒序循环取 goodsListArr值
                            for (var i = goodsListIdArr.length - 1; i >= 0; i--) {
                              goodsListArr[goodsListIdArr.length - 1 - i] = res.data.data[goodsListIdArr[i]]
                            }
                            console.log('个人商品列表排序成功，goodsListArr', goodsListArr)
                            that.setData({
                              goodslistarr: goodsListArr,
                              goodslistidarr: goodsListIdArr,
                              goodsaddtimearr: goodsAddTimeArr
                            })
                          },
                          fail: function(res) {},
                          complete: function(res) {},
                        })
                      }
                    })



                  },
                  fail: function(res) {},
                  complete: function(res) {},
                })
              } else if (res.cancel) {
                console.log('取消删除', res)
              }
            }
          })
          break;
        }
    }
  }
});