import ajax from '../ajax'
const BASE = '/admin/site'

// 站点列表
export const listSite = (pageNum, pageSize, key) => ajax(BASE + '/list', { pageNum, pageSize, key })
// 添加站点
export const addSite = (site) => ajax(BASE + '/add', site, 'POST')