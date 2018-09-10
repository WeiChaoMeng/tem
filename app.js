//app.js
App({

  onLaunch: function () {
    var that = this;
    // 获取用户信息
    wx.getSetting({
     
      success: res => {
        if (res.authSetting['scope.userLocation'] ||
          res.authSetting['scope.camera'] ||
          res.authSetting['scope.writePhotosAlbum'] ) {
          
          wx.getLocation({
            altitude:true,
            success: res => {
              that.globalData.latitude = res.latitude,
              that.globalData.longitude = res.longitude
            },

            fail: res =>{
              wx.reLaunch({
                url: '../auth/auth',
              })
            }

          })
        }else{
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              wx.getLocation({
                altitude: true,
                success: res => {
                  that.globalData.latitude = res.latitude,
                  that.globalData.longitude = res.longitude
                }
              })
            },
            fail: res => {
              // 未授权，跳转到授权页面
              wx.reLaunch({
                url: '/pages/auth/auth',
              })
            },
          }),
          wx.authorize({
            scope: 'scope.camera',
            success() {
              //调用相机
            },
            fail: res => {
              // 未授权，跳转到授权页面
              wx.reLaunch({
                url: '/pages/auth/auth',
              })
            },
          }),
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              //调用相册
            },
            fail: res => {
              // 未授权，跳转到授权页面
              wx.reLaunch({
                url: '/pages/auth/auth',
              })
            },
          })
        }
      }
    })
  },
    //全局应用
  globalData: {
    latitude:null,
    longitude: null
  }
})

