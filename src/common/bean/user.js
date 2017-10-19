import {formatAvatar, formatDate} from 'common/js/util';

const GENDER = {
  '0': '女',
  '1': '男'
};

export default class User {
  constructor({ userId, birthday, gender, level, mobile,
                nickname, photo, totalFansNum, totalFollowNum,
                tradepwdFlag, loginLog, h5OpenId, introduce }) {
    this.userId = userId;
    this.birthday = birthday;
    this.gender = gender;
    this.level = level;
    this.mobile = mobile;
    this.nickname = nickname;
    this.photo = formatAvatar(photo);
    this.totalFansNum = totalFansNum;
    this.totalFollowNum = totalFollowNum;
    this.tradepwdFlag = tradepwdFlag;
    this.loginLog = loginLog;
    this.h5OpenId = h5OpenId;
    this.introduce = introduce;
  }
  setAvatar(photo) {
    this.photo = formatAvatar(photo);
  }
  getDescription() {
    let infos = this.getInfos();
    infos.gender = infos.gender ? infos.gender + '生' : '';
    return infos.age + infos.constellation + infos.gender + this.introduce;
  }
  getLoginTime() {
    let logTime = '';
    if (this.loginLog) {
      logTime = calcSpace(formatDate(this.loginLog.loginDatetime, 'yyyy-MM-dd-hh-mm'));
    }
    return logTime;
  }
  getInfos() {
    let age = '';
    let constellation = '';
    let gender = '';
    if (this.birthday) {
      let arr = this.birthday.split('-');
      let birth = +arr[0];
      if (birth < 2000) {
        age = Math.floor((birth - 1900) / 10) + '0后';
      } else {
        age = Math.floor((birth - 2000) / 10) + '0后';
      }
      constellation = getCostellation(+arr[1], +arr[2]);
    }
    if (this.gender) {
      gender = GENDER[this.gender];
    }
    return {
      age,
      constellation,
      gender
    };
  }
  toString() {
    let age = '';
    let constellation = '';
    let gender = '';
    let infos = this.getInfos();
    if (infos.age) {
      age = infos.age + ' ' + infos.constellation + ' ';
    }
    if (infos.gender) {
      gender = infos.gender + ' ';
    }
    return age + constellation + gender + this.getLoginTime();
  }
}

function getCostellation (month, day) {
  let constellation = '';
  switch (month) {
    case 1:
      constellation = day <= 19 ? '摩羯座' : '水瓶座';
      break;
    case 2:
      constellation = day <= 18 ? '水瓶座' : '双鱼座';
      break;
    case 3:
      constellation = day <= 20 ? '双鱼座' : '白羊座';
      break;
    case 4:
      constellation = day <= 20 ? '白羊座' : '金牛座';
      break;
    case 5:
      constellation = day <= 20 ? '金牛座' : '双子座';
      break;
    case 6:
      constellation = day <= 21 ? '双子座' : '巨蟹座';
      break;
    case 7:
      constellation = day <= 22 ? '巨蟹座' : '狮子座';
      break;
    case 8:
      constellation = day <= 22 ? '狮子座' : '处女座';
      break;
    case 9:
      constellation = day <= 22 ? '处女座' : '天秤座';
      break;
    case 10:
      constellation = day <= 22 ? '天秤座' : '天蝎座';
      break;
    case 11:
      constellation = day <= 21 ? '天蝎座' : '射手座';
      break;
    case 12:
      constellation = day <= 22 ? '射手座' : '摩羯座';
      break;
    default:
      constellation = '';
  }
  return constellation;
}

/**
 * @param {yyyy-MM-dd-hh-mm} beforeTime
 */
function calcSpace (beforeTime) {
  let now = formatDate(null, 'yyyy-MM-dd-hh-mm').split('-');
  let before = beforeTime.split('-');
  let nowYear = +now[0];
  let beforeYear = +before[0];
  let nowMonth = +now[1];
  let beforeMonth = +before[1];
  if (nowYear > beforeYear) {
    let diffY = nowYear - beforeYear;
    let diffM = diffY * 12 + nowMonth - beforeMonth;
    return diffM < 12 ? diffM + '月前来过' : diffY + '年前来过';
  }
  if (nowMonth > beforeMonth) {
    return nowMonth - beforeMonth + '月前来过';
  }
  let nowDay = now[2];
  let beforeDay = before[2];
  if (nowDay > beforeDay) {
    return nowDay - beforeDay + '天前来过';
  }
  let nowHour = now[3];
  let beforeHour = before[3];
  if (nowHour > beforeHour) {
    return nowHour - beforeHour + '小时前来过';
  }
  let nowMinute = now[4];
  let beforeMinute = before[4];
  let diffMinute = nowMinute - beforeMinute;
  return diffMinute <= 5 ? '刚刚来过' : diffMinute + '分钟前来过';
}
