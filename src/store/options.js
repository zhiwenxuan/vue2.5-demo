/*
 * @Author: zhenqi.li
 * @Date: 2018-09-10 21:00:37
 * @LastEditors: zhenqi.li
 * @LastEditTime: 2018-09-19 18:26:15
 * @Description: 
 * @Email: 1045875816@qq.com
 */

import Cart from './modules/cart'
import product from './modules/product'
import user from './modules/user'

let modules = [
    Cart,
    product,
    user
];

const State = Object.assign(...modules.map(m => m.state));
const Getters = Object.assign(...modules.map(m => m.getters));
const Mutations = Object.assign(...modules.map(m => m.mutations));
const Actions = Object.assign(...modules.map(m => m.actions));
// console.log(State);
export default {
    State,
    Getters,
    Mutations,
    Actions
}