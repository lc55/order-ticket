import ajax from '../ajax'
const BASE = '/user/search'

// 获取所有站点列表
export const getSiteList = () => ajax(BASE + '/getSiteList')
// 查询车次
export const moreTicket = (startId, endId, startTime, types) => ajax(BASE + '/moreTicket', { startId, endId, startTime, types })
