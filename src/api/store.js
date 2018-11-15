import fetch from 'common/js/fetch';

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
  return fetch(629712, {
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

// 支付订单（多店铺）
export function payMoreOrder(config) {
  return fetch(629721, config);
}

// 根据店铺删购物车
export function storeRemoveFn(shopCode) {
  return fetch(629714, {
    shopCode
  });
}

// 购物车下单
export function shopCartOrder(config) {
  return fetch(629713, config);
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

// 分页查评论
export function getCommemtData(config) {
  return fetch(629755, config);
}

