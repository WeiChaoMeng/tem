//导入工具类
var util = require('../../utils/util.js');
// 引入SDK核心类
var bmap  = require('../../libs/bmap-wx.js');
// pages/put disease/diseaseUpload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    //用于回显的文件集合
    imageFilePaths:[],
    //所有下拉框默认为0

    //所属区域
    region:[],
    region_num:0,
    //道路名称
    road_name:[],
    road_name_num: 0,
    //设施类别
    facility_category:[],
    facility_category_num: 0,
    //病害描述
    disease_describe:[],
    disease_describe_num: 0,
    //病害地址
    disease_position: "",
    //病害量化
    disease_number:"1",
    //方向
    direction:[],
    direction_num: 0,
    //处理类型
    dispose_type:[],
   dispose_type_num: 0,
    //信息来源
    message_source: [],
    message_source_num: 0,
    //灯杆型材
    lamppost_profile:[],
    lamppost_profile_num: 0,
    //灯具型号
    lamp_model:[],
    lamp_model_num: 0,
    //光源
    light_source:[],
    light_source_num: 0,
    //采集时间
    collection_time: '',
    //采集人
    collector : '',
   //经度
    longitude: '',
    //纬度
    latitude:'',
    //备注
    remarks:"",
    //照片(上传照片后返回文件地址集合)
    picture: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;

    //获取时间
    that.setData({
      collection_time: util.formatTime(new Date()) ,
    });

    //获取上传人
    wx.getUserInfo({
      lang: 'zh_CN' ,
      success:res =>{
        var userInfo = res.userInfo;
        var nickName = userInfo.nickName;
        that.setData({
          collector: nickName
        })
      }
    })

    //获取地址。经纬度
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var BMap = new bmap.BMapWX({
          ak: '5k7prAGLGAowRD5mHn19kD7pSAvGw73R'
        });
        BMap.regeocoding({
          location: res.latitude + ',' + res.longitude,
          success: function (addressRes) {
            var location = addressRes.originalData.result.formatted_address;
            that.setData({
              disease_position: location,
              longitude: res.longitude,
              latitude: res.latitude
            })
          }
        })
      },
    })

    //获取所有下拉框的数据
    wx.request({
      url: 'http://192.168.1.103:8080/streetlightDisease/toAdd',
      header: {
        'content-type': 'application/json' // 默认值
      },
      dataType:'json',

      success: function (res) {
        if (res.data != null || res.data != ''){
          that.echoJsonArray(res.data);
        }else{
          wx.showModal({
            title: '获取数据失败',
            content: '获取相应数据失败',
          })
        }      
      },
      fail:res =>{
        wx.showModal({
          title: '获取数据失败',
          content: '请求服务器失败',
        })
      }
    })

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

  /**
   * 下拉框修改时改变
   */

  bindPickerChange:function(e){
    var that = this;
    var key_num = e.currentTarget.dataset.name;
    that.setData({
      [key_num]: e.detail.value
    })

    //判断下拉框是否为'道路名称'，如果是道路名称请求后台获取参数
    if (key_num == 'region_num' && that.data.region != [] ){
        wx.request({
          url: 'http://192.168.1.103:8080/streetlightDisease/getRoadName',
          method: 'GET',
          dataType:'json',
          header: {
            'content-type': 'application/json' // 默认值
          },
          data: { 'regionId': that.data.region[that.data.region_num].id },
          success: function (res) {
           
            var temArray = new Array();
            var resurce = res.data;
            if ( resurce.length != 0 ){
              for (var i = 0; i < resurce.length; i++) {
                var temObj = new Object();
                temObj.id = resurce[i].id;
                temObj.name = resurce[i].name;
                temArray.push(temObj);
              }
              that.setData({
                road_name: temArray
              })
            }
          },
          fail:function(res){
            wx.showModal({
              title: '获取信息失败',
              content: '获取街道信息失败',
            })
          }

        })
    }

  },

  /**
   * 预览图片
   */
  showPhoto:function(){
    var that = this;
    wx.chooseImage({
      count: 8, // 最多可以选择的图片张数，默认9
      // original 原图，compressed 压缩图，默认二者都有
      sizeType: ['original', 'compressed'],
      // album 从相册选图，camera 使用相机，默认二者都有
      sourceType: ['album', 'camera'],
      success: function (res) {
        // success
        console.log(res)
        that.setData({
            imageFilePaths: res.tempFilePaths
        })

        that.upimage(res.tempFilePaths);
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })

  },

  /**
   * form表单上传
   */
  formSubmit:function(e){
    var that = this;
    if (e.detail.value.collector.length == 0 
      || e.detail.value.disease_position.length == 0
      || e.detail.value.collection_time.length == 0  ){

      wx.showToast({

        title: '请填写病害信息',

        icon: 'loading',

        duration: 1500

      })
      setTimeout(function () {

        wx.hideToast()

      }, 2000)
    }else{
      var road_nameArray =  that.data.road_name ;
      if (road_nameArray.length != 0){
        wx.request({
          url: 'http://192.168.1.103:8080/streetlightDisease/add',
          method: 'GET',
          dataType:'json',
          data: {
            //这里是发送给服务器的参数（参数名：参数值） 
            'region':
              that.jsonToObj(that.data.region[that.data.region_num]).id,

            'roadName': 
              that.jsonToObj(that.data.road_name[that.data.road_name_num]).id,

            'facilityCategory':
              that.jsonToObj(that.data.facility_category[that.data.facility_category_num]).id,

            'diseaseDescribe': 
              that.jsonToObj(that.data.disease_describe[that.data.disease_describe_num]).id,

            'diseasePosition': 
            e.detail.value.disease_position ,

            'diseaseNumber': 
            e.detail.value.disease_number 	,

            'direction': 
              that.jsonToObj(that.data.direction[that.data.direction_num]) .id,

            'disposeType': 
              that.jsonToObj(that.data.dispose_type[that.data.dispose_type_num]).id,

            'messageSource': 
              that.jsonToObj(that.data.message_source[that.data.message_source_num]) .id,

            'lamppostProfile': 
              that.jsonToObj(that.data.lamppost_profile[that.data.lamppost_profile_num]).id,

            'lightSource': 
              that.jsonToObj(that.data.light_source[that.data.light_source_num]).id,

            'collectionTime': 
            e.detail.value.collection_time,

            'collector': 
            e.detail.value.collector,

            'lampModel':
             e.detail.value.lamp_model,

            'remarks': 
            e.detail.value.remarks,

            'longitude': 
            that.data.longitude,

            'latitude': 
            that.data.latitude,

            'picture': 
            that.data.picture
          },


          success: function (res) {
           
            if (res.data.message == 'success'){
                 wx.showModal({
                   title: '添加成功',
                   content: '病害添加成功',
                   success:function(res){
                     wx.reLaunch({
                       url: '/pages/index/index'
                     })
                   }
                 })
 
              }else{
                wx.showModal({
                  title: '添加失败',
                  content: '病害添加失败',
                }) 
              }
          },
          fail:res =>{
            wx.showModal({
              title: '上传信息失败',
              content: '服务器错误',
            })
          } 
        })
      }else{
        wx.showModal({
          title: '错误',
          content: '请完善病害信息',
        })
      }
    }
  },

  /**
   * 遍历每个图片后上传 
   */
  upimage: function (tempFilePaths){
    //回显后上传
    var that = this;
    var imagepaths = new Array();
    var uploadImgCount = 0;

    for (var i = 0, h = tempFilePaths.length; i < h; i++) {

      wx.uploadFile({
        url: '',
        filePath: tempFilePaths[i],
        name: 'uploadfile_ant',
        header: {
          "Content-Type": "multipart/form-data"
        },
        success: function (res) {
          uploadImgCount++;
          var data = JSON.parse(res.data);
          //服务器返回格式: { "Catalog": "testFolder", "FileName": "1.jpg", "Url": "https://test.com/1.jpg" }
          if (data.message == 'success') {
            imagepaths.push(data.iamgefilepaths);
            //循环最后一次修改data的值
            if( i + 1 == h ){
              that.setData({
                picture: imagepaths,
              })
            }
          } else {
            wx.showModal({
              title: '错误提示',
              content: '上传图片失败',
              showCancel: false,
              success: function (res) { }
            })
          }
        },
        fail: function (res) {
          wx.hideToast();
          wx.showModal({
            title: '错误提示',
            content: '上传图片失败',
            showCancel: false,
            success: function (res) { }
          })
        }
      })
    }

  },

  /**
   * 遍历下拉框的json
   */

  echoJsonArray: function (objArray){
    var that = this;
    //遍历json对象的每个key/value对,p为key
    for (var p in objArray) {
      var temArray = new Array();
      var subArray = objArray[p];
      var temPropertey = p;
      for (var i = 0; i < subArray.length;i++ ){
        var temjson = subArray[i];
        var temKey = p;
        var obj = new Object();
        obj.id = subArray[i].id;
        obj.name = subArray[i].name ;
        temArray.push(obj)
      }
      that.setData({
        [temPropertey]: temArray
      })
    }
  },

  jsonToObj:function(jsonStr){
    var obj = new Object();
    if (jsonStr != [] || jsonStr.length != 0){
      for(var k in jsonStr){
        if (k.indexOf('id') != -1){
          obj.id = jsonStr[k];
        }
      }
    }else{
      obj.id = "";
    }
    return obj;    
  }

})