//index.js


//这页代码，能用，好用，可以维护，但是让我重写不如让我死！！！！！

var classification; //从上页面接受分类信息
var classification1;
var classification2 = 0,
  classification3 = 0,
  classification123 = 0;
var multiarray;
var goodsPage = 0,
  goodsMode = 0; //请求商品分页,搜索模式
var goodsList = new Array;
var app = getApp()


Page({
  data: {
    multiArray: multiarray,
    multiIndex: [0, 0],
    sortarray: ['综合排序', '最新发布', '最早发布', '价格降序', '价格升序', '新旧降序', '新旧升序'],
    sortindex: 0
  },
  //单列选择器值改变触发
  bindPickerChange: function(e) {
    var that = this;
    this.setData({
      sortindex: e.detail.value
    })
    //更待排序方式传值
    switch (this.data.sortarray[e.detail.value]) {
      case '综合排序':
        {
          goodsMode = 0;
          break;
        }
      case '最新发布':
        {
          goodsMode = 2;
          break;
        }
      case '最早发布':
        {
          // console.log("成")
          goodsMode = 3;
          break;
        }
      case '价格降序':
        {
          goodsMode = 4;
          break;
        }
      case '价格升序':
        {
          goodsMode = 5;
          break;
        }
      case '新旧降序':
        {
          goodsMode = 6;
          break;
        }
      case '新旧升序':
        {
          goodsMode = 7;
          break;
        }
    }
    //排序成功后，请求商品列表
    wx.request({
      url: 'https://theonlyobserver.cn/object/select.php',
      data: {
        e: goodsPage,
        d: classification123,
        m: goodsMode
      },
      success: function(res) {
        console.log('请求商品列表成功', res)
        goodsList = res.data.data
        console.log('当前商品列表：', goodsList)
        that.setData({
          'goodslist': goodsList
        })
      },
      complete: function(res) {
        console.log('请求商品列表完成', res)
      }
    })

  },

  //看不懂的千万不要乱改
  //分类筛选的多列选择器最终值改变时触发
  bindMultiPickerChange: function(e) {

    var that = this
    goodsPage = 0; //重置请求页数
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    console.log("筛选结果变更，最终传递的值可以是", this.data.multiArray[0][e.detail.value[0]], this.data.multiArray[1][e.detail.value[1]]) //这个数组我都能写明白我是真nb，但是其实我也看不太懂
    classification2 = e.detail.value[0]
    classification3 = e.detail.value[1]
    // console.log(classification)

    //压缩一二三级分类
    if (classification3 != 0) {
      classification123 = String(classification1 * 10000 + (classification2 + 100) * 10 + classification3)
    } else if (classification3 == 0 && classification2 != 0) {
      classification123 = String(classification1 * 1000 + (classification2 + 100))
    } else if (classification3 == 0 && classification2 == 0) {
      classification123 = String(classification1)
    } else {
      console.log('不应该有其他情况！！！一定是出问题了')
    }
    console.log('更改后，classification 1,2,3,123', classification1, classification2, classification3, classification123)
    console.log('更改后，classification123为', classification123)
    //分类完毕，请求商品列表
    wx.request({
      url: 'https://theonlyobserver.cn/object/select.php',
      data: {
        e: goodsPage,
        d: classification123,
        m: goodsMode
      },
      success: function(res) {
        console.log('请求商品列表成功', res)
        goodsList = res.data.data
        console.log('当前商品列表：', goodsList)
        that.setData({
          'goodslist': goodsList
        })
      },
      complete: function(res) {
        console.log('请求商品列表完成', res)
      }
    })



  },



  bindMultiPickerColumnChange: function(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;


    switch (classification) {
      case "1":
        {
          console.log("执行数码3C下详细分类")

          //////////////////////////////////////////////////////////////////////////
          switch (e.detail.column) {
            case 0:
              switch (data.multiIndex[0]) {
                case 0:
                  data.multiArray[1] = ['全部'];
                  break;
                case 1:
                  data.multiArray[1] = ['全部', '鼠标', '键盘', '显示器', '其他'];
                  break;
                case 2:
                  data.multiArray[1] = ['全部', '手机', '其他'];
                  break;
                case 3:
                  data.multiArray[1] = ['全部', '耳机相关', '单反相关', '其他'];
                  break;
              }
              data.multiIndex[1] = 0;
              break;
              console.log(data.multiIndex);
              break;
          }
          /////////////////////////////////////////////////////////////////
          break;
        }
      case "2":
        {
          console.log("执行生活洗护下详细分类")

          //////////////////////////////////////////////////////////////////////////
          switch (e.detail.column) {
            case 0:
              switch (data.multiIndex[0]) {
                case 0:
                  data.multiArray[1] = ['全部'];
                  break;
                case 1:
                  data.multiArray[1] = ['全部', '女装', '男装', '女鞋', '男鞋', '帽子/饰品', '其他'];
                  break;
                case 2:
                  data.multiArray[1] = ['全部', '化妆品', '洗护品', '其他'];
                  break;
                case 3:
                  data.multiArray[1] = ['全部', '桌椅', '宿舍神器', '其他'];
                  break;
                case 4:
                  data.multiArray[1] = ['全部', '运动户外', '健身器材', '其他'];
                  break;
                case 5:
                  data.multiArray[1] = ['全部', '方便食品', '饮料酒水', '其他'];
                  break;
              }
              data.multiIndex[1] = 0;
              break;
              console.log(data.multiIndex);
              break;
          }
          /////////////////////////////////////////////////////////////////



          break;
        }
      case "3":
        {
          console.log("执行学习文创下详细分类")


          //////////////////////////////////////////////////////////////////////////
          switch (e.detail.column) {
            case 0:
              switch (data.multiIndex[0]) {
                case 0:
                  data.multiArray[1] = ['全部'];
                  break;
                case 1:
                  data.multiArray[1] = ['全部', '四六级资料', '考研资料', '外语资料', '通用课本', '课外书籍', '其他'];
                  break;
                case 2:
                  data.multiArray[1] = ['全部', '纸/本', '笔袋里的东西', '其他'];
                  break;
              }
              data.multiIndex[1] = 0;
              break;
              console.log(data.multiIndex);
              break;
          }
          /////////////////////////////////////////////////////////////////

          break;
        }
      case "4":
        {
          console.log("执行专业器具下详细分类")
          //////////////////////////////////////////////////////////////////////////
          switch (e.detail.column) {
            case 0:
              switch (data.multiIndex[0]) {
                case 0:
                  data.multiArray[1] = ['全部'];
                  break;
                case 1:
                  data.multiArray[1] = ['全部'];
                  break;
                case 2:
                  data.multiArray[1] = ['全部'];
                  break;
                case 3:
                  data.multiArray[1] = ['全部'];
                  break;
                case 4:
                  data.multiArray[1] = ['全部'];
                  break;
                case 5:
                  data.multiArray[1] = ['全部'];
                  break;
                case 6:
                  data.multiArray[1] = ['全部'];
                  break;
                case 7:
                  data.multiArray[1] = ['全部'];
                  break;
                case 8:
                  data.multiArray[1] = ['全部'];
                  break;
                case 9:
                  data.multiArray[1] = ['全部'];
                  break;
                case 10:
                  data.multiArray[1] = ['全部'];
                  break;
              }
              data.multiIndex[1] = 0;
              break;
              console.log(data.multiIndex);
              break;
          }
          /////////////////////////////////////////////////////////////////
          break;
        }
      case "5":
        {
          console.log("执行其他服务下详细分类")

          //////////////////////////////////////////////////////////////////////////
          switch (e.detail.column) {
            case 0:
              switch (data.multiIndex[0]) {
                case 0:
                  data.multiArray[1] = ['全部'];
                  break;
                case 1:
                  data.multiArray[1] = ['全部'];
                  break;
                case 2:
                  data.multiArray[1] = ['全部'];
                  break;
                case 3:
                  data.multiArray[1] = ['全部'];
                  break;
              }
              data.multiIndex[1] = 0;
              break;
              console.log(data.multiIndex);
              break;
          }
          /////////////////////////////////////////////////////////////////
          break;
        }
    }


    this.setData(data);
  },
  onLoad: function(option) {
    this.setData({
      touristmodel: app.globalData.touristmodel
    })
    var that = this
    classification = option.id //获取主页面传来的大分类信息,1数码2生活3学习4专业
    console.log("所选分类为", classification)
    switch (classification) {
      case "1":
        {
          console.log("执行数码3C分类")
          multiarray = [
            ['全部', '电脑相关', '手机相关', '数码产品'],
            ['全部']
          ]
          this.setData({
            multiArray: multiarray
          })
          break;
        }
      case "2":
        {
          console.log("执行生活洗护分类")
          multiarray = [
            ['全部', '服饰相关', '化妆洗护', '寝室用品', '运动相关', '食品饮品'],
            ['全部']
          ]
          this.setData({
            multiArray: multiarray
          })
          break;
        }
      case "3":
        {
          console.log("执行学习文创分类")
          multiarray = [
            ['全部', '书籍资料', '文具相关'],
            ['全部']
          ]
          this.setData({
            multiArray: multiarray
          })
          break;
        }
      case "4":
        {
          console.log("执行专业器具分类")
          multiarray = [
            ['全部', '艺术设计', '服装设计', '机械工程', '轻工化学', '生物工程', '纺织材料', '信息科学', '食品', '管理', '外国语'],
            ['全部']
          ]
          this.setData({
            multiArray: multiarray
          })
          break;
        }
      case "5":
        {
          console.log("执行其他服务分类")
          multiarray = [
            ['全部', '虚拟商品', '招聘兼职', '项目/竞赛合伙'],
            ['全部']
          ]
          this.setData({
            multiArray: multiarray
          })
          break;
        }
    }

    //初始分类
    classification1 = Number(classification)
    console.log('初始时，classification 1,2,3,123', classification1, classification2, classification3, classification123)
    classification123 = String(classification1)
    console.log('初始时，最后传出分类值为', classification123)
    wx.request({
      url: 'https://theonlyobserver.cn/object/select.php',
      data: {
        e: goodsPage,
        d: classification123,
        m: goodsMode
      },
      success: function(res) {
        console.log('请求商品列表成功', res)
        goodsList = res.data.data
        that.setData({
          'goodslist': goodsList
        })

      },
      complete: function(res) {
        console.log('请求商品列表完成', res)
      }
    })

  },
  onReachBottom: function() {
    var that = this;
    console.log('触发上拉触底函数')
    goodsPage++; //请求页数+1
    //执行新商品页面请求
    wx.request({
      url: 'https://theonlyobserver.cn/object/select.php',
      data: {
        e: goodsPage,
        d: classification123,
        m: goodsMode
      },
      success: function(res) {
        console.log('请求商品列表成功', res)
        goodsList = goodsList.concat(res.data.data)
        console.log('当前商品列表：', goodsList)
        that.setData({
          'goodslist': goodsList
        })
      },
      complete: function(res) {
        console.log('请求商品列表完成', res)
      }
    })

  },
  outTouristModel: function() {
    app.globalData.touristmodel = 0
    wx.navigateTo({
      url: '../../homePage/login/login'
    })
  }
})