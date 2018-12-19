// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
  //const { expressComCode } = event;

  console.log("云函数事件：", event);
  const expressComCode = event.expressComCode;
  console.log("请求参数：expressComCode=", expressComCode);
  
  return db.collection('expressCom').where({
    code: expressComCode
  }).get();

}