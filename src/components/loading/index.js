/**
 * 加载框
 *
 * @prop {Number} [type=1] - 请求类型，1(默认)-加载 2-提交
 * @prop {String} [text] - 文本，默认type=1为“正在加载...”，2为“正在处理...”
 * @slot 与text一致
 *
 * @desc 对Vue实例注入$loading，可操作一个loading的单例，ex. vm.$loading(true);
 *
 * @example
 * <v-loading :show="true"></v-loading>
 */
import Vue from 'vue';
/**
 * 对Vue实例注入，用于操作loading单例
 * @param {Boolean} [visible=true] - 显示与否
 * @param {Number} [type=1] 请求类型，1(默认)-加载 2-提交
 * @param {String} [text] 文本，默认type=1为“正在加载...”，2为“正在处理...”
 */
Vue.prototype.$loading = function(visible=true, type = 1, text){
    $rootVm.loadingType = type;
    $rootVm.loadingText = text;
    $rootVm.setLoadingVisible(visible);
};

export {default as vLoading} from './loading'