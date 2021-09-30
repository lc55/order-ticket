import ajax from '../ajax'
const BASE = '/admin/carriage'

// 车厢列表
export const listCarriage = (pageNum, pageSize) => ajax(BASE + '/list', { pageNum, pageSize })
// 添加车厢
export const addCarriage = (carriage) => ajax(BASE + '/add', carriage, 'POST')
// 详情
export const carriageInfo = (id) => ajax(BASE + '/info', { id })
// 编辑车厢
export const editCarriage = (carriage) => ajax(BASE + '/edit', carriage, 'POST')
// 删除车厢
export const deleteCarriage = (id) => ajax(BASE + '/delete', { id })