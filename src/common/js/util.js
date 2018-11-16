import {setCookie, getCookie, delCookie} from './cookie';
import fetch from 'common/js/fetch';

// 获取链接入参
export function getUrlParam(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  let lotion = window.location.search;
  var r = lotion.substr(1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return '';
}

// 日期格式化
export function formatDate(date, format) {
  date = new Date(date);
  var fmt = format || 'yyyy-MM-dd hh:mm:ss';
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}

// 获取userId
export function getUserId() {
  return getCookie('userId') || '';
}

// 保存用户登录信息
export function setUser(data) {
  setCookie('userId', data.userId);
  setCookie('token', data.token);
}

// 删除用户登录信息
export function clearUser() {
  delCookie('userId');
  delCookie('token');
}

// 是否登录
export function isLogin() {
  return !!getUserId();
}

// 是否为空
export function isUnDefined(value) {
  if (value === undefined || value === null || value === '') {
    return true;
  }
  return false;
}

// 格式化图片地址
// export function formatImg(imgs, suffix = '?imageMogr2/auto-orient') {
//   if(!imgs) {
//     return '';
//   }
//   getdomain('qiniu_domain').then((res) => {
//     let img = imgs.split(/\|\|/)[0];
//
//     if (!/^http|^data:image/i.test(img)) {
//       let index = img.indexOf('?imageMogr2');
//       if (index !== -1) {
//         suffix = img.substr(index);
//         img = img.substr(0, index);
//       }
//       img = sessionStorage.getItem('url') + '/' + encodeURIComponent(img) + suffix;
//     }
//     console.log(img);
//     return img;
//   });
// }

// // 格式化图片地址
export function formatImg(imgs, suffix = '?imageMogr2/auto-orient') {
  if(!imgs) {
    return '';
  }
  let img = imgs.split(/\|\|/)[0];

  if (!/^http|^data:image/i.test(img)) {
    let index = img.indexOf('?imageMogr2');
    if (index !== -1) {
      suffix = img.substr(index);
      img = img.substr(0, index);
    }
    img = PIC_PREFIX + encodeURIComponent(img) + suffix;
  }
  return img;
}
export function getdomain(ckey) {
  return fetch(630047, {
    ckey: 'qiniu_domain'
  });
}
// // 根据ckey获取系统参数
// export function getSystemConfigCkey(ckey) {
//   if (getSystemConfigCkey[ckey]) {
//     return Promise.resolve(getSystemConfigCkey[ckey]);
//   }
//   return fetch(630047, {
//     ckey
//   }).then((data) => {
//     getSystemConfigCkey[ckey] = data;
//     return Promise.resolve(data);
//   });
// }
// 格式化头像
export function formatAvatar(img, suffix = '?imageMogr2/auto-orient') {
  if (!img) {
    let avatar = require('../image/avatar@2x.png');
    if (/^http|^data:image/i.test(avatar)) {
      return avatar;
    }
    return location.origin + avatar;
  }
  return formatImg(img, suffix);
}

// 获得分享图片
export function getShareImg(imgs) {
  if (!imgs) {
    let sharImg = require('../image/app.png');
    if (/data:image/.test(sharImg) || /http(?:s)?/.test(sharImg)) {
      return sharImg;
    }
    return location.origin + sharImg;
  }
  return formatImg(imgs);
}

// 格式化金额
export function formatAmount(amount, len = 2) {
  if (isUnDefined(amount)) {
    return '--';
  } else if (amount === 0) {
    return '0';
  }
  // amount = (+amount / 1000).toString();
  amount = parseInt(+amount / 10) / 100;
  // num=parseInt(num*100)/100;
  // let reg = new RegExp('(\\.\\d{' + len + 1 + '})\\d*', 'ig');
  // amount = +amount.replace(reg, '$1');
  return amount.toFixed(len);
}

// 判断是否 ios
export const ISIOS = /(iphone|ipod|ipad)/i.test(navigator.userAgent);

// 微信设置页面标题
export function setTitle(title) {
  if (document.title !== title) {
    document.title = title;
    if (ISIOS) {
      let iframe = document.createElement('iframe');
      iframe.src = '//m.baidu.com/favicon.ico';
      iframe.style.display = 'none';
      iframe.onload = () => {
        setTimeout(() => {
          iframe.remove();
        }, 9);
      };
      document.body.appendChild(iframe);
    }
  }
}

// 延时函数的执行
export function debounce(func, delay) {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// 清除内容里的标签
export function clearTag(content) {
  return content.replace(/<[^>]+>|<\/[^>]+>|<[^>]+\/>|&nbsp;/ig, '');
}

// 是否是function
export function isFunction(fn) {
  var getType = {};
  return fn && getType.toString.call(fn) === '[object Function]';
}

// 获取图片base64
export function getImgData(fileType, img, dir, next) {
  let image = new Image();
  image.onload = function() {
    let degree = 0;
    let drawWidth;
    let drawHeight;
    let width;
    let height;
    drawWidth = this.naturalWidth;
    drawHeight = this.naturalHeight;
    let canvas = document.createElement('canvas');
    canvas.width = width = drawWidth;
    canvas.height = height = drawHeight;
    let context = canvas.getContext('2d');
    // 判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
    switch(dir) {
      // iphone横屏拍摄，此时home键在左侧
      case 3:
        degree = 180;
        drawWidth = -width;
        drawHeight = -height;
        break;
      // iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
      case 6:
        canvas.width = height;
        canvas.height = width;
        degree = 90;
        drawWidth = width;
        drawHeight = -height;
        break;
      // iphone竖屏拍摄，此时home键在上方
      case 8:
        canvas.width = height;
        canvas.height = width;
        degree = 270;
        drawWidth = -width;
        drawHeight = height;
        break;
    }
    // 使用canvas旋转校正
    context.rotate(degree * Math.PI / 180);
    context.drawImage(this, 0, 0, drawWidth, drawHeight);
    // 返回校正图片
    next(canvas.toDataURL(fileType, 0.8));
  };
  image.src = img;
}

// 设置微信登录时填写的手机号和验证码
export function setWxMobAndCapt (mobile, captcha) {
  sessionStorage.setItem('__mob__', mobile);
  sessionStorage.setItem('__capt__', captcha);
}

// 获取微信登录时填写的手机号和验证码
export function getWxMobAndCapt () {
  let mobile = sessionStorage.getItem('__mob__');
  let captcha = sessionStorage.getItem('__capt__');
  sessionStorage.removeItem('__mob__');
  sessionStorage.removeItem('__capt__');
  if (mobile && captcha) {
    return {
      mobile,
      captcha
    };
  }
  return null;
}
