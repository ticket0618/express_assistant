
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 1,
    pageSize: 10,
    hasMoreData: true,
    contentList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("加载页面");
    let that = this;

    that.getContentInfo('正在加载数据...');
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
    console.log("刷新页面");
    let that = this;

    that.getContentInfo('正在加载数据...');
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
    console.log('下拉');
    wx.showNavigationBarLoading(); // 在标题栏中显示加载
    this.data.pageNo = 1;
    this.getContentInfo('正在刷新数据');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("上拉触底");
    if (this.data.hasMoreData) {
      this.getContentInfo('加载更多数据');
    } else {
      wx.showToast({
        title: '没有更多数据'
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getContentInfo: function (message) {
    wx.showLoading({
      title: message,
    });
    
    var that = this;

    wx.cloud.callFunction({
      name: 'findDeliverAgents',
      data: {
        pageNo: that.data.pageNo,
        pageSize: that.data.pageSize
      },
      success: res => {
        console.log("返回快递记录", res);
        var contentListTem = that.data.contentList;
        if (that.data.pageNo == 1) {
          contentListTem = [];
        }
        var contentList = res.result.list;
        for (var i = 0; i < contentList.length; i++) {
          var tmp = contentList[i];
          if (i % 2 == 0) {
            tmp.bg = '#FFFFFF';
          } else {
            tmp.bg = '#90EE90';
          }
        }
        if (that.data.pageNo >= res.result.pageCount) {
          that.setData({
            contentList: contentListTem.concat(contentList),
            hasMoreData: false
          })
        } else {
          that.setData({
            contentList: contentListTem.concat(contentList),
            hasMoreData: true,
            pageNo: that.data.pageNo + 1
          })
        }
      },
      fail: res => {
        console.log("加载数据失败");
        wx.showToast({
          title: '加载数据失败',
          icon: none
        });
      },
      complete: res => {
        console.log("加载数据完成");
        wx.hideLoading();
        wx.hideNavigationBarLoading(); // 完成停止加载
        wx.stopPullDownRefresh(); // 停止下拉刷新
      }
    });
  },

  // 长按
  longPress: function (e) {
    console.log("长按事件：", e);
    console.log("事件ID=%s", e.currentTarget.dataset.recordId);
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认要删除该快递记录？',
      showCancel: true,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定删除');
          wx.cloud.callFunction({
            name: 'removeDeliverAgent',
            data: {
              recordId: e.currentTarget.dataset.recordId
            },
            success: res => {
              console.log("删除记录成功", res);
              that.onLoad();
            },
            fail: res => {
              console.log("删除记录失败");
            },
            complete: res => {
              console.log("删除记录完成");
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消删除');
        }
      }
    });
  },

  showMap: function (e) {
    let latitude = e.currentTarget.dataset.recordLatitude;
    let longitude = e.currentTarget.dataset.recordLongitude;
    console.log("地理位置latitude=%s", latitude);
    console.log("地理位置longitude=%s", longitude);
    if (typeof (latitude) == "undefined" || null == latitude) {
      console.log("latitude undefined or null");
      return;
    }
    if (typeof (longitude) == "undefined" || null == longitude) {
      console.log("longitude undefined or null");
      return;
    }
    let pageUrl = '/pages/my/showmap?latitude=' + latitude + '&longitude=' + longitude;
    console.log("跳转页面=%s", pageUrl);
    wx.navigateTo({
      url: pageUrl
    });
  }

})