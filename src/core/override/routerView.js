/**
 * 对一些库的源码修改
 * 修改node_modules/vue-router/src/components/view.js
 * 1、修改历史页面自动缓存的情况下，解决跳转到父路由已缓存的页面时，子路由不切换的bug
 * 2、修改历史页面自动缓存的情况下，解决跨页面返回 && 返回前后的路由的父亲不一致时，返回后子路由不切换的bug
 */
import Vue from 'vue'

Vue.options.components['router-view'].options.render = function (_, { props, children, parent, data }) {
    data.routerView = true
    // directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots
    const h = parent.$createElement
    const name = props.name
    const route = parent.$route
    const cache = parent._routerViewCache || (parent._routerViewCache = {})
    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    let depth = 0
    let inactive = false
    while (parent && parent._routerRoot !== parent) {
        if (parent.$vnode && parent.$vnode.data.routerView) {
            depth++
        }
        if (parent._inactive) {
            inactive = true
        }
        parent = parent.$parent
    }
    data.routerViewDepth = depth

    // render previous view if the tree is inactive and kept-alive

    /**
     * override:
     * 页面跳转时，同一个router-view会render2次（原本如此，不知为何）
     * 
     * 修改内容：
     * 1、跳转已缓存父路由的页面时，目标页面在第二次render时，
     *  不使用_routerViewCache缓存，而是重新计算渲染
     * 2、跨页返回时，目标页面在第二次render时，
     *  不使用_routerViewCache缓存，而是重新计算渲染
     */
    const matched = route.matched[depth]
    if (inactive) {
        if (Object.getDeepValue(matched, 'components', 'default')) {
            const router = parent.$router;
            if(router._uxStep > 0 && matched.path == router._uxPath){
            }else if(router._uxStep < -1 && matched.components.default._uxInactive && matched.path == router._uxPath){
            }else{
                matched.components.default._uxInactive = true;
                return h(cache[name], data, children);
            }
        }else{
            return h(cache[name], data, children);
        }
    }
    /** end of override */

    // render empty node if no matched route
    if (!matched) {
        cache[name] = null
        return h()
    }

    const component = cache[name] = matched.components[name]

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    data.registerRouteInstance = (vm, val) => {
        // val could be undefined for unregistration
        const current = matched.instances[name]
        if (
            (val && current !== vm) ||
            (!val && current === vm)
        ) {
            matched.instances[name] = val
        }
    }

        // also regiseter instance in prepatch hook
        // in case the same component instance is reused across different routes
        ; (data.hook || (data.hook = {})).prepatch = (_, vnode) => {
            matched.instances[name] = vnode.componentInstance
        }

    // resolve props
    data.props = resolveProps(route, matched.props && matched.props[name])
    return h(component, data, children)
}

/*************************** 以下仅是解决无法访问闭包函数而拷贝出来的源码 *******************************/
function resolveProps(route, config) {
    switch (typeof config) {
        case 'undefined':
            return
        case 'object':
            return config
        case 'function':
            return config(route)
        case 'boolean':
            return config ? route.params : undefined
        default:
            if (process.env.NODE_ENV !== 'production') {
                warn(
                    false,
                    `props in "${route.path}" is a ${typeof config}, ` +
                    `expecting an object, function or boolean.`
                )
            }
    }
}

function isDef(v) {
    return v !== undefined && v !== null
}