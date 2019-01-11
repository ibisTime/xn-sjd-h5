import {loadSearch} from 'common/js/cache';
const state = {
  user: null,
  cnyAccount: null,
  jfAccount: null,
  orderList: {},
  preOrderList: {},
  conOrderList: {},
  searchHistory: loadSearch()
};

export default state;
