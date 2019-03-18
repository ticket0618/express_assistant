
Page({

  /**
   * 页面的初始数据
   */
  data: {
    expressComCode: '',
    expressNum: '',
    contextList: [],
    errorMsg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var expComCode = options.expressComCode;
    var expNum = options.expressNum;
    console.log("expressComCode=%s, expressNum=%s", expComCode, expNum);
    var that = this;
    //that.setData({
      //expressComCode: expComCode,
      //expressNum: expNum
    //});
    
    var expApiUrl = "https://m.kuaidi100.com/query?type=" + expComCode + "&postid=" + expNum;
    console.log("快递100接口地址=%s", expApiUrl);
    
    wx.request({
      url: expApiUrl,
      success(res) {
        console.log("返回数据 ", res.data);
        var status = res.data.status;
        if (status == '200') {
          var dataList = res.data.data;
          //that.setData({
          //contextList: dataList
          //});
          dataList.forEach((item) => {
            item.subDate = item.time.substring(0, 10);
            item.subTime = item.time.substring(10, 19);
          });
          that.setData({
            contextList: dataList,
            errorMsg: ''
          });
        } else {
          console.log(res.data.message);
          that.setData({
            contextList: [],
            errorMsg: "运单号不存在或已过期"
          });
        }
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

  }
})