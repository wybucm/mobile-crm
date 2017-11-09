/**
 * 程序入口
 *
 * 全局变量：
 *      $rootVm     - {Vue} 顶层Vue实例，对应App.vue
 * 
 * Vue实例注入：
 *      1)工具类
 *          vm.$tools       - {Object} 工具函数，见./common/js/tools
 *          VM.$message     - {Function} 统一话术，见./common/js/message
 *          vm.$validator   - {object} 校验工具集，见./common/js/validator
 *          vm.$equipment   - {Object} 设备信息，见./main
 *      2)路由相关
 *          vm.$go          - {Function} 跳转页面，见./router
 *          vm.$back        - {Function} 返回上一页，见./router
 *          vm.$params      - {Object} 页面参数，见vm.$go()和vm.$back()
 *      3)控件相关
 *          vm.$loading     - {Function} 控制加载框的显示与否，见./components/loading
 *          vm.$toast     - {Function} 消息框，见./components/message
 *          vm.$alert       - {Function} 提示框，见./components/message
 *          vm.$confirm     - {Function} 确认提示框，见./components/message
 *          vm.$close       - {Function} 关闭最顶层的提示框，见./components/message
 *          vm.$closeAll    - {Function} 关闭所有提示框，见./components/message
 * 
 * Vue实例的数据扩展：
 *      1)作用域
 *          p       - 绑定父路由的字段，可省略
 *      2)修饰符
 *          sync    - 双向绑定，自身的修改会触发指定作用域字段的变更
 *          once    - 仅绑定一次，之后指定作用域字段的修改不会触发自身变更（即仅取默认值）
 *      说明：
 *          分隔符为@，分隔符前为自身字段名，分隔符后为作用域和修饰符，值为指定作用域的字段名，如“'myKey@p': 'thatKey'”，
 *          绑定后，自身字段会赋值为目标字段的值，且目标字段修改会自动触发自身的修改。
 *      ex.
 *          data(){
 *             return {
 *                  'key1@p': 'thatKey', //自身字段key1绑定父路由的字段thatKey
 *                  'key2@': '', //未指定作用域，则取默认值p；未指定目标字段名，则取自身字段名key2
 *                  'key3@.once': 'thatKey' //key3的初始值为父路由的thatKey的值，之后thatKey修改不会影响key3
 *             }
 *          }
 */
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import './common/js';
import './components';
import './core/override';
import './core/mixin';
import './http';
import './common/css/base';

import 'vue-event-calendar/dist/style.css' //1.1.10之后的版本，css被放在了单独的文件中，方便替换
import vueEventCalendar from 'vue-event-calendar'
Vue.use(vueEventCalendar, {locale: 'zh'}) //可以设置语言，支持中文和英文

Vue.config.productionTip = false; //生产环境不打印日志
init(); //初始化

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {
        App
    },
});
//初始化
function init() {
    //设置<html>的fontSize，作为rem的基数
    let getFont = window.localStorage.getItem('localFont');
    if(getFont == null){
        let fontSize = (innerWidth * 100 / 414).toFixed(0);
        document.getElementsByTagName('html')[0].style.fontSize = fontSize + '%';
    }else{
        let getFontSize = getFont;
        let fontSize = (innerWidth * 100 / 414 * getFontSize).toFixed(0);
        document.getElementsByTagName('html')[0].style.fontSize = fontSize + '%';
    }
    
    //测试环境，引入测试代码
    if (process.env.NODE_ENV == 'development') {
        require('./test');
    }
    /** 注入$equipment，设备信息 */
    let cssPre = '',
        os = navigator.userAgent.indexOf('iPhone') > -1 ? 'ios' : 'android';
    if (document.body.style.webkitBorderImage !== undefined) {
        cssPre = '-webkit-';
    }
    Vue.prototype.$equipment = {
        cssPre, //css前缀，如-webkit-等
        os, //操作系统，ios/android
    };
    //监听物理返回键
    if (os == 'android') {
        document.addEventListener('backbutton', () => {
            //关闭提示框
            if ($rootVm.$close()) return;
            //返回上一页
            if ($rootVm.$back()) return;
            //双击退出APP
            $rootVm.$message('再按一次退出应用');
        }, false);
    }
    //在body添加操作系统对应样式
    document.body.classList.add(os);
}