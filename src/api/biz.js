import fetch from 'common/js/fetch';
import {getUserId} from 'common/js/util';

// 分页查询认养产品
export function getProductPage (data) {
  return fetch(629025, {
    start: 1,
    limit: 4,
    queryUserId: getUserId(),
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

// 签到
export function signIn (data) {
  return fetch(805140, {
    userId: getUserId(),
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

// 获取消息(分页查）
export function getMessagePage (data) {
  return fetch(805305, {
    start: 1,
    limit: 20,
    ...data
  });
}

// 获取消息（列表查）
export function getMessage (data) {
  return fetch(805306, {
    ...data
  });
}

// 详情查消息
export function getMessageDetail (data) {
  return fetch(805307, {
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
  if (type === '4') {
    bizCode = '629055';
  } else {
    if (type !== '0') {
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
 * 获取当前集体订单积分抵扣金额
 * @param {string} code 订单编号
 * */
// export function getOrganizeOrderScore(code) {
//   return fetch(629058, {
//     code
//   });
// }
/**
 * 列表查询认养权/列表查询用户的树
 * @params {string} status 状态(1待认养2认养中3已到期)
 * @params {string} userId 持有人
 * @params {string} categoryCode 分类编号
 * @params {string} productCode 产品编号
 * */
export function getListUserTree(params) {
  let data = {
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
 * 取消集体订单
 * @param {string} code
 * @param {string} remark
 * */
export function cancelGroupOrder(code, remark) {
  return fetch(629052, {
    code,
    remark,
    userId: getUserId()
  });
}

/**
 * 获取当前订单积分抵扣金额
 * @param {string} code 订单编号
 * */
// export function getDeductibleAmount(code) {
//   return fetch(629048, {
//     code
//   });
// }

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
export function GiveTpp({toUserId, adoptTreeCode, userId}) {
  return fetch(629360, {
    toUserId,
    adoptTreeCode,
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
    applyUserType: 'C',
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

// 文章点赞
export function getArticleDz(config) {
  return fetch(629810, config);
}

// 文章收藏
export function getArticleSc(config) {
  return fetch(629811, config);
}

// 文章是否收藏
export function isArticleSc(config) {
  return fetch(629348, config);
}

// 文章是否点赞
export function isArticleDz(config) {
  return fetch(629348, config);
}

// 分页查询我的收藏
export function myArticlePage() {
  return fetch(629349, {
    userId: getUserId()
  });
}

// 分页查礼物
export function getGiftPage(data) {
  return fetch(629325, {
    ...data
  });
}

// 详情查礼物
export function getGiftDetail(data) {
  return fetch(629326, {
    ...data
  });
}

// 认领礼物
export function getGift(data) {
  return fetch(629323, {
    claimer: getUserId(),
    ...data
  });
}

// 分页查养护记录
export function getMaintainRecordsPage(data) {
  return fetch(629635, {
    ...data
  });
}

// 分页查养护记录
export function getMaintainRecordsDetail(data) {
  return fetch(629636, {
    ...data
  });
}

// 列表查询道具使用记录
export function getPropsUsedRecordList(data) {
  return fetch(629527, {
    ...data
  });
}

// 列表查询快报
export function getBulletinList(data) {
  return fetch(805308, {
    ...data
  });
}

// 产品已认养名单（列表）
export function getAdoptList(data) {
  return fetch(629209, {
    ...data
  });
}

// 二期
// 分页查询预售产品
export function getBookingProPage(data) {
  return fetch(629415, {
    ...data
  });
}

// 详情查询预售产品
export function getBookingProDetail(data) {
  return fetch(629416, {
    ...data
  });
}

// 下单预售产品
export function placePreOrder(data) {
  return fetch(629420, {
    ...data
  });
}

// 详细查询预售订单
export function getPreOrderDetail(data) {
  return fetch(629426, {
    ...data
  });
}

// 详细查询寄售订单
export function getConOrderDetail(data) {
  return fetch(629476, {
    ...data
  });
}

// 取消预售订单
export function cancelPreOrder(data) {
  return fetch(629421, {
    ...data
  });
}

// 支付预售订单
export function payPreOrder(data) {
  return fetch(629422, {
    ...data
  });
}

// 分页查询预售订单
export function getPreOrderPage(start, limit, status, type) {
  let params = {
    start,
    limit,
    status,
    userId: getUserId()
  };
  return fetch(629425, {
    ...params
  });
}

// 分页查询原生资产
export function getOriginZichanPage(data) {
  return fetch(629435, {
    ...data
  });
}

// 分页查询原生资产
export function getOriginZichanDetail(data) {
  return fetch(629436, {
    ...data
  });
}

// 分页查询派生资产
export function getDeriveZichanPage(data) {
  return fetch(629455, {
    ...data
  });
}

// 详细查询派生资产
export function getDeriveZichanDetail(data) {
  return fetch(629456, {
    ...data
  });
}

// 定向转让
export function dingxiangjishou(data) {
  return fetch(629430, {
    ...data
  });
}

// 二维码转让
export function erweimajishou(data) {
  return fetch(629431, {
    ...data
  });
}

// 挂单寄售
export function guadanjishou(data) {
  return fetch(629432, {
    ...data
  });
}

// 填写收货地址(确认提货）
export function confirmTihuo(data) {
  return fetch(629433, {
    ...data
  });
}

// 认领挂单寄售
export function placeOrderGuadan(data) {
  return fetch(629444, {
    ...data
  });
}
// 认领二维码寄售
export function placeOrderErweima(data) {
  return fetch(629443, {
    ...data
  });
}
// 认领定向寄售
export function placeOrderDingxiang(data) {
  return fetch(629441, {
    ...data
  });
}

// 分页查寄售订单
export function getJishouOrderPage(start, limit, status, type) {
  let params = {
    start,
    limit,
    status,
    userId: getUserId()
  };
  return fetch(629475, {
    ...params
  });
}

// 详细查询订单
export function getJishouOrderDetail(data) {
  return fetch(629476, {
    ...data
  });
}

// 取消寄售订单
export function cancelConOrder(data) {
  return fetch(629470, {
    ...data
  });
}

// 支付寄售订单
export function payJishouOrder(data) {
  return fetch(629471, {
    ...data
  });
}

// 拒绝定向寄售
export function refuseDingxiangJishou(data) {
  return fetch(629442, {
    ...data
  });
}

// 撤销寄售
export function cancelDingxiangJishou(data) {
  return fetch(629440, {
    ...data
  });
}

// 列表查询我的寄售中
export function getMyConsignmentList(data) {
  return fetch(629458, {
    ...data
  });
}

// 列表查询品种
export function getVarietyList(data) {
  return fetch(629459, {
    ...data
  });
}

// 已预售人员名单
export function getBookingAlreadyList(data) {
  return fetch(629428, {
    ...data
  });
}

// 支付转增订单
export function zhifuzhuanzeng(data) {
  return fetch(629472, {
    ...data
  });
}

// 列表查询物流单
export function getWuliudanList(data) {
  return fetch(629467, {
    ...data
  });
}

// 确认收货
export function confirmShouhuo(data) {
  return fetch(629461, {
    ...data
  });
}

// 预售订单积分抵扣金额
// export function preOrderScore(data) {
//   return fetch(629429, {
//     ...data
//   });
// }

// 列表查弹幕
export function getDanmuList(data) {
  return fetch(629387, {
    ...data
  });
}

// 发送弹幕
export function sendDanmu(data) {
  return fetch(629384, {
    ...data
  });
}

// 分享
export function share(channel, content) {
  let params = {
    userId: getUserId(),
    channel,
    content
  };
  return fetch(629370, params);
}

// 阅读文章
export function readArticle(code) {
  return fetch(629812, {
    userId: getUserId(),
    code
  });
}

// 添加搜索历史
export function addSearchHistory(data) {
  return fetch(629650, {
    userId: getUserId(),
    ...data
  });
}

// 列表查询搜索历史
export function getSearchHistoryList(type) {
  return fetch(629657, {
    userId: getUserId(),
    type
  });
}

// 列表查询搜索历史
export function getProductAreaList(type) {
  return fetch(629028, {});
}

// 月份签到天数统计
export function monthSignCount(data) {
  return fetch(629906, {
    userId: getUserId(),
    ...data
  });
}

// 列表查询连续签到
export function getContinueSignList(data) {
  return fetch(805146, {
    userId: getUserId(),
    ...data
  });
}

// 列表查询认养产品品种
export function getPinzhongList() {
  return fetch(629029, {});
}

// 列表查询认养权树种
export function getAdoptVarietyList() {
  return fetch(629210, {});
}

// 列表查商品发货地/产地
export function getOriginDeliverList(placeType) {
  return fetch(629709, {
    placeType
  });
}

// 列表查公章
export function getCachet(config) {
  return fetch(629677, {
    ...config
  });
}

// 来访人落地
export function visit(code) {
  return fetch(629202, {
    code,
    visitorId: getUserId()
  });
}
