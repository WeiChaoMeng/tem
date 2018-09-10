// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      username:'',
      password:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取本地数据
    wx.getStorage({
      key: 'username',
      success: function (res) {
        console.log(res.data);
        that.setData({ username: res.data });
      }
    });
    wx.getStorage({
      key: 'password',
      success: function (res) {
        console.log(res.data);
        that.setData({ password: res.data });
      }
    });
  },  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },  

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value.password)
    if (e.detail.value.username.length == 0 ||
      e.detail.value.password.length == 0 ){
        wx.showModal({
          title: '提示',
          content: '用户名或密码不能为空'
        })
    }else{
      wx.setStorageSync('username', e.detail.value.username);
      wx.setStorageSync('password', e.detail.value.password);
      wx.request({
        url: '',
        data: {
          'username': e.detail.value.username,
          'password': e.detail.value.password
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: res => {
          if (res.data.message == 'success') {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          } else {
            wx.showModal({
              title: '输入错误',
              content: '用户名或密码错误',
            })
          }
        },
        fail: res => {
          wx.showModal({
            title: '输入错误',
            content: '用户名或密码错误'
          })
        }
      })
    }

  },
  formReset: function () {
    console.log('form发生了reset事件')
    wx.clearStorageSync();
  }
})