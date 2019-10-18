//index.js
//获取应用实例
const app = getApp()
var sellerId, sellerData, goodsId, goodsData; //商品变量
var id, session;
let time = require('../../../utils/util.js');
// 获取当前时间戳
var timeStampNow = (Date.parse(new Date())) / 1000
var iflike = 0 //初始化点赞收藏标记为0
var ifsave = 0
var goodsDetailUtils = require("goodsDetailUtils.js");

function toast(title) {
  wx.showToast({
    title: title,
    icon: 'none',
    // image: '',
    duration: 1700,
    mask: false
  })
}

Page({
  data: {
    ifgoodslikesimgurl: '../../../images/goodsDetail_dianzan10.png',
    ifgoodssaveimgurl: '../../../images/goodsDetail_shoucang10.png'

  },
  onLoad: function(options) {
    this.setData({
      touristmodel: app.globalData.touristmodel
    })
    timeStampNow = (Date.parse(new Date())) / 1000
    var that = this
    //加载时接受商品信息和商户id
    goodsId = options.goodsid
    sellerId = options.sellerid
    console.log('goodsId:', goodsId, 'sellerId:', sellerId)
    //请求商户信息和商品信息
    //请求商户信息
    wx.request({
      url: 'https://theonlyobserver.cn/user/getuseropeninfo.php',
      data: {
        i: [sellerId]
      },
      success: function(res) {
        console.log('返回商户信息res.data.data[sellerId]:', res.data.data[sellerId])
        sellerData = res.data.data[sellerId]
        that.setData({
          sellerdata: sellerData,
          sellernickname: decodeURIComponent(sellerData.nick),
          sellerimgurl: decodeURIComponent(sellerData.img),
          sellerid: options.sellerid

        })
      }
    })
    //请求商品信息
    id = wx.getStorageSync('id')
    session = wx.getStorageSync('session')
    wx.request({
      url: 'https://theonlyobserver.cn/object/getobjectinfo.php',
      data: {
        o: goodsId,
        i: id,
        p: session
      },
      success: function(res) {
        console.log('商品信息请求成功res.data.data:', res.data.data)
        goodsData = res.data.data
        // console.log(goodsData.ssr.like[0])

        if ((timeStampNow - goodsData.time) / 86400 > 1) {
          that.setData({
            showtime: parseInt((timeStampNow - goodsData.time) / 86400) + '天'
          })
        } else if ((timeStampNow - goodsData.time) / 3600 > 1) {
          that.setData({
            showtime: parseInt((timeStampNow - goodsData.time) / 3600) + '小时'
          })
        } else if ((timeStampNow - goodsData.time) / 60 > 1) {
          that.setData({
            showtime: parseInt((timeStampNow - goodsData.time) / 60) + '分钟'
          })
        } else if ((timeStampNow - goodsData.time) > 1){
          that.setData({
            showtime: parseInt((timeStampNow - goodsData.time) ) + '秒'
          })
        }

        that.setData({ //更新商品信息
          goodstitle: goodsData.title,
          goodsprice: goodsData.price,
          goodsimages: goodsData.intro.imgurl,
          goodscontent: goodsData.intro.content,
          goodsifnew: goodsDetailUtils.ifNew(goodsData.new),
          goodslikes: goodsData.likes,
          goodssave: goodsData.save


        })

        wx.request({
          url: 'https://theonlyobserver.cn/user/getuserinfo.php',
          data: {
            i: app.globalData.id,
            p: app.globalData.session,
            m: 3
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: function(res) {
            console.log('获取个人收藏列表', res.data.data, '长度为', JSON.parse(res.data.data).length)
            //遍历自己收藏列表并与当前商品id比对
            for (var i = 0; i < JSON.parse(res.data.data).length; i++) {
              if (goodsId == JSON.parse(res.data.data)[i]) {
                console.log('已收藏过该商品')

                ifsave = 1
                that.setData({
                  ifgoodssaveimgurl: '../../../images/goodsDetail_shoucang11.png',
                  ifgoodssavecolor: 'ifgoodslikescolor'
                })
              }
            }
          }
        })

        //遍历点赞列表
        //如果用户自己id在点赞列表id中，则页面更新点赞样式
        for (var i = 0; i < goodsData.ssr.like.length; i++) {
          if (app.globalData.id == goodsData.ssr.like[i]) {
            console.log('已点赞过该商品')
            iflike = 1
            that.setData({
              ifgoodslikesimgurl: '../../../images/goodsDetail_dianzan11.png',
              ifgoodslikescolor: 'ifgoodslikescolor'
            })
          }
        }



      },
      fail: function() {
        wx.showToast({
          title: '商品信息获取失败',
          icon: 'none',
          duration: 1500,
          mask: false
        })
      }
    })








    //以上均为onload函数
  },
  //页面滚动式时，商品标题栏跟随滚动
  onPageScroll: function(e) {
    // console.log(e.scrollTop);
    var scrollDistance;
    if (e.scrollTop > 170) {
      scrollDistance = true;
    } else {
      scrollDistance = false;
    };
    this.setData({
      scrollDistance: scrollDistance
    })
  },

  reviewThisImage: function(event) {
    var index = event.currentTarget.dataset.index; //获取data-src
    var imgList = this.data.goodsimages; //获取data-list
    //图片预览
    wx.previewImage({
      current: imgList[index], // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表

    })

  },
  goodsLikes: function() { //点赞功能
    var that = this



    //如果iflike == 1在点赞列表id中

    if (iflike) {

      this.setData({
        ifgoodslikesimgurl: '../../../images/goodsDetail_dianzan10.png',
        ifgoodslikescolor: '',
        goodslikes: goodsData.likes - 1
      })
      //发起取消点赞请求
      wx.request({
        url: 'https://theonlyobserver.cn/object/like.php',
        data: {
          i: app.globalData.id,
          p: app.globalData.session,
          o: goodsId,
          m: 2
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          console.log('取消点赞请求发起成功', res)
          iflike = 0 //点赞计数取消
          goodsData.likes-- //当前赞数-1

            //则取消点赞样式
            that.setData({
              ifgoodslikesimgurl: '../../../images/goodsDetail_dianzan10.png',
              ifgoodslikescolor: '',
              goodslikes: goodsData.likes
            })

          toast('已取消点赞')

        }
      })
    } else if (!iflike) { //如果点赞之前没有点过赞

      //发送点赞请求
      wx.request({
        url: 'https://theonlyobserver.cn/object/like.php',
        data: {
          i: app.globalData.id,
          p: app.globalData.session,
          o: goodsId,
          m: '1'
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          console.log(res)
          console.log(app.globalData.id, app.globalData.session, goodsId)
          iflike = 1 //点赞计数为1
          goodsData.likes++ //当前赞数+1
            //增加点赞样式
            that.setData({
              ifgoodslikesimgurl: '../../../images/goodsDetail_dianzan11.png',
              ifgoodslikescolor: 'ifgoodslikescolor',
              goodslikes: goodsData.likes
            })
          toast('点赞+1')

        }
      })
    }







  },
  goodsSave: function() { //收藏功能
    console.log(app.globalData.id, app.globalData.session, goodsId)

    var that = this
    if (ifsave) { //已经点过收藏了，进入取消收藏模式
      wx.request({
        url: 'https://theonlyobserver.cn/object/save.php',
        data: {
          i: app.globalData.id,
          p: app.globalData.session,
          o: goodsId,
          m: 2
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          console.log(res)
          ifsave = 0
          goodsData.save--
            that.setData({
              ifgoodssaveimgurl: '../../../images/goodsDetail_shoucang10.png',
              ifgoodssavecolor: '',
              goodssave: goodsData.save
            })
          toast('已取消收藏')
        }
      })
    } else if (!ifsave) {
      wx.request({
        url: 'https://theonlyobserver.cn/object/save.php',
        data: {
          i: app.globalData.id,
          p: app.globalData.session,
          o: goodsId,
          m: 1
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          console.log(res)
          ifsave = 1
          goodsData.save++
            that.setData({
              ifgoodssaveimgurl: '../../../images/goodsDetail_shoucang11.png',
              ifgoodssavecolor: 'ifgoodslikescolor',
              goodssave: goodsData.save
            })
         toast('收藏+1')
        }
      })
    }

  },
  onUnload: function() {
    iflike = 0;
    ifsave = 0;
  },
  touristModel: function () {
    wx.showToast({
      title: '权限不足，功能受限',
      icon: 'none',
      duration: 1500,
    })
  },
  outTouristModel: function () {
    app.globalData.touristmodel = 0
    wx.navigateTo({
      url: '../../homePage/login/login'
    })
  }

})