//index.js
const app = getApp()

// 获取数据库引用
//const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    expressComs: [],
    expressComIndexs: [],
    expressComCodes: [],
    expressComNames: [],
    expressComIndex: '',
    expressComCode: '',
    expressComName: '',
    expressNum: '',
    contactName: '',
    contactMobile: '',
    latitude: 0,
    longitude: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // db.collection('expressCom').get({
    //   success: function (res) {
    //     console.log(res.data);
    //   }
    // });
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log("地理位置：", res);
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    });

    wx.cloud.callFunction({
      name: 'findExpressCom',
      complete: res => {
        console.log("快递公司", res.result.data);
        var coms = res.result.data;
        var indexs = [];
        var codes = [];
        var names = [];
        for (var i = 0; i < coms.length; i++) {
          var com = coms[i];
          indexs[i] = i;
          codes[i] = com.code;
          names[i] = com.name;
        }
        var initIndex = 0;
        this.setData({
          expressComs: coms,
          expressComIndexs: indexs,
          expressComCodes: codes,
          expressComNames: names,
          expressComIndex: indexs[initIndex],
          expressComCode: codes[initIndex],
          expressComName: names[initIndex]
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

  bindExpressComChange: function (e) {
    var index = e.detail.value;
    var code = this.data.expressComCodes[index];
    var name = this.data.expressComNames[index];
    this.setData({
      expressComIndex: index,
      expressComCode: code,
      expressComName: name
    })
  },

  expressNumInput: function (e) {
    this.setData({
      expressNum: e.detail.value
    })
  },

  contactNameInput: function (e) {
    this.setData({
      contactName: e.detail.value
    })
  },

  contactMobileInput: function (e) {
    this.setData({
      contactMobile: e.detail.value
    })
  },

  saveDeliverAgent: function (e) {
    console.log("保存快递信息：", this.data);
    if (null == this.data.expressComCode || '' == this.data.expressComCode) {
      wx.showModal({
        title: '输入有误',
        content: '请选择快递公司',
        success(res) {
          if (res.confirm) {
          } else if (res.cancel) {
          }
        }
      });
      return;
    }
    if (null == this.data.expressNum || '' == this.data.expressNum) {
      wx.showModal({
        title: '输入有误',
        content: '请输入运单号',
        success(res) {
          if (res.confirm) {
          } else if (res.cancel) {
          }
        }
      })
      return;
    }
    wx.cloud.callFunction({
      name: 'addDeliverAgent',
      data: {
        expressComCode: this.data.expressComCode,
        expressNum: this.data.expressNum,
        contactName: this.data.contactName,
        contactMobile: this.data.contactMobile,
        latitude: this.data.latitude,
        longitude: this.data.longitude
      },
      complete: res => {
        console.log("保存快递完成", res);
      },
      success: res => {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        });
      },
      fail: err => {
        wx.showModal({
          title: '提交失败',
          content: '网络异常，请稍候再试！',
          success(res) {
            if (res.confirm) {
            } else if (res.cancel) {
            }
          }
        })
      }
    })
  }

})
