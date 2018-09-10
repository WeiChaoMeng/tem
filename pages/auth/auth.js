var app = getApp();
Page({
  data: {
    showFlag: true
  },
  handler: function (e) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userLocation'] &&
            res.authSetting['scope.camera'] &&
            res.authSetting['scope.writePhotosAlbum'] &&
          res.authSetting['scope.userInfo']) {
          
              //如果打开了地理位置，就会为true
              // 未授权，跳转到授权页面
              wx.reLaunch({
                url: '/pages/index/index',
              })
        }else{
          wx.showModal({
            title: '请完成授权',
            content: '完成相关授权使用程序',
          })
        }
      }
    })
  },



 
})