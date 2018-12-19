// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const wxCtx = cloud.getWXContext();
    console.log("微信上下文环境：", wxCtx);
    console.log("上下文环境：", context);
    const { userInfo, expressComCode, expressNum, contactName, contactMobile, latitude,  longitude } = event;
    console.log('用户信息', userInfo);
    console.log('请求参数：expressComCode=%s, expressNum=%s, contactName=%s, contactMobile=%s, latitude=%s, longitude=%s', expressComCode, expressNum, contactName, contactMobile, latitude, longitude);

    const res = await cloud.callFunction({
      // 要调用的云函数名称
      name: 'findExpComByCode',
      // 传递给云函数的参数
      data: {
        expressComCode: expressComCode
      }
    });
    console.log("云函数调用云函数返回：", res);
    const expressCom = res.result.data[0];
    console.log("快递公司：", expressCom.name);
    return await db.collection('deliverAgent').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        expressComCode: expressComCode,
        expressComName: expressCom.name,
        expressNum: expressNum,
        contactName: contactName,
        contactMobile: contactMobile,
        paid: false,
        payFee: 0,
        openId: userInfo.openId,
        userInfo: userInfo,
        location: new db.Geo.Point(longitude, latitude),
        createTime: new Date()
      }
    })
  } catch (e) {
    console.error(e)
  }
}