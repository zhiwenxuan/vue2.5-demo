/*
 * @Author: zhenqi.li
 * @Date: 2018-09-13 16:13:21
 * @LastEditors: zhenqi.li
 * @LastEditTime: 2018-09-20 10:02:58
 * @Description: 各个业务数据对接的封装
 * @Email: 1045875816@qq.com
 */
import http from '@/utils/http/index'
import store from '@/store/index'

// console.log(store)
// const userId = store.getters.userId;

//get user info
export const getUserInfo = () => {
    let opt = {
        method: 'get',
        url: `/users/${store.getters.userId}`
    }
    return http.request(opt);
}

//update user info
export const updateUserInfo = (data) => {
    let opt = {
        method: 'put',
        url: `/users/${store.getters.userId}`,
        data: data
    }
    return http.request(opt);
}

//login
export const login = data => {
    let opt = {
        method: 'post',
        url: '/users/session',
        data: data
    }
    return http.request(opt);
}

//register
export const register = data => {
    let opt = {
        method: 'post',
        url: '/users',
        data: data
    }
    return http.request(opt);
}

//logout
export const logout = data => {
    let opt = {
        method: 'delete',
        url: '/users/session',
        data: data
    }
    return http.request(opt);
}

//getSecurityCode
export const getSecurityCode = params => {
    let opt = {
        method: 'get',
        url: '/users/securityCode',
        params: params
    }
    return http.request(opt);
}

//checkUserExistence
export const checkUserExistence = params => {
    let opt = {
        method: 'get',
        url: '/users/existence',
        params: params
    }
    return http.request(opt);
}

//reset password
export const resetPassword = data => {
    let opt = {
        method: 'post',
        url: '/users/password',
        data: data
    }
    return http.request(opt);
}

//bind phone 
export const bindPhone = data => {
    let opt = {
        method: 'patch',
        url: `/users/${store.getters.userId}/phone`,
        data: data
    }
    return http.request(opt);
}

//bind  email
export const bindEmail = data => {
    let opt = {
        method: 'patch',
        url: `/users/${store.getters.userId}/email`,
        data: data
    }
    return http.request(opt);
}

//"/users/" + userId + "/avatar"
export const uploadAvatar = data => {
    let opt = {
        method: 'put',
        url: `/users/${store.getters.userId}/avatar`,
        data: data
    }
    return http.request(opt);
}