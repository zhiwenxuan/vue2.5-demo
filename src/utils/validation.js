/*
 * @Author: zhenqi.li
 * @Date: 2018-09-19 10:11:31
 * @LastEditors: zhenqi.li
 * @LastEditTime: 2018-09-19 10:14:23
 * @Description: 项目用到的一些格式验证：邮箱，电话，密码等等
 * @Email: 1045875816@qq.com
 */

export default {
	//验证邮箱
	verifyEmail(val) {
		return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(val)
	},
	//验证电话
	verifyPhone(val) {
		//the phone for U.S.A.
		// return /^\+?[1-9]{1}[0-9]{3,14}$/.test(val)
		return /^([1-9]{1}[0-9]{2}(\s|-|)[0-9]{3}(\s|-|)[0-9]{4})$/.test(val)
	},
	//
	verifyChineseCellPhone(val) {
		return /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(val)
	},
	verifyChineseTelephone(val) {
		return /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(val) || /^(\d{7,8})?$/.test(val) || /^((0\d{2,3})-)(\d{7,8})?$/.test(val) || /^(\d{7,8})(-(\d{3,}))?$/.test(val);
	},
	//验证密码
	verifyPassword(val) {
		// Minimum eight characters, at least one letter and one number:
		return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(val)
	},
	//验证验证码
	verifySecurityCode(val) {
		return /^\d{6}$/.test(val)
	},
	//验证邮编
	verifyZipCode(val) {
		return /^\d{5,6}(?:[-\s]\d{4})?$/.test(val);
	},
	verifyNAPhone(val) {
		return /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/.test(val);
	},
}