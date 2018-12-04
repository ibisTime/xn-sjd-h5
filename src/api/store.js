import fetch from 'common/js/fetch';

// 获取商品分类
export function getShopType(config) {
  return fetch(629005, config);
}

// 获取全部商品
export function getAllShopData(config) {
  return fetch(629706, config);
}

// 获取商品详情
export function getShopDetail(code) {
  return fetch(629707, {
    code
  });
}

// 加入购物车
export function addShopCart(config) {
  return fetch(629710, config);
}

// 列表查我的购物车
export function myShopCart(userId) {
  return fetch(629715, {
    userId
  });
}

// 立即购买下单
export function buyItNow(config) {
  return fetch(629720, config);
}

// 详情查商铺订单（单店铺）
export function oneStoreOrder(code) {
  return fetch(629736, {
    code
  });
}

// 详情查商铺订单（多店铺）
export function moreStoreOrder(code) {
  return fetch(629726, {
    code
  });
}

// 分页查订单（多店铺）
export function morePageOrder(config) {
  return fetch(629725, config);
}

// 分页查订单（单店铺）
export function onePageOrder(config) {
  return fetch(629725, config);
}

// 支付订单（购物车下单支付）
export function payMoreOrder(config) {
  return fetch(629714, config);
}

// 支付订单（立即购买下单支付、订单支付）
export function payOneOrder(config) {
  return fetch(629721, config);
}

// 取消订单（多店铺）
export function removeMoreOrder(config) {
  return fetch(629722, config);
}

// 根据店铺删购物车
export function storeRemoveFn(shopCode) {
  return fetch(629712, {
    shopCode
  });
}

// 单件商品删除
export function shopRemoveFn(codeList) {
  return fetch(629711, {
    codeList
  });
}

// 查店铺信息
export function storeMsg(code) {
  return fetch(630307, {
    code
  });
}

// 购物车下单
export function shopCartOrder(config) {
  return fetch(629713, config);
}

// 修改地址
export function changeOrderRess(config) {
  return fetch(629800, config);
}

// 确认收货
export function affirmOrder(config) {
  return fetch(629724, config);
}

// 退款
export function refundMoney(config) {
  return fetch(629771, config);
}

// 退货
export function salesReturn(config) {
  return fetch(629770, config);
}

// 分页查消息
export function storeMessage(config) {
  return fetch(629785, config);
}

// 发送消息
export function sendMessage(config) {
  return fetch(629780, config);
}

// 阅读消息
export function readMessage(config) {
  return fetch(629782, config);
}

// 回复消息
export function replyMessage(config) {
  return fetch(629781, config);
}

/**
 * 获取当前订单积分抵扣金额
 * @param {string} code 订单编号
 * */
export function getStoreDeductible(code) {
  return fetch(629728, {
    code
  });
}

// 组合订单积分抵扣
export function getMoreDeductible(code) {
  return fetch(629717, {
    code
  });
}

// 发表评论
export function addACommemt(config) {
  return fetch(629730, config);
}

// 分页查评论
export function getCommemtData(config) {
  return fetch(629755, config);
}

// 查看物流
export function lookLogistics(config) {
  return fetch(629820, config);
}

// 是否存在未读消息
export function isThreeMsg(config) {
  return fetch(629788, config);
}

// 订单明细
export function orderDetail(config) {
  return fetch(629735, config);
}
