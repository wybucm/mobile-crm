/**
 * 公共函数，用vm.$tools访问
 * 
 * noop             - 空函数
 * isEmpty          - 校验变量是否为空（包括''、null、undefined、[]、{}）
 * rem2Px           - rem转px
 * px2Rem           - px转rem
 * bufferTimeout    - 缓冲定时器
 * string2Date      - 字符串转为Date对象
 */
import Vue from "vue";
const tools = {
    /**
     * 空函数
     */
    noop() {},
    /**
     * 校验变量是否为空（包括''、null、undefined、[]、{}）
     * @param {*} v - 需要校验的变量
     * @return {Boolean} 是否为空
     */
    isEmpty(v) {
        return $rootVm.$validator.required(v) !== true;
    },
    /**
     * rem转px
     * @param {number} rem - rem值
     * @return {number} px值
     */
    rem2Px(rem) {
        let fontSize = (innerWidth * 100 / 414).toFixed(0);
        return rem * 16 * fontSize / 100;
    },
    /**
     * px转rem
     * @param {number} px - px值
     * @return {number} rem值
     */
    px2Rem(px) {
        let fontSize = (innerWidth * 100 / 414).toFixed(0);
        return px * 100 / 16 / fontSize;
    },
    _timer: {}, //记录bufferTimeout()尚在等待的timeout的code
    /**
     * 缓冲延时器，延迟期间内重复的调用只会执行最后的一次
     * @param {String} id - 唯一标识
     * @param {Function} fn - 延时执行的函数
     * @param {Number} [millisec=500] - 延时时长，ms
     * @return {Number} 用于clearTimeout的code
     */
    bufferTimeout(id, fn, millisec = 500) {
        if (tools._timer[id]) {
            clearTimeout(tools._timer[id]);
        }
        tools._timer[id] = setTimeout(() => {
            fn();
            delete tools._timer[id];
        }, millisec);
        return tools._timer[id];
    },
    /**
     * 字符串转为Date对象
     */
    string2Date(v) {
        let str = tools.formatDateDtl(v);
        if (str.length < 10) {
            //日期不完整，不合法
            return null;
        }
        str = str.replace(/\-/g, '/');
        if (str.length < 19) {
            //钟点不完整
            str += " 00:00:00".substr(str.length - 19);
        }
        return new Date(str);
    },
    /**
     * 渲染日期格式为显示用格式，转换为YYYY-MM-DD格式或YYYY-MM-DD HH:II:SS格式或HH:II:SS格式
     * @param {String} v - 需要渲染的字符串
     * @return {String} 渲染结果
     */
    formatDateDtl(v) {
        v = v.toString();
        let len = v.length;
        if (len == 14 || len == 12) {
            //转为YYYY-MM-DD HH:II:SS || YYYY-MM-DD HH:II
            return (
                v.substr(0, 4) +
                "-" +
                v.substr(4, 2) +
                "-" +
                v.substr(6, 2) +
                " " +
                v.substr(8, 2) +
                ":" +
                v.substr(10, 2) +
                (len == 14 ? ":" + v.substr(12, 2) : "")
            );
        } else if (len == 8) {
            //转为YYYY-MM-DD
            return v.substr(0, 4) + "-" + v.substr(4, 2) + "-" + v.substr(6, 2);
        } else if (len == 6 || len == 4) {
            //转为HH:II:SS || HH:II
            return (
                v.substr(0, 2) +
                ":" +
                v.substr(2, 2) +
                (len == 6 ? ":" + v.substr(4, 2) : "")
            );
        }
    }
};
Vue.prototype.$tools = tools;

export default tools;
