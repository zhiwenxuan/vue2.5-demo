/*
 * @Author: zhenqi.li
 * @Date: 2018-09-12 12:06:54
 * @LastEditors: zhenqi.li
 * @LastEditTime: 2018-09-19 10:20:12
 * @Description: 项目一些常用的工具
 * @Email: 1045875816@qq.com
 */

//jquery siblings
export const siblings = o => {
    let arr = [];
    let prev = o.previousSibling;

    while (prev) {
        if (prev.nodeType == 1) { //element node e.g., p, div
            arr.unshift(prev);
        }
        prev = prev.previousSibling;
    }

    let next = o.nextSibling
    while (next) {
        if (next.nodeType == 1) {
            arr.push(next);
        }
        next = next.nextSibling;
    }
    return arr;
}

//对window.localStorage.getItem进行封装
export const getStorage = key => {
    return JSON.parse(window.localStorage.getItem(key));
}

//对window.localStorage.setItem进行封装
export const setStorage = (key, obj) => {
    window.localStorage.setItem(key, JSON.stringify(obj));
    return;
}

//对window.localStorage.removeItem进行封装
export const removeStorage = key => {
    return window.localStorage.removeItem(key);
}

//根据用户名字获取不一样的头像背景颜色，只限于英文名字，用于用户没有上传个人头像
export const getCorlorByName = name => {
    let letter = getNameFirstLetter(name);
    let colors = {
        a: '#770730',
        b: '#EE0E61',
        c: '#990951',
        d: '#076DC4',
        e: '706AF4',
        f: '#E963A5',
        g: '#9E6495',
        h: '#0EDB88',
        i: '#79DCB8',
        j: '#E0D5E9',
        k: '#09B64C',
        l: '#7EB17C',
        m: '#E7B82D',
        n: '#90BF1D',
        o: '#1DB710',
        p: '#6AB020',
        q: '#F3B971',
        r: '#84BE41',
        s: '#1ADAD4',
        t: '#6DDDE4',
        u: '#F4D4B5',
        v: '#83D385',
        w: '#136C98',
        x: '#646BA8',
        y: '#FD62F9',
        z: '#8A65C9'
    };
    return colors[letter.toLowerCase()];
}

//获取用户名字的首字母的大写，只限于英文名字，否则返回A
export const getNameFirstLetter = name => {
    //filter space
    name = name.replace(/\s+/g, "");
    let reg = /^[A-Za-z]+$/;
    let letter = 'A';
    if (reg.test(name)) {
        letter = name.slice(0, 1).toUpperCase();
    }
    return letter;
}