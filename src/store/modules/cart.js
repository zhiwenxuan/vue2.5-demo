/*
 * @Author: zhenqi.li
 * @Date: 2018-09-10 20:59:57
 * @LastEditors: zhenqi.li
 * @LastEditTime: 2018-09-19 18:08:55
 * @Description: 购物车模块,目前只是展示购物车商品的数目
 * @Email: 1045875816@qq.com
 */

export default {
    state: {
        productCount: 1
    },
    getters: {

    },
    mutations: {
        addProduct: (state) => {
            state.productCount++;
        }
    },
    actions: {

    }
}