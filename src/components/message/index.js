/**
 * 消息框
 *
 * toast 消息框 ***********************************
 * @prop {Numner} [token=1] - 控制显示的token值，每次显示时+1
 * @prop {Number} [remain=2000] - 显示时间，ms
 * @slot 消息文本
 *
 * @desc 对Vue实例注入$toast，可操作一个toast的单例，ex. vm.$toast('消息提示');
 *
 * @example
 * <v-toast>消息提示</v-toast>
 *
 * alert 提示框 ***********************************
 * @prop {Boolean} [confirm=false] - 是否确认提示框，true两个按钮，false则一个按钮
 * @prop {String} [title] - 标题
 * @prop {String|Array} [buttonText] - 按钮文本，
 *                                      confirm=true时，buttonText为String代表右按钮文本，Array代表双按钮文本，默认为['取消','确定']；
 *                                      confirm=false时，只能为String，默认'确定'
 * @prop {Boolean} [closable=true] - 是否可通过物理返回键关闭，且右上角是否有×
 * @prop {Function|Array} [callback] - 按钮回调函数，
 *                                      confirm=true时，callback为Function代表右按钮回调，Array代表双按钮回调；
 *                                      confirm=false时，只能为Function
 * @prop {Object} [input] - 输入框配置，当设置以后会在提示信息下方显示提示框
 * @prop {String} [input.value] - 输入框默认值
 * @prop {Number} [input.maxlength] - 输入框的最大字数限制
 * 
 * @slot 提示信息
 * 
 * @desc 对Vue实例注入$alert，可操作一个confirm=false的alert单例，ex. vm.$alert('提示信息');
 * @desc 对Vue实例注入$confirm，可操作一个confirm=true的alert的单例，ex. vm.$confirm({text: '提示信息'});
 * 
 * @example
 * <v-alert>提示信息</v-alert>
 */
import Vue from 'vue';
/**
 * 对Vue实例注入，用于操作toast单例
 * @param {String} text - 消息文本
 */
Vue.prototype.$toast = function (text) {
    $rootVm.toastText = text;
    $rootVm.toast();
};
/**
 * 对Vue实例注入，用于操作alert单例
 * @param {Object|String} opts - 配置项，如果String则代表提示文本
 * @param {String} opts.text - 提示文本
 * @param {String} [opts.title] - 标题
 * @param {String} [opts.buttonText="确定"] - 按钮文本
 * @param {String} [inputValue] - 输入框默认值，如果设置，则正文下方显示输入框
 * @param {String} [inputType='text'] - 输入框类型
 * @param {String} [inputMaxlength] - 输入框最大长度
 * @param {Boolean} [opts.closable=true] - 右上角是否带关闭按钮
 * @param {Function} [opts.callback] - 点击按钮的回调函数，参数：event，返回false可阻止关闭提示框
 */
Vue.prototype.$alert = function ({ text, title, buttonText, inputValue, inputType='text', inputMaxlength, closable, callback }) {
    let opts = arguments[0];
    if (typeof (opts) == 'string') { //参数是字符串，则代表text
        opts = {
            text: opts
        }
    }
    $rootVm.alertList.push(opts);
};
/**
 * 对Vue实例注入，用于操作alert单例
 * @param {Object} opts - 配置项
 * @param {String} opts.text - 提示文本
 * @param {String} [opts.title] - 标题
 * @param {Array|String} [opts.buttonText=["取消","确定"]] - 左右按钮的文本，如果String则代表右按钮的文本
 * @param {Number} [opts.focus=1] - 聚焦哪个按钮，0-左，1-右
 * @param {String|Object} [input]
 * @param {Boolean} [closable=true] - 右上角是否带关闭按钮
 * @param {Array|Function} [callback] - 左右按钮的回调函数，参数：event，返回false可阻止关闭提示框，如果Function则代表右按钮的回调函数
 */
Vue.prototype.$confirm = function ({ text, title, buttonText,focus, closable, callback }) {
    let opts = arguments[0];
    opts.confirm = true;
    $rootVm.alertList.push(opts);
};
/**
 * 关闭最顶层的提示框（仅限使用$alert、$confirm弹出的提示框）
 */
Vue.prototype.$close = () => $rootVm.close();
/**
 * 关闭所有提示框（仅限使用$alert、$confirm弹出的提示框）
 */
Vue.prototype.$closeAll = () => $rootVm.closeAll();

export { default as vAlert } from './alert'
export { default as vToast } from './toast'