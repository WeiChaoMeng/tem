//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    longitude:"",
    latitude:"",

  },

  onLoad: function () {
    var that =this;
    if (app.globalData.latitude == null || app.globalData.longitude == null ){
      wx.getLocation({
        altitude: true,
        success: res => {
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude
          })
        }
      })
    }else{
      that.setData({
        latitude: app.globalData.latitude,
        longitude: app.globalData.longitude
      })
    }

  },

  //点击路灯病害时或直接拍摄或在手机选择
  shootPhoto: function () {
    var _that = this

    wx.navigateTo({
      url: '/pages/put_disease/diseaseUpload?id=1',
    })

  },

  //点击病害维修跳转页面
  maintainLamps:function(){
    var _that = this

    wx.navigateTo({
      url: '/pages/disease_lamp/disease_lamp?id=1',
    })
  }
})


