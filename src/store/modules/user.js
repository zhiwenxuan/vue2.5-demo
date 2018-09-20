/*
 * @Author: zhenqi.li
 * @Date: 2018-09-10 21:00:18
 * @LastEditors: zhenqi.li
 * @LastEditTime: 2018-09-20 10:06:08
 * @Description: 
 * @Email: 1045875816@qq.com
 */

import Vue from 'vue'
import Msg from '@/utils/message'
import {
    getStorage,
    setStorage,
    removeStorage,
    getCorlorByName,
    getNameFirstLetter
} from '@/utils/common'
import {
    logout
} from '@/api/index'

export default {
    state: {
        // userId: 0,
        // name: '',
        // email: '',
        // phone: '',
        // password: '',
        // city: '',
        // state: '',
        // lastLoginTime: 0,
        // registrationTime: 0,
        // role: 0,
        // token: '',
        // balance: 0,
        // currency: '',
        userInfo: getStorage('userInfo') || {},
        loginActiveTag: 'signIn'
    },
    getters: {
        loginStatus: state => {
            return state.userInfo && state.userInfo.token;
        },
        avatarBgColor: state => {
            return (state.userInfo && state.userInfo.name && !state.userInfo.avatar) ? getCorlorByName(state.userInfo.name) : '#770730';
        },
        nameFirstLetter: state => {
            return (state.userInfo && state.userInfo.name && !state.userInfo.avatar) ? getNameFirstLetter(state.userInfo.name) : 'A';
        },
        loginActiveTag: state => {
            let activeTagObj = getStorage('loginActiveTag');
            if (activeTagObj) {
                Vue.set(state, 'loginActiveTag', activeTagObj.loginActiveTag);
            }
            return state.loginActiveTag;

        },
        authToken: state => {
            return state.userInfo ? state.userInfo.token : '';
        },
        userInfo: state => {
            return state.userInfo || getStorage('userInfo');
        },
        userId: state => {
            return state.userInfo.userId || getStorage('userInfo').userId;
        }
    },
    mutations: {
        saveUserInfo(state, info) {
            //console.log(info);
            for (let prop in info) {
                Vue.set(state.userInfo, prop, info[prop]);
            }
            setStorage('userInfo', state.userInfo);
        },
        saveAuthToken(state, token) {
            Vue.set(state.userInfo, 'token', token);
            setStorage('userInfo', state.userInfo);
        },
        saveLoginActiveTag(state, activeTag) {
            Vue.set(state, 'loginActiveTag', activeTag);
            setStorage('loginActiveTag', {
                loginActiveTag: activeTag
            });
        },
        clearUserInfo(state) {
            state.userInfo = {};
            removeStorage('userInfo');
        }
    },
    actions: {
        async logout({
            commit
        }) {
            let res = await logout();
            if (res) {
                Msg.showSuccess('Log out success.');
            } else {
                Msg.showInfo('Something wrong, but logout still.');
            }
            commit('clearUserInfo');
        }
    }
}