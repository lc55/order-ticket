import ajax from '../ajax'
const BASE = '/admin/order'

// 获取订单列表
export const getOrderList = (pageNum, pageSize, trainNumber, passengerName, idCard, orderStatus, seatType) =>
    ajax(
        BASE + '/list', { pageNum, pageSize, trainNumber, passengerName, idCard, orderStatus, seatType }
    )
