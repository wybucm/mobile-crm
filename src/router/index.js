import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'

Vue.use(Router);

const pageHistory = ['home']; //页面历史，用于$back()时计算go的步数
let pageParams = {}; //页面参数，$go与$back用

//注入$go、$back
Object.assign(Vue.prototype, {
    /**
     * 跳转页面
     * @param {object|string} opts - 参数，如果string类型则代表页面路径
     * @param {string} opts.path - 页面路径
     * @param {object} [opts.params={}] - 页面参数，用vm.$params获取
     * @param {boolean|number|string} [opts.back=true] - 指定下一页返回的上页是哪个页面，可取值：
     *              true - 下一页返回到本页
     *              false - 下一页返回到上一页
     *              负整数 - 下一页返回时向前跳的页面数，-1与false一致，-2则上一页的上一页，如此类推
     *              'empty' - 清空历史页面
     *              ':'+ 锚点 - 返回到指定锚点页面的上一页，锚点在route设置
     *              页面路径 - 下一页返回到指定路径的页面，必须绝对路径
     * @param {String} [opts.transition] - 跳转动画，可选'slide'-滑动/'none'-无动画，默认为<v-router-view>的transition-name
     * @param {Boolean} [opts.reverse] - 跳转方向是否相反
     */
    $go({
        path,
        params = {},
        back = true,
        transition = '',
        reverse = false
    }) {
        //1、变量处理
        if (typeof (arguments[0]) == 'string') { //参数是字符串，则代表path
            path = arguments[0];
        }
        let route = getRoute(path);
        path = route.path; //完整路径
        //2、校验权限
        if (route.meta.requiresAuth && !this.$store.state.logined) { //需要登录且未登录，则跳转登录页
            this.$go({
                path: '/login',
                params: {
                    nextPath: path,
                    nextBack: back
                }
            });
            return;
        }
        if (route.meta.keepAlive) { //元信息指定始终缓存
            this.$store.commit('keepForever', path);
        }
        //3、根据back，处理页面缓存
        let keepPages = [...$rootVm.$store.state.keepPages];
        if (back === true) {} else if (back === false) {
            keepPages.pop();
        } else if (typeof back == 'number') {
            keepPages.splice(keepPages.length + back);
        } else if (back == 'empty') {
            keepPages = [];
        } else if (typeof back == 'string') {
            if (back[0] == ':') { //锚点
                let anchor = back.substr(1),
                    index = keepPages.findIndex(v => {
                        if (v.anchor == anchor) return true;
                    });
                if (index > -1) {
                    keepPages.splice(index);
                }
            } else { //指定页面路径
                let index = keepPages.findIndex(v => {
                    if (v.path == back) return true;
                });
                if (index > -1) {
                    keepPages.splice(index + 1);
                }
            }
        }
        pageHistory.push(path);
        keepPages.push({
            path,
            transition,
            anchor: route.meta.anchor
        });
        $rootVm.$store.commit('keepPages', keepPages); //更改缓存记录
        //4、跳转
        pageParams = params;
        $rootVm.$store.commit('routerTransitionName', transition); //跳转动画
        $rootVm.$store.commit('routerTransitionReverse', reverse); //跳转方向
        router._uxPath = path;
        router._uxStep = 1;
        router.push(path); //利用vue-router跳转
    },
    /**
     * 返回上一页
     * @param {Object} [opts] - 配置项
     * @param {object} [opts.params] - 传递给上一页的参数，会与上一页参数合并且优先级更高
     * @param {string} [opts.back] - 指定返回那个页面，可以取值：
     *                              ':'+ 锚点 - 返回到指定锚点页面的上一页，锚点在route设置
     *                              页面路径 - 下一页返回到指定路径的页面，必须绝对路径
     *                          注意：指定页面必须在导航历史上，且没有被$go()的back参数排除掉。
     * @param {String} [opts.transition] - 跳转动画，可选'slide'-滑动/'none'-无动画，默认为$go进来此页面的transition
     * @return {Boolean} 如果存在上一页，则返回true，否则false
     */
    $back({
        params,
        back,
        transition = ''
    } = {}) {
        let keepPages = [...$rootVm.$store.state.keepPages],
            step = -1, //向前翻的步数
            historyLen = pageHistory.length,
            handled = false; //是否在历史路径中找到指定的上一页
        if (keepPages.length <= 1) return false; //不存在上一页
        let lastPage = keepPages.pop(); //弹出当前页面
        //1、寻找上一页
        if (back) { //指定了具体的上一页，则寻找上一页的位置
            if (typeof back == 'string') {
                if (back[0] == ':') { //锚点
                    let anchor = back.substr(1),
                        index = keepPages.findIndex(v => {
                            if (v.anchor == anchor) return true;
                        });
                    if (index > -1) {
                        let removedPages = keepPages.splice(index);
                        index = pageHistory.findIndex(v => {
                            if (v == removedPages[0].path) return true;
                        });
                        step = index - historyLen;
                        handled = true;
                    }
                } else { //指定页面路径
                    let index = keepPages.findIndex(v => {
                        if (v.path == back) return true;
                    });
                    if (index > -1) {
                        keepPages.splice(index + 1);
                        index = pageHistory.findIndex(v => {
                            if (v == back) return true;
                        });
                        step = index - historyLen + 1;
                        handled = true;
                    }
                }
            }
        }
        if (!handled) {
            const lastPath = keepPages.last().path;
            for (let i = historyLen - 2; i >= 0; i--) {
                if (pageHistory[i] == lastPath) {
                    step = i - historyLen + 1;
                    break;
                }
            }
        }
        //2、跳转
        pageHistory.splice(historyLen + step);
        pageParams = params;
        $rootVm.$store.commit('keepPages', keepPages); //更改缓存记录
        $rootVm.$store.commit('routerTransitionName', transition || lastPage.transition); //跳转动画（根据跳转进来的动画决定）
        $rootVm.$store.commit('routerTransitionReverse', true); //跳转方向
        router._uxPath = keepPages.last().path;
        router._uxStep = step;
        router.go(step);
        return true;
    }
});
//补充路由信息
function initRoutes(arr, metaPass = {}) {
    arr.forEach(item => {
        item.metaPass = Object.assign(item.metaPass || {}, metaPass); //向下传递metaPass
        item.meta = Object.assign({}, item.metaPass, item.meta || {}); //把metaPass合并到meta
        if (item.children) {
            initRoutes(item.children, item.metaPass);
        }
        delete item.metaPass;
    });
}
initRoutes(routes);

const router = new Router({
    routes
});
router.beforeEach((to, from, next) => {
    to.matched.forEach(item => {
        item.components.default._uxInactive = false; //重置router-view判断是否第二次render的标志，供core/override/routerView使用
    });
    next();
});
/**
 * 跳转后导航钩子，比组件的beforeCreated更早触发
 */
router.afterEach(route => {
    if (route.path != '/') { //排除首个路由
        route.matched.forEach(item => {
            item.components.default._uxPath = item.path; //添加用于keepAlive的include缓存的_uxPath，供core/override/keepAlive使用
        });
        route.matched.last()._uxParams = pageParams;
        $rootVm.$store.commit('gesture'); //还原手势状态
    }
});
//根据地址获取路由信息
function getRoute(path) {
    if (path.charAt(0) != '/') { //相对路径跳转，则把前缀补全
        for (let matched = $rootVm.$route.matched, i = 0; i < matched.length - 1; i++) {
            path = matched[i].path + '/' + path;
        }
    }
    return router.match(path);
}
export default router;