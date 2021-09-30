import ajax from '../ajax'
const BASE = '/admin/train'

// 获取站点列表
export const getSiteList = () => ajax(BASE + '/getSiteList')
// 获取车厢列表
export const getCarriageList = () => ajax(BASE + '/getCarriageList')
// 添加车次
export const addTrain = (train) => ajax(BASE + '/add', train, 'POST')
// 车次列表
export const getTrainList = (pageNum, pageSize) => ajax(BASE + '/list', { pageNum, pageSize })
// 车次详情
export const getTrainInfo = (id) => ajax(BASE + '/info', { id })
// 更新车次
export const updataTrain = (train) => ajax(BASE + '/update', train, 'POST')
