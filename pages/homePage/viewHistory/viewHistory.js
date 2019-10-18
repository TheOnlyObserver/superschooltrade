// pages/homePage/viewHistory/viewHistory.js
var app = getApp();
var viewHistoryIdArr = new Array;
var viewHistoryArr = new Array;
var viewHistoryIfNewArr = new Array;//用来存放商品新旧状态的数组
var goodsDetailUtils = require('../../index/goodsDetail/goodsDetailUtils.js')
Page({
  data: {

  },
  onLoad: function() {
    viewHistoryIdArr = []
    viewHistoryArr =[]
    viewHistoryIfNewArr = []//数据初始化
    console.log('app.globalData.id,app.globalData.session', app.globalData.id, app.globalData.session)
    var that = this
    wx.request({
      url: 'https://theonlyobserver.cn/user/getuserinfo.php',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        i: app.globalData.id,
        p: app.globalData.session,
        m: 1
      },
      success: function(res) {
        viewHistoryIdArr = JSON.parse(res.data.data) //获取到浏览历史商品id
        console.log('浏览历史商品id数组：', viewHistoryIdArr)
        // console.log('浏览历史商品id数组：', JSON.parse(viewHistoryIdArr) )
        if (viewHistoryIdArr.length>100){//如果浏览历史超过100条，只请求100条数据
          viewHistoryIdArr = viewHistoryIdArr.slice(viewHistoryIdArr.length - 100, viewHistoryIdArr.length)
        }
       
        wx: wx.request({
          url: 'https://theonlyobserver.cn/object/getobjectinfoa.php',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          data: {
            o: JSON.stringify(viewHistoryIdArr)
          },
          success: function(res) {
            console.log('浏览历史商品全部', res)
            //
            for (var i = viewHistoryIdArr.length - 1; i >= 0; i--) {//为需要的数组循环赋值
              if (res.data.data[viewHistoryIdArr[i]] == undefined) {

              } else {
              viewHistoryArr[viewHistoryIdArr.length - 1 - i] = res.data.data[viewHistoryIdArr[i]] //按浏览顺序排序的历史记录数组
              }
              console.log('new!!!', res.data.data[viewHistoryIdArr[i]])
              if (res.data.data[viewHistoryIdArr[i]]== undefined){

              }else{
                viewHistoryIfNewArr[viewHistoryIdArr.length - 1 - i] = res.data.data[viewHistoryIdArr[i]].new//用来存放商品新旧状态的数组
              }
            
            }
            var viewHistoryIfNewArrCanSetVersion = new Array;  //用来存放商品新旧状态的临时数组（可用于更新数据版）
            for (var i = 0; i < viewHistoryIfNewArr.length; i++) {

              viewHistoryIfNewArrCanSetVersion[i] = goodsDetailUtils.ifNew(viewHistoryIfNewArr[i])

            }
            console.log('viewHistoryIfNewArr', viewHistoryIfNewArr)
            that.setData({
             goodsifnew:viewHistoryIfNewArrCanSetVersion
            })
            console.log('获取到浏览历史全部商品数组viewHistoryArr', viewHistoryArr)
            that.setData({
              viewhistoryarr: viewHistoryArr,
              viewhistoryidarr: viewHistoryIdArr,

            })

          }

        })
      }
    })
  }
  // ,
  // onClose(event) {
  //   const {
  //     position,
  //     instance
  //   } = event.detail;
  //   switch (position) {
  //     case 'left':
  //     case 'cell':
  //       instance.close();
  //       break;
  //     case 'right':
  //       Dialog.confirm({
  //         message: '确定删除吗？'
  //       }).then(() => {
  //         instance.close();
  //       });
  //       break;
  //   }
  // }
})