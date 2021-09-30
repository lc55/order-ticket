import ajax from '../ajax'
const BASE = '/user'

// 获取所有站点列表
export const userLogin = (phone, password) => ajax(BASE + '/login', { phone, password }, 'POST')
// 获取乘客列表
export const getPassengerList = (id) => ajax(BASE + '/getPassengerList', { id })
// 注册
export const userRegister = (phone, password) => ajax(BASE + '/register', { phone, password }, 'POST')
// 退出登录
export const userLogout = (id) => ajax(BASE + '/logout')
// 添加乘客
export const addPassenger = (phone, name, idCard, id) => ajax(BASE + '/addPassenger', { phone, name, id, idCard }, 'POST')
// 编辑乘客
export const editPassenger = (phone, name, idCard, id) => ajax(BASE + '/editPassenger', { phone, name, idCard, id }, 'POST')
// 删除乘客
export const deletePassenger = (id) => ajax(BASE + '/deletePassenger', { id })
// 我的订单
export const getMyOrderList = (userId, pageNum, pageSize, startDate, endDate, type, orderState) => ajax(BASE + '/order/myOrderList', { userId, pageNum, pageSize, startDate, endDate, type, orderState })
