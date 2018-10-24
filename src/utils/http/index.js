/*
 * @Author: zhenqi.li
 * @Date: 2018-09-08 15:55:14
 * @LastEditors: zhenqi.li
 * @LastEditTime: 2018-09-20 09:29:44
 * @Description: 对axios进行封装（使用JWT）：
 *                     1. 请求拦截：1）自定义参数封装；2）token携带；3）是否登录处理。
 *                     2. 响应拦截：1）错误统一处理； 2）返回的数据处理
 *                     3. 基本请求对象封装： 1）参数封装
 *                  
 * @Email: 1045875816@qq.com
 */
import axios from 'axios'
import router from '@/router/router'
import store from '@/store/index'
import {
    BaseUrl
} from '@/utils/constants'
//对Element-Ui消息提示再一次封装
import MsgTool from '@/utils/message'

//判断是否要登录，如果需要则跳到登录页面，否则不作处理
let handleJumpLogin = () => {
    //当前的路由
    let currentRouter = router.history.current;
    //判断当前的路由是否需要登录
    let isRequireAuth = currentRouter.mata && currentRouter.meta.requiresAuth;
    //不需要登录，直接返回
    if (!isRequireAuth) {
        return;
    }
    //需要登录的处理：
    MsgTool.showResponseError('Login timed out, please log in again.');
    //清空已有的登录信息
    store.commit('clearUserInfo');
    //跳到登录页面
    router.replace({
        path: '/login',
        query: {
            redirect: currentRouter.fullPath //保存当前页面路径，登录完成后重定向到这个页面
        }
    });
}

//对服务器返回的错误统一处理
let processServerError = data => {
    let code = data.code ? Number(data.code) : -1;
    //这边约定401，402，403，404是关于token不存在或者不正确
    switch (code) {
        case 401: // No JWT token found in request headers
        case 402: // JWT token is not valid
        case 403: // The server understood the request but refuses to authorize it.
        case 404: // JWT token is timeout
            handleJumpLogin(); // token发生错误，判断是否要重新登录
            break;
        default:
            MsgTool.showResponseError(data.msg); //不是token的错误直接展示服务器返回的错误信息
            break;
    }
}

//初始化一个axios示例
const Http = axios.create({
    baseURL: BaseUrl, //配置API基本路径
    responseType: "json",
    timeout: 10000,
    withCredentials: true //允许跨域
});

//请求拦截
Http.interceptors.request.use(config => {
    //获取token
    let authToken = store.getters.authToken;
    //是否登录
    let isLogin = !!authToken;
    if (isLogin) { //has logined
        //已经登录，请求头配置token
        config.headers.Authorization = `${authToken}`;
    } else {
        //没有登录，做登录跳转处理
        handleJumpLogin();
    }

    //这里一定要return config，否则请求参数将不存在
    return config;
}, error => {
    //请求错误，未知错误，直接展示网络异常
    MsgTool.showError("Something is wrong, please check your internet connection.");
    return Promise.reject(error);
});

//响应拦截
/*
    本项目服务器返回的数据格式是:
        {
            code: 0,
            msg: '错误提示'，
            data: {}
        }, code为0代表成功， 其他代表失败
        每个项目可能不一样， 可相应改变
*/
Http.interceptors.response.use(res => {
    if (res && res.data) {
        //请求成功，因为这边已经做了错误处理，所以直接返回数据
        if (Number(res.data.code) === 0) {
            return res.data.data || true;
        } else {
            //服务器错误处理，返回数据为空
            processServerError(res.data);
            return null;
        }
    }
    //没有响应数据，返回null
    MsgTool.showError("Something is wrong, please check your internet connection.");
    return null;
}, error => {
    //响应错误，未知错误，直接展示网络异常
    //备注：这里还可以根据响应错误状态码(error.response.status)，对错误进行细化
    MsgTool.showError("Something is wrong, please check your internet connection.");
    return Promise.reject(error.response);
});

export default {
    /*
        opt格式：{
            method: 请求类型(必须),
            url: 请求url(必须),
            params: 请求参数,针对get请求(可选),
            data: 请求参数，针对非get请求(可选)
        }
    */
    request: (opt) => {
        //根据请求类型，对请求参数进一步封装
        let requestOpt = {
            method: opt.method,
            url: opt.url
        };
        //存在data，且请求类型不是get类型
        if (opt.data && opt.method.toLowerCase() !== 'get') {
            requestOpt.data = opt.data;
        }
        //存在params，且请求类型是get类型
        if (opt.params && opt.method.toLowerCase() === 'get') {
            requestOpt.params = opt.params;
        }

        //发起请求
        return new Promise((resolve, reject) => {
            Http(requestOpt).then(
                res => resolve(res),
                err => reject(err)
            )
        });
    }
}
