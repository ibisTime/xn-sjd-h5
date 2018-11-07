import * as types from './mutation-types';

function _getOrderList(state, code, prevStatus, nextStatus) {
  let allList = null;
  let prevList = null;
  let nextList = null; // 置空下个状态

  // 如果有all的数据，并且有这个订单，则改变状态
  if (state.orderList.all) {
    allList = {
      ...state.orderList.all
    };
    let index = allList.data.findIndex((order) => {
      return order.code === code;
    });
    if (index !== -1) {
      allList.data = allList.data.slice();
      let _item = {
        ...allList.data[index],
        status: nextStatus
      };
      allList.data.splice(index, 1, _item);
    }
  }
  // 如果有当前状态的数据，则删除这条订单
  if (state.orderList[prevStatus]) {
    prevList = {
      ...state.orderList[prevStatus]
    };
    let index = prevList.data.findIndex((order) => {
      return order.code === code;
    });
    if (index !== -1) {
      prevList.data = prevList.data.slice();
      prevList.data.splice(index, 1);
    }
  }
  let _orderList = {
    ...state.orderList,
    prevStatus: prevList,
    nextStatus: nextList,
    all: allList
  };
  return _orderList;
}

function _getPreOrderList(state, code, prevStatus, nextStatus) {
  let allList = null;
  let prevList = null;
  let nextList = null; // 置空下个状态

  // 如果有all的数据，并且有这个订单，则改变状态
  if (state.preOrderList.all) {
    allList = {
      ...state.preOrderList.all
    };
    let index = allList.data.findIndex((order) => {
      return order.code === code;
    });
    if (index !== -1) {
      allList.data = allList.data.slice();
      let _item = {
        ...allList.data[index],
        status: nextStatus
      };
      allList.data.splice(index, 1, _item);
    }
  }
  // 如果有当前状态的数据，则删除这条订单
  if (state.preOrderList[prevStatus]) {
    prevList = {
      ...state.preOrderList[prevStatus]
    };
    let index = prevList.data.findIndex((order) => {
      return order.code === code;
    });
    if (index !== -1) {
      prevList.data = prevList.data.slice();
      prevList.data.splice(index, 1);
    }
  }
  let _orderList = {
    ...state.preOrderList,
    prevStatus: prevList,
    nextStatus: nextList,
    all: allList
  };
  return _orderList;
}

function _getConOrderList(state, code, prevStatus, nextStatus) {
  let allList = null;
  let prevList = null;
  let nextList = null; // 置空下个状态

  // 如果有all的数据，并且有这个订单，则改变状态
  if (state.conOrderList.all) {
    allList = {
      ...state.conOrderList.all
    };
    let index = allList.data.findIndex((order) => {
      return order.code === code;
    });
    if (index !== -1) {
      allList.data = allList.data.slice();
      let _item = {
        ...allList.data[index],
        status: nextStatus
      };
      allList.data.splice(index, 1, _item);
    }
  }
  // 如果有当前状态的数据，则删除这条订单
  if (state.conOrderList[prevStatus]) {
    prevList = {
      ...state.conOrderList[prevStatus]
    };
    let index = prevList.data.findIndex((order) => {
      return order.code === code;
    });
    if (index !== -1) {
      prevList.data = prevList.data.slice();
      prevList.data.splice(index, 1);
    }
  }
  let _orderList = {
    ...state.conOrderList,
    prevStatus: prevList,
    nextStatus: nextList,
    all: allList
  };
  return _orderList;
}

// 取消订单后，改变orderList
export const editOrderListByCancel = function({commit, state}, {code}) {
  let prevStatus = '0';
  let nextStatus = '1';
  let _orderList = _getOrderList(state, code, prevStatus, nextStatus);
  commit(types.SET_ORDER_LIST, _orderList);

  if (state.currentOrder && state.currentOrder.code === code) {
    let _order = {
      ...state.currentOrder
    };
    _order.status = nextStatus;
    commit(types.SET_CURRENT_ORDER, _order);
  }
};

// 取消订单后，改变orderList
export const editPreOrderListByCancel = function({commit, state}, {code}) {
  let prevStatus = '0';
  let nextStatus = '1';
  let _orderList = _getPreOrderList(state, code, prevStatus, nextStatus);
  commit(types.SET_PRE_ORDER_LIST, _orderList);

  if (state.currentPreOrder && state.currentPreOrder.code === code) {
    let _order = {
      ...state.currentPreOrder
    };
    _order.status = nextStatus;
    commit(types.SET_CURRENT_PRE_ORDER, _order);
  }
};

// 取消订单后，改变orderList
export const editConOrderListByCancel = function({commit, state}, {code}) {
  let prevStatus = '0';
  let nextStatus = '1';
  let _orderList = _getConOrderList(state, code, prevStatus, nextStatus);
  commit(types.SET_CON_ORDER_LIST, _orderList);

  if (state.currentConOrder && state.currentConOrder.code === code) {
    let _order = {
      ...state.currentConOrder
    };
    _order.status = nextStatus;
    commit(types.SET_CURRENT_CON_ORDER, _order);
  }
};

// 支付订单后，改变orderList
export const editPreOrderListByPay = function({commit, state}, {code}) {
  let prevStatus = '0';
  let nextStatus = '2';

  let _orderList = _getPreOrderList(state, code, prevStatus, nextStatus);
  commit(types.SET_PRE_ORDER_LIST, _orderList);

  if (state.currentPreOrder) {
    if (state.currentPreOrder.code === code) {
      let _order = {
        ...state.currentPreOrder
      };
      _order.status = nextStatus;
      commit(types.SET_CURRENT_PRE_ORDER, _order);
    } else {
      commit(types.SET_CURRENT_PRE_ORDER, null);
    }
  }
};

// 支付订单后，改变orderList
export const editConOrderListByPay = function({commit, state}, {code}) {
  let prevStatus = '0';
  let nextStatus = '2';

  let _orderList = _getConOrderList(state, code, prevStatus, nextStatus);
  commit(types.SET_CON_ORDER_LIST, _orderList);

  if (state.currentConOrder) {
    if (state.currentConOrder.code === code) {
      let _order = {
        ...state.currentConOrder
      };
      _order.status = nextStatus;
      commit(types.SET_CURRENT_CON_ORDER, _order);
    } else {
      commit(types.SET_CURRENT_CON_ORDER, null);
    }
  }
};
