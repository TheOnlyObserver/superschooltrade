/**
 * 初始化全局参数
 * 
 */
var that, R, I, app, updataImgNum, isLoading;

/**
 * 设置：
 * 
 * @limitImg        图片上传限制
 * @photoSizeLimit  图片压缩程度
 */
var limitImg = 9;
var photoSizeLimit = 500;

/**
 * 图像处理类：
 * @class   IMG（e）
 * 
 * 成员：
 * @tempUrl
 * @size
 */ 
var IMG = function(e){
  this.tempUrl = e.path;
  this.size = e.size;
}
IMG.prototype.del = function(e){
  R.Oimg.splice(e,1);
};
IMG.prototype.compression = function (index) {
  var objectThat = this;
  wx.getImageInfo({
    src: objectThat.tempUrl,
    success: function (res) {
      var ctx = wx.createCanvasContext('photo_canvas');
      var towidth = photoSizeLimit;
      var toheight = Math.trunc(500 * res.height / res.width);
      that.setData({
        canvas_h: toheight
      }, function(){
        ctx.drawImage(objectThat.tempUrl, 0, 0, res.width, res.height, 0, 0, towidth, toheight);
        ctx.draw(false, setTimeout(function () {
          wx.canvasToTempFilePath({
            canvasId: 'photo_canvas',
            fileType: "jpg",
            success: function (res) {
              that.utilsFn.loading('图片压缩中' + (index - 1 + 2) + '/' + R.Oimg.length);
              objectThat.comUrl = res.tempFilePath;
              if (index >= R.Oimg.length - 1) {
                that.utilsFn.loading('全部图片压缩完毕');
                setTimeout(function () {
                  that.utilsFn.loading('正在上传图片');
                  R.Oimg[0].updata(0)
                }, 500);
                return !1
              };
              R.Oimg[index + 1].compression(index + 1);
            }
          }, that);
        }, 1000));
      })
    }
  })
};
IMG.prototype.updata = function(index){
  var objectThat = this;
  if (index <= R.Oimg.length-2 ){
    R.Oimg[index + 1].updata(index + 1); 
  }
  wx.uploadFile({
    url: 'https://theonlyobserver.cn/image/image.php',
    filePath: objectThat.comUrl,
    name: 'd',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    formData: {
      i: app.globalData.id,       // 用户id,
      p: app.globalData.session,  // "登陆凭证",
      m: "object"                 // "user或者时object"
    },
    success: function (res) {
      objectThat.postUrl=JSON.parse(res.data).data[0];
      updataImgNum++;
      that.utilsFn.loading('图片上传中' + updataImgNum + '/' + R.Oimg.length);
      if (updataImgNum >= R.Oimg.length){
        that.utilsFn.loading('全部图片上传完毕');
        setTimeout(function(){
          that.utilsFn.loading('正在上传商品信息');
          that.upDataObject();
        },200);
      }
    }
  })
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalAMultiArray: [
      [['电脑相关', '手机相关', '数码产品'], ['鼠标', '键盘', '显示器', '其他']],
      [['服饰相关', '化妆洗护', '寝室用品', '运动相关', '食品饮品'], ['女装', '男装', '女鞋', '男鞋', '帽子/饰品', '其他']],
      [['书籍资料', '文具相关'], ['四六级资料', '考研资料', '外语资料', '通用课本', '课外书籍', '其他']],
      [['艺术设计', '服装设计', '机械工程', '轻工化学', '生物工程', '纺织材料', '信息科学', '食品', '管理', '外国语'], ['其他']],
      [['虚拟商品', '招聘兼职', '项目/竞赛合伙'], ['其他']]
    ],
    totalMultiArray: [
      [['鼠标', '键盘', '显示器', '其他'], ['手机', '其他'], ['耳机相关', '单反相关', '其他']],
      [['女装', '男装', '女鞋', '男鞋', '帽子/饰品', '其他'], ['化妆品', '洗护品', '其他'], ['桌椅', '宿舍神器', '其他'], ['运动户外', '健身器材', '其他'], ['方便食品', '饮料酒水', '其他']],
      [['四六级资料', '考研资料', '外语资料', '通用课本', '课外书籍', '其他'], ['纸/本', '笔袋里的东西', '其他']],
      [['其他'], ['其他'], ['其他'], ['其他'], ['其他'], ['其他'], ['其他'], ['其他'], ['其他'], ['其他']],
      [['其他'], ['其他'], ['其他']]
    ],
    ifnewarray: ['全新', '99新', '95新', '9成新', '8成新', '7成新', '5成新', '能用', '不能用'],
    ifnewarraycode: [100, 99, 95, 90, 80, 70, 50, 40, 10],
    classification1array: ['数码3C', '生活洗护', '学习文创', '专业器具', '其他服务'],
    renderData: { classCode: { aClass: 0, bcClass: [0, 0], bcSsClass: [0, 0] }, multiArray: [], "new": 0, titleCount: 0, contentCount: 0, Oimg:[], x: 0, v: 0},
    inputData: { stat_a: 1, stat_b: 1011, "new": 100, price: 0, title: "", intro: { content: "", imgurl: []} },
    forceInputValue: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 上下文全局化及数据
    that = this; R = this.data.renderData; I = this.data.inputData;

    // 获取app
    app = getApp();

    // 超类渲染器x
    Object.defineProperty(R, 'x', {
      set: function (newValue) {
        //console.log(newValue, newValue ? R.classCode.bcSsClass : R.classCode.bcClass);
        that.setData({
          classification1index: R.classCode.aClass,
          multiArray: R.multiArray,
          multiIndex: newValue ? R.classCode.bcSsClass : R.classCode.bcClass,
          ifnewindex: R["new"],
          titleCount: R.titleCount,
          contentCount: R.contentCount
        });
      }
    })

    // 超类渲染器v
    Object.defineProperty(R, 'v', {
      set: function (newValue) {
        that.setData({
          tempfilepaths: that.utilsFn.getImgUrl(R.Oimg)
        });
      }
    })

    // 初始化渲染器
    this.classification1BindPickerChange({ detail: { value: 0 } }); R.v = 0;
  },

  // 库函数
  utilsFn: {

    // 获取图片路径信息
    getImgUrl: function (e, mod ="tempUrl") {
      let res = [];
      for (let i = 0; i < e.length; i++) {
        res.push(e[i][mod])
      }
      return res;
    },

    // 获取副分类标识符
    getStatb: function (a, b) {
      return ([, [Number(("" + arguments[0]).slice(0, 3).replace(/1/, "")), Number(("" + arguments[0]).slice(3))], Number("1" + (arguments[0] / Math.pow(10, 2)).toFixed(2).substr(2) + arguments[1])])[arguments.length]
    },

    // 加载动画
    loading: function(e){
      wx.showLoading({
        title: e,
        duration: 2000,
        mask: true
      })
    }
  },

  //新旧选择器触发
  ifnewBindPickerChange: function (e) {
    I["new"] = (that.data.ifnewarraycode)[e.detail.value];
    R["new"] = e.detail.value; R.x = 0;
  },

  // 主分类选择器触发
  classification1BindPickerChange: function (e) {
    R.classCode.aClass = e.detail.value;
    I.stat_a = Number(e.detail.value) + 1;
    R.multiArray = (that.data.totalAMultiArray)[e.detail.value]; 
    R.classCode.bcClass = [0, 0]; R.x = 0;
  },

  // 副分类选择器触发
  bindMultiPickerChange: function (e) {
    R.classCode.bcClass = e.detail.value;
    R.classCode.bcSsClass = e.detail.value.slice();
    I.stat_b = that.utilsFn.getStatb(e.detail.value[0] + 1, e.detail.value[1] + 1); R.x = 0;
  },

  // 副分类选择器列变动触发
  bindMultiPickerColumnChange: function (e) {
    R.classCode.bcSsClass[e.detail.column] = e.detail.value;
    if(!e.detail.column) {
      R.multiArray[1] = (that.data.totalMultiArray)[R.classCode.aClass][R.classCode.bcSsClass[0]];
      R.classCode.bcSsClass[1] = 0;
    }
    R.x = 1;
  },

  // 副分类选择器取消触发
  bindMultiPickerColumnCancel: function(){
    R.classCode.bcSsClass=[0, 0];
    R.multiArray[1] = that.data.totalMultiArray[R.classCode.aClass][R.classCode.bcClass[0]]; R.x = 0;
  },

  //价格输入响应
  inputedit: function (e) {
    I.price = e.detail.value;
  },

  //标题输入响应
  handleTitleInput: function (e) {
    I.title = e.detail.value;
    R.titleCount = e.detail.value.length; R.x = 0;
  },

  //描述输入响应
  handleContentInput: function (e) {
    I.intro.content = e.detail.value;
    R.contentCount = e.detail.value.length; R.x = 0;
  },

  // 最终提交
  addGoods: function(){
    if (!isLoading) {isLoading = true} else {return !1};
    if (!I.title || !I.price || !I.intro.content || !R.Oimg.length){
      wx.showToast({
        icon: "none",
        title: '请填好全部信息'
      })
      return !1;
    }
    updataImgNum = 0;
    R.Oimg[0].compression(0);
  },

  // 图片选择响应
  rechooseImages: function(){
    if (limitImg - R.Oimg.length <= 0) return !1;
    wx.chooseImage({
      count: limitImg - R.Oimg.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (e) {
        for (let i = 0; i < e.tempFiles.length; i++){
          R.Oimg.push(new IMG(e.tempFiles[i]));
        }
        R.v = 0;
      }
    })
  },

  // 手指按下(修复小程序同时响应bindtap与bindlogtap时的错误)
  handleTouchStart: function (e) {
    that.utilsFn.startTime = e.timeStamp;
  },

  // 手指离开(修复小程序同时响应bindtap与bindlogtap时的错误)
  handleTouchEnd: function (e) {
    that.utilsFn.endTime = e.timeStamp;
  },  

  // 强制聚焦文本域
  forceInput: function(e){
    this.setData({ forceInputValue: true });
  },

  // 图片删除
  delImg: function(e){
    R.Oimg[e.currentTarget.dataset.index].del(e.currentTarget.dataset.index); R.v = 0;
  },

  // 图片预览
  previewImg: function(e){
    if (that.utilsFn.endTime - that.utilsFn.startTime > 350) return !1; 
    let imgurl = that.utilsFn.getImgUrl(R.Oimg);
    wx.previewImage({
      current: imgurl[e.currentTarget.dataset.index], 
      urls: imgurl
    })
  },

  // 网络请求：上传商品
  upDataObject: function(){
    I.intro.imgurl = that.utilsFn.getImgUrl(R.Oimg, "postUrl");
    let postData={
      i: app.globalData.id,       // 用户id,
      p: app.globalData.session,  // "登陆凭证",
      d: JSON.stringify(I)
    };
    wx.request({
      url: 'https://theonlyobserver.cn/object/updataobject.php',
      data: postData,
      success: function (e) {
        wx.showToast({
          icon: "success",
          title: '商品上传成功'
        })
        setTimeout(wx.navigateBack,1000);
      }
    })
  }
})