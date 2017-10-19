import {loadSearch} from 'common/js/cache';

const state = {
  publishCategory: null,
  publishGoods: null,
  searchHistory: loadSearch(),
  location: null,
  isLocaErr: false,
  user: null,
  cnyAccount: null,
  jfAccount: null,
  bankcardList: null,
  addressList: [],
  currentAddr: null,
  orderList: {},
  currentOrder: null,
  logFLag: false
};

export default state;
