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

// 分页查评论
export function getCommemtData(config) {
  return fetch(629755, config);
}

