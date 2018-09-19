// import * as types from './mutation-types';
// import {isUnDefined} from 'common/js/util';
//
// // 新增银行卡
// export const addBankCard = function({commit, state}, {bankcard}) {
//   let bankcardList = state.bankcardList.slice();
//   bankcardList.unshift(bankcard);
//   commit(types.SET_BANKCARD_LIST, bankcardList);
// };
//
// // 删除银行卡
// export const deleteBankCard = function({commit, state}, {code}) {
//   let bankcardList = state.bankcardList.slice();
//   let index = bankcardList.findIndex((item) => {
//     return item.code === code;
//   });
//   bankcardList.splice(index, 1);
//   commit(types.SET_BANKCARD_LIST, bankcardList);
// };
//
// // 修改银行卡
// export const editBankCard = function({commit, state}, {bankcard}) {
//   let bankcardList = state.bankcardList.slice();
//   let index = bankcardList.findIndex((item) => {
//     return item.code === bankcard.code;
//   });
//   bankcardList.splice(index, 1, bankcard);
//   commit(types.SET_BANKCARD_LIST, bankcardList);
// };
//
// // 新增地址
// export const addAddress = function({commit, state}, {address}) {
//   let addressList = state.addressList.slice();
//   addressList.unshift(address);
//   commit(types.SET_ADDRESS_LIST, addressList);
// };
//
// // 修改地址
// export const editAddress = function({commit, state}, {address}) {
//   let addressList = state.addressList.slice();
//   let index = addressList.findIndex((item) => {
//     return item.code === address.code;
//   });
//   addressList.splice(index, 1, address);
//   commit(types.SET_ADDRESS_LIST, addressList);
// };
//
// // 设置默认地址
// export const setDefaultAddress = function ({commit, state}, {code}) {
//   let addressList = state.addressList.slice();
//   let idx0, idx1;
//   addressList.forEach((address, idx) => {
//     if (address.code === code) {
//       idx1 = idx;
//     } else if (address.isDefault === '1') {
//       idx0 = idx;
//     }
//   });
//   if (!isUnDefined(idx0)) {
//     let addr0 = addressList[idx0];
//     addressList.splice(idx0, 1, {
//       ...addr0,
//       isDefault: '0'
//     });
//   }
//   let addr1 = addressList[idx1];
//   addressList.splice(idx1, 1, {
//     ...addr1,
//     isDefault: '1'
//   });
//   commit(types.SET_ADDRESS_LIST, addressList);
// };
//
// // 删除地址
// export const deleteAddress = function({commit, state}, {code}) {
//   let addressList = state.addressList.slice();
//   let index = addressList.findIndex((item) => {
//     return item.code === code;
//   });
//   addressList.splice(index, 1);
//   commit(types.SET_ADDRESS_LIST, addressList);
// };
