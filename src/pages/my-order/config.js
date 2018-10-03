/**
 * 状态(0待支付1已取消2待认养3认养中4已到期)
 * */
export const CATEGORYS = [{
  key: 'all',
  value: '全部'
}, {
  key: '0',
  value: '待支付'
}, {
  key: '2',
  value: '待认养'
}, {
  key: '3',
  value: '认养中'
}, {
  key: '4',
  value: '已到期'
}, {
  key: '1',
  value: '已取消'
}];

export const ORDER_STATUS = {
  '0': '待支付',
  '1': '已取消',
  '2': '待认养',
  '3': '认养中',
  '4': '已到期'
};
