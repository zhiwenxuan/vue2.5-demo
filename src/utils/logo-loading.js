/*
 * @Author: zhenqi.li
 * @Date: 2018-09-19 10:06:02
 * @LastEditors: zhenqi.li
 * @LastEditTime: 2018-09-19 10:07:58
 * @Description: 自定义指令，加载条
 * @Email: 1045875816@qq.com
 */

import Vue from "vue";

const logo_loading = () => {
  const toggleLoading = (el, binding) => {
    if (binding.value) {
      el.div.innerHTML = `<div class="el-loading-spinner">
                              <embed src="${require("@/assets/images/logo-loading.svg")}" width="40" height="40" type="image/svg+xml"/>
                              <p class="el-loading-text">${el.text}</p>
                          </div>`;
      el.appendChild(el.div);
      el.originalPosition = el.style["position"];
      if (
        el.originalPosition !== "absolute" &&
        el.originalPosition !== "fixed"
      ) {
        addClass(el, "el-loading-parent--relative");
      }
    } else {
      remove(el);
    }
  };

  const remove = el => {
    let elChildren = Array.prototype.slice.call(el.children, 0);
    let loadingEle = elChildren.find(child =>
      child.className.split(" ").includes("el-loading-mask")
    );

    // el.div is easy to find loading mask but it would crash when it bind 2 v-loading.
    // let loadingEle = el.div
    if (loadingEle) {
      loadingEle.remove();
    }
    elChildren = Array.prototype.slice.call(el.children, 0);
    loadingEle = elChildren.find(child =>
      child.className.split(" ").includes("el-loading-mask")
    );
    if (!loadingEle) removeClass(el, "el-loading-parent--relative");
  };

  const addClass = (el, cls) => {
    if (!el) return;
    var curClass = el.className;
    var classes = (cls || "").split(" ");

    for (var i = 0, j = classes.length; i < j; i++) {
      var clsName = classes[i];
      if (!clsName) continue;

      if (el.classList) {
        el.classList.add(clsName);
      } else if (!hasClass(el, clsName)) {
        curClass += " " + clsName;
      }
    }
    if (!el.classList) {
      el.className = curClass;
    }
  };

  const removeClass = (el, cls) => {
    if (!el || !cls) return;
    var classes = cls.split(" ");
    var curClass = " " + el.className + " ";

    for (var i = 0, j = classes.length; i < j; i++) {
      var clsName = classes[i];
      if (!clsName) continue;

      if (el.classList) {
        el.classList.remove(clsName);
      } else if (hasClass(el, clsName)) {
        curClass = curClass.replace(" " + clsName + " ", " ");
      }
    }
    if (!el.classList) {
      el.className = curClass.trim();
    }
  };

  const hasClass = (el, cls) => {
    if (!el || !cls) return false;
    if (cls.indexOf(" ") !== -1)
      throw new Error("className should not contain space.");
    if (el.classList) {
      return el.classList.contains(cls);
    } else {
      return (" " + el.className + " ").indexOf(" " + cls + " ") > -1;
    }
  };

  Vue.directive("loading", {
    bind(el, binding, vnode) {
      const textExr = el.getAttribute("element-loading-text");
      const backgroundExr = el.getAttribute("element-loading-background");
      // const vm = vnode.context;
      const div = document.createElement("div");
      div.setAttribute("class", "el-loading-mask");
      div.style.backgroundColor = backgroundExr;
      // div.setAttribute("id", "logo-loading");
      el.div = div;
      el.text = textExr ? textExr : "";
      binding.value && toggleLoading(el, binding, vnode);
    },
    update(el, binding, vnode) {
      if (binding.oldValue !== binding.value) {
        toggleLoading(el, binding, vnode);
      }
    },
    unbind(el) {
      remove(el);
    }
  });
};
export default logo_loading;