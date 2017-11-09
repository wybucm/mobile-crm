/**
 * 对一些库的源码修改
 * 修改node_modules/vue/src/core/components/keep-alive.js
 * 1、修正<keep-alive>使用include指令有时并不会销毁Vue实例的bug
 * 2、获取组件name标识时，增加_uxPath判断，实现历史页面自动缓存
 */
import Vue from 'vue'

Vue.options.components.KeepAlive.watch.include = function (val) {
    pruneCache(this.cache, this._vnode, name => matches(val, name));
}
function pruneCache(cache, current, filter) {
    for (var key in cache) {
        var cachedNode = cache[key];
        if (cachedNode) {
            var name = getComponentName(cachedNode.componentOptions);
            if (name && !filter(name)) {
                // if (cachedNode !== current) { /* override: 去掉此判断，只要满足filter条件则销毁实例 */
                pruneCacheEntry(cachedNode);
                // }
                cache[key] = null;
            }
        }
    }
}
/* override: 获取组件name时，增加_uxRouteName判断，与router的处理遥相呼应 */
function getComponentName(opts) {
    return opts && (opts.Ctor.options.name || opts.tag || opts.Ctor.extendOptions._uxPath);
}
/* end of override */

/*************************** 以下仅是解决无法访问闭包函数而拷贝出来的源码 *******************************/
Vue.options.components.KeepAlive.render = function () {
    const vnode = getFirstComponentChild(this.$slots.default)
    const componentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
        // check pattern
        const name = getComponentName(componentOptions)
        if (name && (
            (this.include && !matches(this.include, name)) ||
            (this.exclude && matches(this.exclude, name))
        )) {
            return vnode
        }
        const key = vnode.key == null
            // same constructor may get registered as different local components
            // so cid alone is not enough (#3269)
            ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
            : vnode.key
        if (this.cache[key]) {
            vnode.componentInstance = this.cache[key].componentInstance
        } else {
            this.cache[key] = vnode
        }
        vnode.data.keepAlive = true
    }
    return vnode
}

function pruneCacheEntry(vnode) {
    if (vnode) {
        vnode.componentInstance.$destroy();
    }
}

function matches(pattern, name) {
    if (typeof pattern === 'string') {
        return pattern.split(',').indexOf(name) > -1
    } else if (isRegExp(pattern)) {
        return pattern.test(name)
    }
    /* istanbul ignore next */
    return false
}
function getFirstComponentChild(children) {
    if (Array.isArray(children)) {
        for (let i = 0; i < children.length; i++) {
            const c = children[i]
            if (isDef(c) && isDef(c.componentOptions)) {
                return c
            }
        }
    }
}
function isDef(v) {
    return v !== undefined && v !== null
}