// 包含应用中所有接口请求函数的模块

import ajax from '../ajax'
const BASE = '/admin/manage'

// 登录
export const adminLogin = (phone, password) => ajax(BASE + '/login', { phone, password }, 'POST')

// 退出登录
export const adminLogout = () => ajax(BASE + '/logout')

// 平台用户列表
export const adminList = (pageNum, pageSize) => ajax(BASE + '/list', { pageNum, pageSize })
// 添加用户
export const addAdmin = (admin) => ajax(BASE + '/add', admin, 'POST')
// 获取详情
export const adminInfo = (id) => ajax(BASE + '/info', { id })
// 更新用户
export const updateAdmin = (admin) => ajax(BASE + '/edit', admin, 'POST')
