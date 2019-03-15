// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'prd-2fa2a4'
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { OPENID, APPID, UNIONID } = cloud.getWXContext();
    console.log("当前登录用户：openid=%s", OPENID);
    const { recordId } = event;
    console.log("删除快递记录ID：recordId=%s", recordId);

    const deliverAgent = db.collection('deliverAgent');
    const result = await deliverAgent.where({
      _id: recordId,
      openId: OPENID
    }).update({
        data: {
          deleted: 1
        }
    });

    return result;
  } catch (e) {
    console.error(e);
  }
}