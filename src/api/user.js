import fetch from 'common/js/fetch';
import {getUserId} from 'common/js/util';

/**
 * 微信登录
 * @param {string} code
 * @param {string} userReferee
 * @param {string} mobile
 * @param {string} smsCaptcha
 */
export function wxLogin(data) {
  // code, userReferee, mobile, smsCaptcha, isNeedMobile
  alert(JSON.stringify(data));
  let params = {
    code: data.code,
    kind: 'C',
    type: 'wx_h5',
    mobile: data.mobile || '',
    smsCaptcha: data.smsCaptcha || '',
    isNeedMobile: data.isNeedMobile
  };
  if (data.userReferee) {
    params.userReferee = data.userReferee;
    params.userRefereeKind = 'C';
  }
  alert('params' + JSON.stringify(data));
  return fetch(805051, params);
}

/**
 * 获取用户详情
 */
export function getUser(userId) {
  return fetch(805121, {
    userId: userId || getUserId()
  });
}

/**
 * 获取用户详情
 * @param {string} userId
 */
export function getUserById(userId) {
  return fetch(805121, { userId });
}

/**
 * 分页获取用户
 * @param {string} start
 * @param {string} limit
 */
export function getPageChildren(start, limit) {
  return fetch(805120, {
    userReferee: getUserId(),
    start,
    limit
  });
}

/**
 * 绑定手机号
 * @param {string} mobile
 * @param {string} smsCaptcha
 * @param {string} isSendSms
 */
// export function bindMobile(mobile, smsCaptcha, isSendSms = '0') {
//   return fetch(805060, {
//     mobile,
//     smsCaptcha,
//     isSendSms,
//     userId: getUserId()
//   });
// }

/**
 * 设置支付密码
 * @param {string} tradePwd
 * @param {string} smsCaptcha
 */
export function setTradePwd(tradePwd, smsCaptcha) {
  return fetch(805066, {
    tradePwd,
    smsCaptcha,
    userId: getUserId()
  });
}

/**
 * 修改用户生日
 * @param {string} birthday
 */
export function changeBirthday (birthday) {
  return fetch(805096, {
    birthday,
    userId: getUserId()
  });
}

/**
 * 修改用户性别
 * @param {string} gender
 */
export function changeGender (gender) {
  return fetch(805097, {
    gender,
    userId: getUserId()
  });
}

/**
 * 新增收件地址
 * @param params {addressee, mobile, province, city, district, detailAddress, isDefault?}
 */
export function addAddress(params) {
  return fetch(805170, {
    userId: getUserId(),
    ...params
  });
}

/**
 * 删除收件地址
 * @param {string} code
 */
export function deleteAddress(code) {
  return fetch(805171, {code});
}

/**
 * 修改收件地址
 * @param  params {code, addressee, mobile, province, city, district, detailAddress, isDefault?}
 */
export function editAddress(params) {
  return fetch(805172, {
    userId: getUserId(),
    ...params
  });
}

/**
 * 设置默认收件地址
 * @param {string} code
 */
export function setDefaultAddress (code) {
  return fetch(805173, {code});
}

/**
 * 列表查询地址
 */
export function getAddressList() {
  return fetch(805175, {
    userId: getUserId()
  });
}

/**
 * 详情查询地址
 * @param {string} code
 */
export function getAddress(code) {
  return fetch(805176, {code});
}

/**
 * 签到查询
 * @param {string} location
 */
export function signQuery(location) {
  return fetch(805148, {
    location,
    userId: getUserId()
  });
}

/**
 * 签到
 * @param {string} location
 */
export function sign(location) {
  return fetch(805140, {
    location,
    userId: getUserId()
  });
}

/**
 * 签到天数
 * @param {string} start
 * @param {string} limit
 */
export function signNum(start, limit) {
  return fetch(805145, {
    start,
    limit,
    orderDir: 'desc',
    orderColumn: 'signDatetime',
    userId: getUserId()
  });
}

/**
 * 保存登录日志
 */
export function saveLoginLog () {
  return fetch(805350, {
    userId: getUserId()
  });
}

/**
 * 关注用户
 * @param {string} toUser
 */
export function followUser (toUser) {
  return fetch(805110, {
    toUser,
    userId: getUserId()
  });
}

/**
 * 取消关注用户
 * @param {string} toUser
 */
export function unFollowUser (toUser) {
  return fetch(805111, {
    toUser,
    userId: getUserId()
  });
}

/**
 * 是否关注
 * @param {string} toUser
 */
export function isFollowUser (toUser) {
  return fetch(805116, {
    toUser,
    userId: getUserId()
  });
}

/**
 * 分页查询关注
 * @param {string} start
 * @param {string} limit
 */
export function getPageFollowUsers (start, limit) {
  return fetch(805115, {
    start,
    limit,
    userId: getUserId()
  });
}

/**
 * 分页查询粉丝
 * @param {string} start
 * @param {string} limit
 */
export function getPageFans (start, limit) {
  return fetch(805115, {
    start,
    limit,
    toUser: getUserId()
  });
}

/**
 * 修改用户的个人简介
 * @param {string} introduce
 */
export function editIntroduce (introduce) {
  return fetch(805098, {
    introduce,
    userId: getUserId()
  });
}

/****************************************************************************************/
/**
 * 普通登录
 * @param {string} code
 * @param {string} userReferee
 */
export function login(data) {
  return fetch(805050, {
    loginName: data.loginName,
    loginPwd: data.loginPwd
  });
}

/**
 * 注册
 * @params  mobile
 * @params  loginPwd
 * @params  smsCaptcha
 * @params  userReferee
 * @params  userRefereeType
 * */
export function register(params) {
  return fetch(805041, params);
}

// 详情查用户
export function getUserDetail(data) {
  return fetch(805121, {
    ...data
  });
}

// 修改头像
export function changeAvatar(data) {
  return fetch(805080, {
    userId: getUserId(),
    ...data
  });
}
// 修改昵称
export function changeNickname(data) {
  return fetch(805082, {
    userId: getUserId(),
    ...data
  });
}
// 完善资料
export function completeInfo(data) {
  return fetch(805070, {
    userId: getUserId(),
    ...data
  });
}

/**
 * 分页查询用户间关系
 * @params  limit
 * @params  start
 * @params  userId
 * */
export function getPageUserRelationship(params) {
  return fetch(805157, {
    limit: 20,
    start: 1,
    userId: getUserId(),
    ...params
  });
}

/**
 * 查询我和他是否建立关联
 * @params  toUser
 * */
export function getHasRelationship(toUser) {
  return fetch(805156, {
    toUser,
    userId: getUserId(),
    type: '2'
  });
}

// 添加关系
export function addRelationship(toUser) {
  return fetch(805150, {
    toUser,
    userId: getUserId(),
    type: '2'
  });
}
// 接触关系
export function cancelRelationship(toUser) {
  return fetch(805151, {
    toUser,
    userId: getUserId(),
    type: '2'
  });
}

// 设置支付密码
export function setUserMonPaw(config) {
  return fetch(805066, {
    userId: getUserId(),
    ...config
  });
}

// 充值
export function userRecharge(config) {
  return fetch(802343, {
    userId: getUserId(),
    ...config
  });
}

/**
 * 修改手机号
 * @param {string} newMobile
 * @param {string} smsCaptcha
 */
export function changeMobile(newMobile, smsCaptcha) {
  return fetch(805061, {
    newMobile,
    smsCaptcha,
    userId: getUserId()
  });
}

// 重置密码
export function reSetPwd(data) {
  return fetch(805063, {
    ...data
  });
}

// 绑定邮箱
export function bindEmail(data) {
  return fetch(805086, {
    userId: getUserId(),
    ...data
  });
}

// 绑定手机号
export function bindMobile(data) {
  alert(getUserId());
  return fetch(805060, {
    userId: getUserId(),
    ...data
  });
}

// 个人认证
export function certification(config) {
  return fetch(805071, config);
}

// 企业认证
export function comCertification(config) {
  return fetch(805072, config);
}
