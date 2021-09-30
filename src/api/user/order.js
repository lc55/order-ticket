import ajax from '../ajax'
const BASE = '/user/order'

// 获取所有站点列表
export const toOrder = (data) => ajax(BASE + '/toOrder', data, 'POST')
// 取消订单
export const cancelOrder = (orderIdList) => ajax(BASE + '/cancelOrder', orderIdList, 'POST')
// 支付
export const payment = (orderIdList) => ajax(BASE + '/payment', orderIdList, 'POST')
