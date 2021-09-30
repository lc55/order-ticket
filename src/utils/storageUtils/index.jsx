import store from 'store'
const ADMIN_KEY = 'admin_key'
const ADMIN_TOKEN_KEY = 'admin_token_key'

const USER_KEY = 'user_key'
const USER_TOKEN_KEY = 'user_token_key'
export default {
    // 保存admin
    saveAdmin(admin) {
        store.set(ADMIN_KEY, admin)
    },
    // 读取admin
    getAdmin() {
        return store.get(ADMIN_KEY) || {}
    },

    // 删除user
    removeAdmin() {
        store.remove(ADMIN_KEY)
    },

    // 保存token
    saveAdminToken(token) {
        store.set(ADMIN_TOKEN_KEY, token)
    },
    getAdminToken() {
        return store.get(ADMIN_TOKEN_KEY)
    },
    removeAdminToken() {
        store.remove(ADMIN_TOKEN_KEY)
    },


    saveUser(user) {
        store.set(USER_KEY, user)
    },
    getUser() {
        return store.get(USER_KEY) || {}
    },
    removeUser() {
        store.remove(USER_KEY)
    },

    // 保存token
    saveUserToken(token) {
        store.set(USER_TOKEN_KEY, token)
    },
    getUserToken() {
        return store.get(USER_TOKEN_KEY)
    },
    removeUserToken() {
        store.remove(USER_TOKEN_KEY)
    },


}