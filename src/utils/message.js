/*
 * @Author: zhenqi.li
 * @Date: 2018-09-19 10:03:45
 * @LastEditors: zhenqi.li
 * @LastEditTime: 2018-09-19 10:05:48
 * @Description: 借助element对消息提示进行封装
 * @Email: 1045875816@qq.com
 */

import {
  MessageBox,
  Notification
} from "element-ui";

let matchError = (msg) => {
  msg = msg || "";
  return !!(msg.toUpperCase().match("JWT TOKEN"));
};
export default {
  showWarning(msg, offset) {
    Notification.warning({
      title: "Warning",
      message: msg,
      offset: offset || 240,
    });
  },
  showError(msg, offset) {
    if (matchError(msg)) return;
    Notification.error({
      title: "Error",
      message: msg,
      offset: offset || 240
    });
  },
  showInfo(msg, offset) {
    Notification.info({
      message: msg,
      offset: offset || 240
    });
  },
  alertMsg(title, content, callback) {
    if (!callback)
      callback = function () {
        console.log("confirm");
      };
    MessageBox.confirm(content, title, {
      confirmButtonText: "OK",
      callback: callback
    });
  },
  showResponseError(msg = "Something is wrong, please check your internet connection.") {
    if (matchError(msg)) return;
    Notification.error({
      title: "Error",
      message: msg,
      offset: 240
    });
  },
  showSuccess(msg) {
    Notification.success({
      title: "Succeed",
      message: msg,
      offset: 240
    });
  },
  showMotionless(title, msg) {
    Notification.success({
      title: title,
      message: msg,
      offset: 240
    });
  }
};