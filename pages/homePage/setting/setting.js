var id, session
var userInfo //用户信息
var app = getApp()
// var userData //用户数据 
function toast(text) {
  wx.showToast({
    title: text,
    icon: 'none',
    duration: 1500,
    mask: false
  })
}

Page({

  data: {
    imgurl: "",
    nickName: '无名英雄',
    gender: "3"
  },
  onLoad: function(options) {
    var that = this
    wx.getStorage({
      key: 'id',
      success: function(res) {
        console.log("设置界面获取到本地存储id", res.data)
        id = res.data
      }
    })
    wx.getStorage({
      key: 'session',
      success: function(res) {
        console.log("设置界面获取到本地存储session", res.data)
        session = res.data
      }
    })

    wx.getStorage({
      key: 'userData',
      success: function(userData) {
        console.log("【设置界面】【加载时】获取到本地存储【服务器用户数据】", userData)
        that.setData({
          nickName: decodeURIComponent(userData.data.data.data.data.nick),
          imgurl: decodeURIComponent(userData.data.data.data.data.img),
          gender: userData.data.data.data.data.gender,
          persionalSign: userData.data.data.data.data.sign
        })
      }
    })




  },
  onUnload: function() {

  },


  //更新头像
  imgUpdata: function() {
    var that = this
    var newimgurl
    //选择图片  
    ////////////////////////////////////////////////////////////////////////////////////////

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function(photo) {
        console.log(photo.tempFilePaths[0])
        wx.getImageInfo({
          src: photo.tempFilePaths[0],
          success: function(res) {
            var ctx = wx.createCanvasContext('photo_canvas');
            //设置canvas尺寸
            console.log(res.height)
            console.log(res.width)
            var towidth = 250; //按宽度344px的比例压缩
            var toheight = Math.trunc(250 * res.height / res.width);
            that.setData({
              canvas_h: toheight
            })
            console.log('后第', '次:', photo.tempFilePaths[0], 0, 0, res.width, res.height, 0, 0, towidth, toheight)
            ctx.drawImage(photo.tempFilePaths[0], 0, 0, res.width, res.height, 0, 0, towidth, toheight)
            ctx.draw(false, setTimeout(function() {
              toast('头像压缩中')
              wx.canvasToTempFilePath({
                canvasId: 'photo_canvas',
                fileType: "jpg",
                success: function(res) {
                  console.log(res.tempFilePath)
                  that.setData({
                    testimg: res.tempFilePath
                  })
                  wx.uploadFile({
                    url: 'https://theonlyobserver.cn/image/image.php',
                    filePath: res.tempFilePath,
                    name: 'd',
                    formData: {
                      i: id, // 用户id,
                      p: session, // "登陆凭证",
                      m: "user" // "user或者时object"
                    },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function(res) {

                      console.log(res)
                      console.log('大概成功上传图片了', res)
                      newimgurl = JSON.parse(res.data).data[0]
                      console.log('新图片路径为', JSON.parse(res.data).data[0])
                      //上传新头像

                      wx.request({
                        url: 'https://theonlyobserver.cn/user/updatauserinfo.php',
                        data: {
                          i: id,
                          p: session,
                          d: JSON.stringify({
                            'img': newimgurl
                          })
                        },
                        header: {
                          'content-type': 'application/x-www-form-urlencoded'
                        },
                        method: 'POST',
                        dataType: 'json',
                        responseType: 'text',
                        success: function(res) {
                          console.log('新头像上传成功', res)
                          //新头像上传成功，重新获取用户数据并存储
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

                              //重新获取用户信息成功，将其存至本地
                              wx.setStorage({
                                key: 'userData',
                                data: userdata,
                                success: function() {
                                  toast('新头像已上传')

                                  console.log('获取用户信息并至本地，本地userData为', userdata)
                                  //更新头像
                                  that.setData({
                                    //.data数量有点随缘？
                                    //当场返回的只要3个data
                                    //从本地提userData就要4个data
                                    imgurl: decodeURIComponent(userdata.data.data.data.img)
                                  })
                                },
                                fail: function() {},
                                complete: function() {},
                              })
                            },
                            fail: function() {},
                            complete: function() {},
                          })


                        },
                        fail: function(res) {},
                        complete: function(res) {},
                      })
                    }
                  })
                }
              }, this)
            }, 1000))
          }
        })
      }
    })

    ////////////////////////////////////////////////////////////////////////////////////








    //   }
    // })



  },

  nickNameUpdata: function(e) {
    // var tmpuserdata

    wx.getStorage({
      key: 'userData',
      success: function(tmpuserdata) {
        if (decodeURIComponent(tmpuserdata.data.data.data.data.nick) == e.detail.value) {
          console.log('相等，不变，不上传')
        } else {
          console.log('不一致，二者值为', decodeURIComponent(tmpuserdata.data.data.data.data.nick), e.detail.value)
          //用户名有改动，上传新用户名
          wx.request({
            url: 'https://theonlyobserver.cn/user/updatauserinfo.php',
            data: {
              i: id,
              p: session,
              d: JSON.stringify({
                'nick': e.detail.value
              })
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: function(res) {
              console.log('新用户名上传成功', res)
              //用户名上传成功，重新获取用户数据并存储
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

                  //重新获取用户信息成功，将其存至本地
                  wx.setStorage({
                    key: 'userData',
                    data: userdata,
                    success: function() {
                      console.log('获取用户信息成功并存至本地', userdata)
                    },
                    fail: function() {},
                    complete: function() {},
                  })
                },
                fail: function() {},
                complete: function() {},
              })


            },
            fail: function(res) {},
            complete: function(res) {},
          })


        }



      },
      fail: function(res) {
        console.log('失败', res)
      },
      complete: function(res) {},
    })
    // console.log('tmp',tmpuserdata)
    //此userData为本地存储所以多一个data,即d.d.d.d




  },
  genderUpdata: function(e) {
    wx.getStorage({
      key: 'userData',
      success: function(tmpuserdata) {
        if (decodeURIComponent(tmpuserdata.data.data.data.data.gender) == e.detail.value) {
          console.log('相等，不变，不上传')
        } else {
          console.log('不一致，性别改动前后值为', decodeURIComponent(tmpuserdata.data.data.data.data.gender), e.detail.value)
          //性别有改动，上传新性别
          wx.request({
            url: 'https://theonlyobserver.cn/user/updatauserinfo.php',
            data: {
              i: id,
              p: session,
              d: JSON.stringify({
                'gender': e.detail.value
              })
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: function(res) {
              console.log('新性别上传成功', res)
              //用户名上传成功，重新获取用户数据并存储
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
                  //重新获取用户信息成功，将其存至本地
                  wx.setStorage({
                    key: 'userData',
                    data: userdata,
                    success: function() {
                      console.log('重新获取用户信息成功，将其存至本地', userdata)
                    },
                    fail: function() {},
                    complete: function() {},
                  })
                },
                fail: function() {},
                complete: function() {},
              })


            },
            fail: function(res) {},
            complete: function(res) {},
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })

  },
  textArea: function(e) {
    if (e.detail.value.length == 50) toast('签名长度最多50字')
  },
  persionalSignUpdata: function(e) {
    wx.request({
      url: 'https://theonlyobserver.cn/user/updatauserinfo.php',
      data: {
        i: app.globalData.id,
        p: app.globalData.session,
        d: JSON.stringify({
          'sign': e.detail.value
        })
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log('新个人签名上传成功', res)
        //用户名上传成功，重新获取用户数据并存储
        wx.request({
          url: 'https://theonlyobserver.cn/user/getuserinfo.php',
          data: {
            'i': app.globalData.id,
            'p': app.globalData.session
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: function(userdata) {

            //重新获取用户信息成功，将其存至本地
            wx.setStorage({
              key: 'userData',
              data: userdata,
              success: function() {
                console.log('获取用户信息成功并存至本地', userdata)
              },
              fail: function() {},
              complete: function() {},
            })
          },
          fail: function() {},
          complete: function() {},
        })


      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  logout: function() {
    app.socket.conn.close()
    wx.clearStorage({
      success: function() {
        wx.showToast({
          title: '账号已退出',
          // icon: '',
          // image: '',
          duration: 1700,
          mask: true,
          success: function(res) {
            wx.redirectTo({
              url: '../login/login',
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })

          },
          fail: function(res) {},
          complete: function(res) {}
        })
      }
    })
  }

})