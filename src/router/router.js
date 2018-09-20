/*
 * @Author: zhenqi.li
 * @Date: 2018-09-10 21:00:28
 * @LastEditors: zhenqi.li
 * @LastEditTime: 2018-09-20 10:57:50
 * @Description: 
 * @Email: 1045875816@qq.com
 */

import Vue from 'vue'
import Router from 'vue-router'
import Store from '@/store/index'

Vue.use(Router)

import routes from './routes'


let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  //to.matched.some( r => r.meta.requiresAuth)
  if (to.meta && to.meta.requiresAuth) {
    if (!Store.getters.loginStatus) {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }
  next();
})

export default router;