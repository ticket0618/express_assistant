// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  let pageNo = 1;
  let pageSize = 10;
  if (typeof (event.pageNo) != "undefined") {
    pageNo = event.pageNo;
  }
  if (typeof (event.pageSize) != "undefined") {
    pageSize = event.pageSize;
  }
  console.log("查询快递记录请求参数：pageNo=%s, pageSize=%s", pageNo, pageSize);
  if (typeof(pageNo) == "undefined" || null == pageNo || pageNo < 1) {
    pageNo = 1;
  }
  if (typeof (pageSize) == "undefined" || null == pageSize || pageSize < 1) {
    pageSize = 10;
  }
  const offset = (pageNo - 1) * pageSize;
  console.log("查询快递记录处理参数：pageNo=%s, pageSize=%s, offset=%s", pageNo, pageSize, offset);
  const deliverAgent = db.collection('deliverAgent');
  const list = await deliverAgent.skip(offset).limit(pageSize).orderBy('createTime', 'desc').get();
  return list;
}