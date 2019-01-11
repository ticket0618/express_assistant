
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
            tmp.bg = '#CCCCCC';
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
  }

})