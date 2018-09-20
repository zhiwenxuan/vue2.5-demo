/*
 * @Author: zhenqi.li
 * @Date: 2018-09-11 15:55:12
 * @LastEditors: zhenqi.li
 * @LastEditTime: 2018-09-19 11:44:00
 * @Description: 第三方库
 * @Email: 1045875816@qq.com
 */

import Vue from 'vue'

/*
 * Element-UI模块
 * 包括自定义主题以及更改默认语言
 */
//按需引入
import {
  Button,
  Input,
  Pagination,
  Row,
  Col,
  Tabs,
  Dialog,
  Form,
  FormItem,
  TabPane,
  Tooltip,
  Popover,
  Menu,
  MenuItem,
  Loading,
  Select,
  Option
} from 'element-ui'
//自定义Element主题
import '@/assets/css/element-variables.scss'
//更改Element默认语言为英文
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

Vue.use(Button);
Vue.use(Input);
Vue.use(Pagination);
Vue.use(Row);
Vue.use(Col);
Vue.use(Tabs);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(TabPane);
Vue.use(Tooltip);
Vue.use(Popover);
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Loading);
Vue.use(Select)
Vue.use(Option)
locale.use(lang);

//全局引入自定义指令
import loading from "@/utils/logo-loading.js";
Vue.use(loading);