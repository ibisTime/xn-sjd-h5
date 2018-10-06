import fetch from 'common/js/fetch';
import {SYSTEM_CODE} from 'common/js/config';

// 获取微信sdk初始化的参数
export function getInitWXSDKConfig() {
  return fetch(805952, {
    url: location.href.split('#')[0]
  });
}

// 根据type分页查系统参数
export function getSystemConfigPage(pType) {
  return fetch(630045, {
    start: 1,
    limit: 10,
    type: pType
  });
}

// 根据ckey获取系统参数
export function getSystemConfigCkey(ckey) {
  if (getSystemConfigCkey[ckey]) {
    return Promise.resolve(getSystemConfigCkey[ckey]);
  }
  return fetch(630047, {
    ckey
  }).then((data) => {
    getSystemConfigCkey[ckey] = data;
    return Promise.resolve(data);
  });
}

// 根据type获取系统参数
export function getSystemConfigType(ckey) {
  if (getSystemConfigType[ckey]) {
    return Promise.resolve(getSystemConfigType[ckey]);
  }
  return fetch(630048, {
    type: ckey
  }).then((data) => {
    getSystemConfigCkey[ckey] = data;
    return Promise.resolve(data);
  });
}

// 获取用户的系统参数
export function getUserSystemConfig(ckey) {
  if (getUserSystemConfig[ckey]) {
    return Promise.resolve(getUserSystemConfig[ckey]);
  }
  return fetch(630047, {
    ckey
  }).then((data) => {
    getUserSystemConfig[ckey] = data;
    return Promise.resolve(data);
  });
}

// 分页获取业务的系统参数
export function getPageBizSysConfig(type) {
  if (type && getPageBizSysConfig[type]) {
    return Promise.resolve(getPageBizSysConfig[type]);
  } else if (!type && getPageBizSysConfig.__cache__) {
    return Promise.resolve(getPageBizSysConfig.__cache__);
  }
  return fetch(620915, {
    type,
    start: 1,
    limit: 100
  }).then((data) => {
    getPageBizSysConfig[type] = data;
    return Promise.resolve(data);
  });
}

// 分页查询账户的系统参数
export function getPageAccountSysConfig(type) {
  if (type && getPageAccountSysConfig[type]) {
    return Promise.resolve(getPageAccountSysConfig[type]);
  } else if (!type && getPageAccountSysConfig.__cache__) {
    return Promise.resolve(getPageAccountSysConfig.__cache__);
  }
  return fetch(802025, {
    type,
    start: 1,
    limit: 100
  }).then((data) => {
    getPageBizSysConfig[type] = data;
    return Promise.resolve(data);
  });
}

// 获取appId
export function getAppId() {
  return getUserSystemConfig('WX_H5_ACCESS_KEY');
}

// 获取banner
export function getBannerList() {
  return fetch(805806, {
    type: 2,
    belong: 0
  });
}

// 分页查询系统公告
export function getPageSysNotices(start, limit) {
  return fetch(804040, {
    start,
    limit,
    pushType: 41,
    toKind: 'C',
    channelType: 4,
    status: 1,
    fromSystemCode: SYSTEM_CODE
  });
}

// 获取圈子图片、积分规则
export function getTradeIconRule(key) {
  return fetch(808917, {
    key
  });
}

/****************************************************************************/

// 发送验证码
export function sendCaptcha(data) {
  return fetch(630090, {
    bizType: data.bizType,
    mobile: data.mobile
  });
}

// 系统参数
export function getConfig(ckey) {
  return fetch(630047, {
    ckey: ckey
  });
}

// 获取banner
export function getBanner() {
  return fetch(630506, {});
}

// 列表查寻数据字典
export function getDictList(parentKey) {
  if (getDictList[parentKey]) {
    return Promise.resolve(getDictList[parentKey]);
  }
  return fetch(630036, {
    parentKey
  }).then((data) => {
    getDictList[parentKey] = data;
    return Promise.resolve(data);
  });
}
// 获取七牛token
export function getQiniuToken() {
  return fetch(630091, {});
}
