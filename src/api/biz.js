import fetch from 'common/js/fetch';
import {getUserId} from 'common/js/util';

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
// 分页查询认养产品的树
export function getProductTreePage (data) {
  return fetch(629035, {
    start: 1,
    limit: 5,
    ...data
  });
}
// 详情查询认养产品的树
export function getProductTreeDetail (data) {
  return fetch(629036, {
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

/**
 * 分页查询订单
 * @param {number} start
 * @param {number} limit
 * @param {string} status
 * @param {string} type 订单类型（1个人/2定向/3捐赠/4集体）
 * */
export function getPageOrders(start, limit, status, type) {
  let params = {
    start,
    limit,
    userId: getUserId()
  };
  let bizCode = '';

  if (status.constructor === Array) {
    params.statusList = status;
  } else {
    params.status = status;
  }
  // 集体订单
  if (type === 4) {
    bizCode = '629055';
  } else {
    if (type !== 0) {
      params.type = type;
    }
    bizCode = '629045';
  }
  return fetch(bizCode, params);
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

/**
 * 列表查询认养权/列表查询用户的树
 * @params {string} status 状态(1待认养2认养中3已到期)
 * @params {string} userId 持有人
 * @params {string} categoryCode 分类编号
 * @params {string} productCode 产品编号
 * */
export function getListUserTree(params) {
  let data = {
    status: '2',
    currentHolder: getUserId(),
    ...params
  };
  return fetch(629207, data);
}

/**
 * 分页查询认养权/分页查询用户的树
 * @params {string} status 状态(1待认养2认养中3已到期)
 * @params {string} userId 持有人
 * @params {string} categoryCode 分类编号
 * @params {string} productCode 产品编号
 * */
export function getPageUserTree(params) {
  let data = {
    limit: 20,
    start: 1,
    status: '2',
    currentHolder: getUserId(),
    ...params
  };
  return fetch(629205, data);
}

// 详情查询认养权
export function getUserTreeDetail(code) {
  return fetch(629206, {
    code
  });
}

/**
 * 取消订单
 * @param {string} code
 * @param {string} remark
 * */
export function cancelOrder(code, remark) {
  return fetch(629041, {
    code,
    remark,
    userId: getUserId()
  });
}

/**
 * 获取当前订单积分抵扣金额
 * @param {string} code 订单编号
 * */
export function getDeductibleAmount(code) {
  return fetch(629048, {
    code
  });
}

/**
 * 本周能量比拼
 * @param {string} toUserId
 * */
export function getComparison(toUserId) {
  return fetch(629900, {
    toUserId,
    userId: getUserId()
  });
}

/**
 * 分页查询碳泡泡
 * @params {string} status （0待收取、1已收完、2已过期）
 * */
export function getPageTpp(params) {
  return fetch(629355, {
    limit: 5,
    start: 1,
    status: 0,
    ...params
  });
}

/**
 * 赠送碳泡泡
 * @params {string} toUserId
 * */
export function GiveTpp({toUserId, userId}) {
  return fetch(629360, {
    toUserId,
    userId: userId || getUserId()
  });
}

/**
 * 收取碳泡泡
 * @params {string} status （0待收取、1已收完、2已过期）
 * */
export function collectionTpp({code, userId}) {
  return fetch(629350, {
    code,
    userId: userId || getUserId()
  });
}

// 列表查支付渠道
export function paymentType() {
  return fetch(802116);
}

// 申请提现
export function payApplyFor(config) {
  return fetch(802350, {
    applyUser: getUserId(),
    ...config
  });
}

// 列表查询用户账户
export function userAccount() {
  return fetch(802301, {
    userId: getUserId()
  });
}
/**
 * 分页查询日志
 * @params {string} type  类型 biz_log_type:（1赠送碳泡泡/2留言/3收取碳泡泡）
 * @params {string} adoptTreeCode 认养权编号
 * @params {string} adoptUserId 认养人编号
 * */
export function getPageJournal(params) {
  return fetch(629305, {
    limit: 20,
    start: 1,
    ...params
  });
}

/**
 * 赠送树
 * @params {string} code 认养权编号
 * @params {number} toMobile 赠送对象手机号
 * */
export function GiveTree({code, toMobile}) {
  return fetch(629200, {
    code,
    toMobile,
    userId: getUserId()
  });
}

/**
 * 分页查询道具
 * @params {string} type  类型（0保护罩/1一件收取)
 * @params {string} status （0上架/1下架）
 * */
export function getPageProps(params) {
  return fetch(629305, {
    limit: 20,
    start: 1,
    ...params
  });
}

/**
 * 列表查询道具
 * @params {string} type  类型（0保护罩/1一件收取)
 * @params {string} status （0上架/1下架）
 * */
export function getListProps(params) {
  return fetch(629507, {
    ...params
  });
}

/**
 * 购买道具
 * @params {string} toolCode  道具编号
 * */
export function buyProps(toolCode) {
  return fetch(629510, {
    toolCode,
    userId: getUserId()
  });
}

/**
 * 使用道具
 * @params {string} toolOrderCode  道具订单编号
 * @params {string} adoptTreeCode 认养权编号
 * */
export function useProps({toolOrderCode, adoptTreeCode}) {
  return fetch(629511, {
    toolOrderCode,
    adoptTreeCode,
    userId: getUserId()
  });
}

// 列表查询道具购买订单
export function getPropsOrder(data) {
  return fetch(629517, {
    userId: getUserId(),
    ...data
  });
}

// 查询用户公司信息
export function getCompany(data) {
  return fetch(630068, {
    ...data
  });
}

// 新增文章
export function addArticle(data) {
  return fetch(629340, {
    ...data
  });
}

// 分页查文章
export function getArticlePage(data) {
  return fetch(629345, {
    ...data
  });
}

// 详情查文章
export function getArticleDetail(data) {
  return fetch(629346, {
    ...data
  });
}
