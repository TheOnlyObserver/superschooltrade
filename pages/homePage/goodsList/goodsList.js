// pages/homePage/goodsList/goodsList.js
var app = getApp();
var goodsListPage = 0;
var goodsListArr = new Array
var goodsAddTimeArr = new Array
var util = require('../../../utils/util.js');

Page({
  data: {

  },
  onLoad(options) {
    var that = this;

    //页面加载时
    console.log(options.goodslistmode) //列表模式
    //请求商品列表
    wx.request({
      url: 'https://theonlyobserver.cn/object/select.php',
      data: {
        e: goodsListPage,
        d: app.globalData.id,
        m: 2
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res) {
        console.log('id', app.globalData.id)
        console.log('获取个人商品列表成功，res.data.data', res.data.data)
        goodsListArr = res.data.data
        for (var i = 0; i < goodsListArr.length; i++) {
          goodsAddTimeArr[i] = util.formatTimeTwo(res.data.data[i].time, 'Y-M-D h:m:s')
        }
        console.log(goodsAddTimeArr)
        that.setData({ //更新数据
          goodslistarr: goodsListArr,
          sellerid: app.globalData.id,
          goodsaddtimearr: goodsAddTimeArr

        })
      }
    })






  },
  onReachBottom: function() {
    var that = this
    goodsListPage++

    //请求商品列表
    wx.request({
      url: 'https://theonlyobserver.cn/object/select.php',
      data: {
        e: goodsListPage,
        d: app.globalData.id,
        m: 2
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res) {
        console.log('id', app.globalData.id)
        goodsListArr = goodsListArr.concat(res.data.data)
        console.log('获取个人商品列表成功，goodsListArr', goodsListArr)

        for (var i = 0; i < goodsListArr.length; i++) {
          goodsAddTimeArr[i] = util.formatTimeTwo(goodsListArr[i].time, 'Y-M-D h:m:s')
        }
        that.setData({ //更新数据
          goodslistarr: goodsListArr,
          sellerid: app.globalData.id,
          goodsaddtimearr: goodsAddTimeArr
        })
      }
    })



  },
  //vant框架滑动单元格组件


  onClose(event) {
    const { position, instance } = event.detail;
    switch (position) {
      case 'left':
      case 'cell':
      case 'outside':
        instance.close();
        break;
      case 'right':{
        instance.close();

       
        var that = this
        wx.showModal({
          title: '确认删除该商品吗',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '',
          confirmText: '删除',
          confirmColor: '#FF0000',
          success: function (res) {
            if (res.confirm) {
              console.log('确认删除', res)
              //当前删除商品id
              console.log('当前删除商品id', goodsListArr[event.currentTarget.dataset['index']].id)
              // goodsListArr[event.currentTarget.dataset['index']]
              wx.request({
                url: 'https://theonlyobserver.cn/object/delobject.php',
                data: {
                  i: app.globalData.id,
                  p: app.globalData.session,
                  o: goodsListArr[event.currentTarget.dataset['index']].id
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                dataType: 'json',
                responseType: 'text',
                success: function (res) {
                  //删除成功
                  console.log(res)
                  goodsListPage = 0 //从第0页开始请求
                  //重新请求商品列表，并更新数据
                  wx.request({
                    url: 'https://theonlyobserver.cn/object/select.php',
                    data: {
                      e: goodsListPage,
                      d: app.globalData.id,
                      m: 2
                    },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    method: 'POST',
                    success: function (res) {
                      console.log('id', app.globalData.id)
                      console.log('获取个人商品列表成功，res.data.data', res.data.data)
                      goodsListArr = res.data.data
                      for (var i = 0; i < goodsListArr.length; i++) {
                        goodsAddTimeArr[i] = util.formatTimeTwo(res.data.data[i].time, 'Y-M-D h:m:s')
                      }
                      console.log(goodsAddTimeArr)
                      that.setData({ //更新数据
                        goodslistarr: goodsListArr,
                        sellerid: app.globalData.id,
                        goodsaddtimearr: goodsAddTimeArr

                      })
                    }
                  })
                },
                fail: function (res) { },
                complete: function (res) { },
              })
            } else if (res.cancel) {
              console.log('取消删除', res)
            }
          }
        })

        break;
      }
        
         
    }
  },
  onUnload: function() {
    goodsListPage = 0;
    var goodsListArr = []
    var goodsAddTimeArr = []
  }
});