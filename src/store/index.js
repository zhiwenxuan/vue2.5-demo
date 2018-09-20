/*
 * @Author: zhenqi.li
 * @Date: 2018-09-10 21:00:43
 * @LastEditors: zhenqi.li
 * @LastEditTime: 2018-09-10 21:00:43
 * @Description: 
 * @Email: 1045875816@qq.com
 */

import Vue from 'vue'
import Vuex from 'vuex'
import storeOptions from './options'

Vue.use(Vuex)

const {State, Getters, Mutations, Actions} = storeOptions;

export default new Vuex.Store({
    state: State,
    getters: Getters,
    mutations: Mutations,
    actions: Actions
})
