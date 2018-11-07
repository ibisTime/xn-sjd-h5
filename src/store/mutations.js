import * as types from './mutation-types';
// import User from 'common/bean/me';

const mutations = {
  [types.SET_ORDER_LIST](state, list) {
    state.orderList = list;
  },
  [types.SET_CURRENT_ORDER](state, order) {
    state.currentOrder = order;
  },
  [types.SET_PRE_ORDER_LIST](state, list) {
    state.preOrderList = list;
  },
  [types.SET_CURRENT_PRE_ORDER](state, order) {
    state.currentPreOrder = order;
  },
  [types.SET_CON_ORDER_LIST](state, list) {
    state.conOrderList = list;
  },
  [types.SET_CURRENT_CON_ORDER](state, order) {
    state.currentConOrder = order;
  }
  // [types.SET_USER_STATE](state, me) {
  //   state.me = new User(me);
  // },
  // [types.SET_USER_MOBILE](state, mobile) {
  //   let me = state.me || new User();
  //   me.mobile = mobile;
  //   state.me = me;
  // },
  // [types.SET_USER_NICKNAME](state, nickname) {
  //   let me = state.me || new User();
  //   me.nickname = nickname;
  //   state.me = me;
  // },
  // [types.SET_USER_GENDER](state, gender) {
  //   let me = state.me || new User();
  //   me.gender = gender;
  //   state.me = me;
  // },
  // [types.SET_USER_TRADE_PWD_FLAG](state, tradepwdFlag) {
  //   let me = state.me || new User();
  //   me.tradepwdFlag = tradepwdFlag;
  //   state.me = me;
  // },
  // [types.SET_USER_AVATAR](state, avatar) {
  //   let me = state.me || new User();
  //   me.setAvatar(avatar);
  //   state.me = me;
  // },
  // [types.SET_CNY_ACCOUNT](state, account) {
  //   state.cnyAccount = account;
  // },
  // [types.SET_JF_ACCOUNT](state, account) {
  //   state.jfAccount = account;
  // }
};

export default mutations;
