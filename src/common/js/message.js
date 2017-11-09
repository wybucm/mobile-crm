/**
 * 统一话术
 */
import Vue from "vue";

/**
 * 对Vue实例注入$message，返回中文话术
 * @param {String} key - 话术标识
 * @return {String} 中文话术，如果话术标识没有匹配到，则返回话术标识
 */
Vue.prototype.$message = key => {
    switch (key) {
        case "sessionOut": //会话超时
            return "登录超时，请重新登录";
        case "Timeout": //请求接口超时
            return "请求超时！";
    }
    return key;
};
