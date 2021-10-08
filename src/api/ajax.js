// 异步发送ajax请求的模块
// 封装axios库
import axios from "axios"
import { message } from "antd"
import storageUtils from "../utils/storageUtils"
import { pathIsDev } from '../common/methods'
const isAdmin = pathIsDev()

// 请求拦截
axios.interceptors.request.use(function (config) {
    if (isAdmin) {
        if (storageUtils.getAdminToken()) {
            config.headers.Auth = storageUtils.getAdminToken()
        }
    } else {
        if (storageUtils.getUserToken()) {
            config.headers.Auth = storageUtils.getUserToken()
        }
    }
    return config
}, function (error) {
    return Promise.reject(error)
})

export default async function ajax(url, data = {}, type = 'GET') {

    try {
        return new Promise((resolve) => {
            let promise
            // 1.执行ajax请求
            if (type === 'GET') {
                promise = axios.get(url, {
                    params: data
                })
            } else {
                promise = axios.post(url, data)
            }
            // 2.如果成功了，调用resolve(value)
            promise.then(response => {
                resolve(response.data)
            })

        })
    } catch (error) {
        // 3.如果失败了，不调用reject(reason),提示异常信息
        message.error('请求出错了：', error.message)
    }
}
