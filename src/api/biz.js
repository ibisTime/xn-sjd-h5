import fetch from 'common/js/fetch';
// import {getUserId, formatDate} from 'common/js/util';

// 分页查询认养产品
export function getProductPage (data) {
  return fetch(629025, {
    start: 1,
    limit: 5,
    ...data
  });
}
// 详情查询认养产品
export function getProductDetail (data) {
  return fetch(629026, {
    ...data
  });
}

// 列表查产品分类
export function getProductType (data) {
  return fetch(629007, {
    ...data
  });
}

// 下单认养订单
export function placeOrder (data) {
  return fetch(629040, {
    ...data
  });
}

// 下单认养订单
export function signIn (data) {
  return fetch(805140, {
    ...data
  });
}

// 根据用户编号查询账户列表（front）
export function getAccount (data) {
  return fetch(802300, {
    start: 1,
    limit: 10,
    ...data
  });
}

// 详情查非集体订单
export function getOrderDetail (data) {
  return fetch(629046, {
    ...data
  });
}

// 详情查集体订单
export function getOrganizeOrderDetail (data) {
  return fetch(629056, {
    ...data
  });
}

// 支付非集体订单
export function payOrder (data) {
  return fetch(629042, {
    ...data
  });
}

// 支付集体订单
export function payOrganizeOrder (data) {
  return fetch(629053, {
    ...data
  });
}

// 分页查认养权
export function adoptionRightPage (data) {
  return fetch(629205, {
    ...data
  });
}

// 第一人下单集体认养订单
export function recognizeOrderFirst (data) {
  return fetch(629050, {
    ...data
  });
}

// 第一人下单集体认养订单
export function recognizeOrder (data) {
  return fetch(629051, {
    ...data
  });
}

// 获取消息
export function getMessage (data) {
  return fetch(805306, {
    ...data
  });
}

// 分页查集体认养订单
export function getGroupOrderList (data) {
  return fetch(629055, {
    ...data
  });
}

