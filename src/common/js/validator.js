/**
 * 校验库函数，可通过vm.$validator访问
 *
 * required         - 是否非空（提示语为“不能为空...”）
 * requireSelected  - 是否非空（提示语为“请选择...”）
 * phone            - 手机号
 * money            - 金额
 */
import Vue from 'vue';
let validator = {
    /**
     * 校验是否非空（包括''、null、undefined、[]、{}）
     * @param {*} v - 要校验的值
     * @param {string} [title='{0}'] - 错误提示语的主语
     * @return {Boolean|String} true或错误提示语
     * 
     * @desc 输入项的校验可以用required()，选择项的校验可以用requireSelected()
     */
    required(v, title = '{0}') {
        if (v === 0) return true;
        if (!v || (Array.isArray(v, title = '{0}') && !v.length) || (Object.isEmpty(v, title = '{0}'))) {
            return title + '不能为空';
        }
        return true;
    },
    /**
     * 与required()一致，只是提示语由“不能为空”改为“请选择...”
     */
    requireSelected(v, title = '{0}') {
        if (validator.required(v) !== true) {
            return '请选择' + title;
        }
        return true;
    },
    /**
     * 校验手机号（1开头+10位数字）
     * @param {String} v - 要校验的值
     * @param {string} [title='{0}'] - 错误提示语的主语
     * @return {Boolean|String} true或错误提示语
     */
    phone(v, title = '{0}') {
        if (/^1\d{10}$/.test(v)) return true;
        return title + '格式有误';
    },
    /**
     * 校验金额（>0且小数位最大2）
     * @param {String} v - 要校验的值
     * @param {string} [title='{0}'] - 错误提示语的主语
     * @return {Boolean|String} true或错误提示语
     */
    money(v, title = '{0}') {
        if (isNaN(v, title = '{0}')) return title + '格式有误'; //是否数字
        if (v <= 0) return title + '必须＞0'; //必须大于0
        var str = v.toString(),
            index = str.indexOf('.');
        if (index != -1 && index < str.length - 3) return title + '只能保留2位小数'; //存在小数点 && 小数位多于2位
        return true;
    }
}
Vue.prototype.$validator = validator;