/*
 * @Author: zhenqi.li
 * @Date: 2018-09-10 09:37:04
 * @LastEditors: zhenqi.li
 * @LastEditTime: 2018-09-17 20:40:54
 * @Description: routes
 * @Email: 1045875816@qq.com
 */
const Home = r => require.ensure([], () => r(require('@/views/home/Home.vue')), 'Home');
const About = r => require.ensure([], () => r(require('@/views/about/About.vue')), 'About');
const NotFound = r => require.ensure([], () => r(require('@/views/NotFound.vue')), 'NotFound');
const Login = r => require.ensure([], () => r(require('@/views/user/Login.vue')), 'Login');
const PasswordReset = r => require.ensure([], () => r(require('@/views/user/PasswordReset.vue')), 'PasswordReset');
const Account = r => require.ensure([], () => r(require('@/views/user/Account.vue')), 'Account');


export default [{
        path: '/',
        component: Home,
        // meta: {
        //     requiresAuth: false
        // },
        children: [{
                path: '/home',
                component: Home,
                name: 'Home',
                meta: {
                    requiresAuth: false
                }
            },
            {
                path: '/login',
                component: Login,
                name: 'Login',
                meta: {
                    requiresAuth: false
                }
            },
            {
                path: '/password-reset',
                component: PasswordReset,
                name: 'PasswordReset',
                meta: {
                    requiresAuth: false
                }
            },
            {
                path: '/account',
                component: Account,
                name: 'Account',
                meta: {
                    requiresAuth: true
                }
            }

        ]
    },
    {
        path: '/about',
        name: 'About',
        component: About,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/404',
        name: 'NotFound',
        component: NotFound,
        mata: {
            requiresAuth: false
        }
    },
    {
        path: '*',
        name: '404',
        redirect: '/404',
        component: NotFound,
        mata: {
            requiresAuth: false
        }
    }
]