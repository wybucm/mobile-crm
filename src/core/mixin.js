//全局混合
import Vue from 'vue'

Vue.mixin({
    beforeCreate() {
        //0、获取路由匹配的页面实例（包括父路由）
        let route = this.$route;
        if (route && route.path != '/') {
            let routePath = this.$vnode.componentOptions.Ctor.extendOptions._uxPath;
            //1、处理特殊数据
            if (routePath) { //有_uxPath，代表这是一个页面实例
                if (this.$options.data) {
                    let data = this.$options.data(), //初始数据
                        pVm, //父实例
                        extraData = {}; //特殊数据
                    this._extraUnbinds = []; //处理特殊数据时，额外增加的watch的解绑函数
                    this._extraWatch = {}; //特殊数据包含双向绑定时，额外增加的watch（解决Vue实例在beforeCreate不能watch的问题）
                    for (let k in data) {
                        let targetVm;
                        if (k.indexOf('@') != -1) { //此字段是特殊作用域字段
                            let arr = k.split('@'),
                                key = arr[0], //本作用域的字段名
                                valKey = data[k] || key, //目标作用域的字段名
                                flags = arr[1].split('.'); //作用域与各修饰符
                            if (!flags[0] || flags[0] == 'p') { //使用父路由的data
                                if (!pVm) {
                                    pVm = findParentRouteVm(this);
                                    if (!pVm) continue;
                                }
                                targetVm = pVm;
                                extraData[key] = targetVm[valKey];
                                delete data[k];
                                if (flags.indexOf('once') == -1) {
                                    this._extraUnbinds.push(targetVm.$watch(valKey, (newVal) => { //观测父实例的字段
                                        this[key] = newVal;
                                    }));
                                }
                            }
                            if (flags.indexOf('sync') != -1) { //双向绑定
                                this._extraWatch[key] = {
                                    vm: targetVm,
                                    key: valKey
                                };
                            }
                        }
                    }
                    if (this._extraUnbinds.length) { //存在特殊数据，则重载data
                        Object.assign(data, extraData);
                        this.$options.data = () => data;
                    }
                }
                //2、注入页面参数
                let matched = route.matched.last();
                if (this == matched.instances.default) { //页面实例是当前路由
                    this.$params = matched._uxParams;
                    delete matched._uxParams;
                }
            }
        }
    },
    created() {
        //根据双向绑定的特殊数据，观测指定字段
        for (let k in this._extraWatch) {
            let vm = this._extraWatch[k].vm,
                key = this._extraWatch[k].key;
            this.$watch(k, newVal => {
                vm[key] = newVal;
            });
        }
        delete this._extraWatch;
    },
    activated() {
        let route = this.$route;
        if (route && route.path != '/') {
            let matched = route.matched.last();
            if (this == matched.instances.default && !this.$tools.isEmpty(matched._uxParams)) { //页面实例是当前路由 && 存在路由参数（针对back）
                Object.assign(this.$params, matched._uxParams); //合并页面参数
                delete matched._uxParams;
            }
        }
    },
    destroyed() {
        //解绑额外增加的目标作用域的watch
        this._extraUnbinds && this._extraUnbinds.forEach(item => item());
    }
});
//寻找父路由实例
function findParentRouteVm(vm) {
    for (let matched = vm.$route.matched, i = matched.length - 1; i > 0; i--) {
        if (matched[i].instances.default == vm) {
            return matched[i - 1].instances.default;
        }
    }
}