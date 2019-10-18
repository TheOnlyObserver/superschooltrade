//index.js
//获取应用实例
import Toast from '../../miniprogram_npm/vant-weapp/dist/toast/toast';
import Notify from '../../miniprogram_npm/vant-weapp/dist/notify/notify';
var id, session;
var listPages = 0;
var latestIdArr = new Array;
var hottestIdArr = new Array;
var latestArr = new Array;
var hottestArr = new Array;
const app = getApp()

Page({
  data: {
    // touristmodel: app.globalData.touristmodel,
    // 以下为轮播图
    act_ad_imgArr: [
      '../../images/act_ad1.png'
      // ,
      // '../../images/act_ad2.png'

    ]

  },
  onLoad: function() {

    console.log('app.globalData.touristmodel', app.globalData.touristmodel);
    listPages = 0; //数据初始化
    var that = this
    //同步获取id和session
    id = wx.getStorageSync('id')
    session = wx.getStorageSync('session')
    //首次加载自动执行下拉刷新
    wx.startPullDownRefresh()
    //  正常载入页面即连接socket服务
    console.log('id,session为', id, session)

    require("../../utils/socket.js")({
      //版本更新后自动获取本地存储id session
      // id: id,
      // pass: session
    })
    //socket连接模块

    if (id && session) { //登录成功后
      console.log('app.socket:', app.socket)
      app.socket.connSocket()
      wx.request({
        url: 'https://theonlyobserver.cn/message/newmessage.php',
        data: {
          i: id,
          p: session
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function(newmsg) {
          console.log('未读消息newmsg', newmsg)
          if (newmsg.data.data.length == 0 || newmsg.data.data == undefined) {} else {
            wx.setTabBarBadge({
              index: 1,
              text: String(newmsg.data.data.length),
            })
            wx.setStorageSync('newmessage', newmsg.data.data);
          }
          var socketReconnectNumber = 0
          app.socket.socketCallback({
            gm: function(res) {
              console.log('全局消息回调', res)
              if (res.msg != 'socket conn ok' && res.msg !='socket conn success'){
                Toast('收到一条新消息')
              }
              
            },
            gc: function(res) {
              socketReconnectNumber++
              if (socketReconnectNumber <= 5) {
                console.log('socket关闭，自动重连尝试', res)
                Toast('网络环境较差，即时聊天重连尝试中')
                app.socket.connSocket()
              } else {
                Toast.fail('网络环境较差，即时聊天受限')
              }

            }
          })
        },
        fail: function(newmsg) {},
        complete: function(newmsg) {},
      })

    }
  },
  onShow: function() {
    this.setData({
      touristmodel: app.globalData.touristmodel
    })
  },
  getInput: function(e) {
    this.setData({
      inputcontent: e.detail.value
    })
    console.log('this.data.inputcontent', this.data.inputcontent)
  },
  onPullDownRefresh: function() {
    var that = this
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    setTimeout(function() {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
    Notify({
      text: '刷新成功✔',
      duration: 1300,
      selector: '#custom-selector',
      backgroundColor: 'rgb(255, 168, 142)'
    });
    latestIdArr = new Array;
    hottestIdArr = new Array;
    latestArr = new Array;
    hottestArr = new Array;
    //刷新时请求推荐商品信息
    wx.request({
      url: 'https://theonlyobserver.cn/object/select.php',
      data: {
        e: listPages,
        d: 0,
        m: 2
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log('最新商品id列表', res)
        for (var i = 0; i < res.data.data.length; i++) {
          latestIdArr[i] = res.data.data[i].id
        }
        console.log(latestIdArr)


        //用id列表批量请求商品信息
        wx.request({
          url: 'https://theonlyobserver.cn/object/getobjectinfoa.php',
          data: {
            o: latestIdArr
          },
          dataType: 'json',
          responseType: 'text',
          success: function(res) {
            console.log('获取到最新商品信息:', res.data.data)
            for (var i = 0; i < latestIdArr.length; i++) {
              latestArr[i] = res.data.data[latestIdArr[i]]
            }
            console.log('最新商品数组按id数组排序后:', latestArr)
            that.setData({
              latestarr: latestArr,
              latestidarr: latestIdArr
            })

          },
          fail: function(res) {},
          complete: function(res) {},
        })

      },
      fail: function(res) {},
      complete: function(res) {},
    })
    wx.request({
      url: 'https://theonlyobserver.cn/object/select.php',
      data: {
        e: listPages,
        d: 0,
        m: 0
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log('最热商品id列表', res.data.data)
        for (var i = 0; i < res.data.data.length; i++) {
          hottestIdArr[i] = res.data.data[i].id
        }
        console.log(hottestIdArr)
        //用id列表批量请求商品信息
        wx.request({
          url: 'https://theonlyobserver.cn/object/getobjectinfoa.php',
          data: {
            o: hottestIdArr
          },
          // header: {
          //   'content-type': 'application/x-www-form-urlencoded'
          // },
          // method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: function(res) {
            console.log('获取到最热商品信息:', res.data.data)
            for (var i = 0; i < hottestIdArr.length; i++) {
              hottestArr[i] = res.data.data[hottestIdArr[i]]
            }
            console.log('最热商品数组按id数组排序后:', hottestArr)
            that.setData({
              hottestarr: hottestArr,
              hottestidarr: hottestIdArr
            })
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // onReachBottom: function() {
  //   var that = this
  //   listPages++
  //   wx.request({
  //     url: 'https://theonlyobserver.cn/object/select.php',
  //     data: {
  //       e: listPages,
  //       d: 0,
  //       m: 2
  //     },
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     method: 'POST',
  //     dataType: 'json',
  //     responseType: 'text',
  //     success: function(res) {
  //       console.log('最新商品id列表', res)
  //       var tmpIdArr = new Array;
  //       var tmpArr = new Array;
  //       for (var i = 0; i < res.data.data.length; i++) {
  //         tmpIdArr[i] = res.data.data[i].id
  //       }
  //       // latestIdArr = latestIdArr.concat(tmpIdArr)
  //       console.log('临时id数组', tmpIdArr)
  //       //用临时id数组批量请求 临时 商品信息
  //       wx.request({
  //         url: 'https://theonlyobserver.cn/object/getobjectinfoa.php',
  //         data: {
  //           o: tmpIdArr
  //         },
  //         dataType: 'json',
  //         responseType: 'text',
  //         success: function(res) {
  //           console.log('获取到最新商品信息:', res.data.data)
  //           for (var i = 0; i < tmpIdArr.length; i++) {
  //             tmpArr[i] = res.data.data[tmpIdArr[i]]
  //           }
  //           latestArr = latestArr.concat(tmpArr)
  //           latestIdArr = latestIdArr.concat(tmpIdArr)
  //           console.log('最新商品数组按id数组排序后:', latestArr)
  //           that.setData({
  //             latestarr: latestArr,
  //             latestidarr: latestIdArr
  //           })

  //         },
  //         fail: function(res) {},
  //         complete: function(res) {},
  //       })

  //     },
  //     fail: function(res) {},
  //     complete: function(res) {},
  //   })
  //   wx.request({
  //     url: 'https://theonlyobserver.cn/object/select.php',
  //     data: {
  //       e: listPages,
  //       d: 0,
  //       m: 0
  //     },
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     method: 'POST',
  //     dataType: 'json',
  //     responseType: 'text',
  //     success: function(res) {
  //       console.log('最热商品id列表', res.data.data)
  //       var tmpIdArr = new Array;
  //       var tmpArr = new Array;
  //       for (var i = 0; i < res.data.data.length; i++) {
  //         tmpIdArr[i] = res.data.data[i].id
  //       }

  //       // hottestIdArr = hottestIdArr.concat(tmpArr)

  //       console.log('tmpIdArr', tmpIdArr)
  //       //用id列表批量请求商品信息
  //       wx.request({
  //         url: 'https://theonlyobserver.cn/object/getobjectinfoa.php',
  //         data: {
  //           o: tmpIdArr
  //         },
  //         dataType: 'json',
  //         responseType: 'text',
  //         success: function(res) {
  //           console.log('获取到最热商品信息:', res.data.data)
  //           for (var i = 0; i < tmpIdArr.length; i++) {
  //             tmpArr[i] = res.data.data[tmpIdArr[i]]
  //           }
  //           console.log(' tmpArr', tmpArr)
  //           console.log(' hottestArr', hottestArr)

  //           hottestArr = hottestArr.concat(tmpArr)
  //           hottestIdArr = hottestIdArr.concat(tmpIdArr)
  //           console.log('最热商品ID数组总计:', hottestIdArr)

  //           console.log('最热商品数组按id数组排序后:', hottestArr)
  //           that.setData({
  //             hottestarr: hottestArr,
  //             hottestidarr: hottestIdArr
  //           })
  //         },
  //         fail: function(res) {},
  //         complete: function(res) {},
  //       })
  //     },
  //     fail: function(res) {},
  //     complete: function(res) {},
  //   })


  // },
  vanTabsScroll: function() {

  },
  outTouristModel: function() { //退出游客模式
    app.globalData.touristmodel = 0
    wx.navigateTo({
      url: '../homePage/login/login'
    })


  }




})