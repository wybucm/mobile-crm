/**
 * 方便开发的debug文件之绕过原生处理
 */
import Vue from 'vue';

document.addEventListener("keypress", function (e) {
    if (e.shiftKey && e.keyCode == 33) {
        let _e = document.createEvent('HTMLEvents');
        _e.initEvent('backbutton');
        document.dispatchEvent(_e);
    }
}, false);

//为有事件的dom元素增加data-test-on属性
Vue.mixin({
    mounted() {
        if (this.$listeners && this.$el.dataset) {
            this.$el.dataset.testOn = Object.keys(this.$listeners).join(';')
        }
        this._vnode.children && this._vnode.children.forEach((item) => {
            if (!item.componentInstance && item.data && item.data.on) {
                item.elm.dataset.testOn = Object.keys(item.data.on).join(';')
            }
        });
    }
});