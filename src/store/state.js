//状态
const state = {
    logined: false, //是否已登录
    /** private */
    keepPages: [], //面包屑导航中缓存的页面
    keepForever: [], //始终缓存的页面，路由的meta定义keepAlive:true的页面
    routerTransitionName: 'none', //跳转页面的动画名称
    routerTransitionReverse: false, //动画方向是否相反
    gesture: { //当前手指触摸的组件信息，用于避免控件间手势冲突
        name: '', //组件名
        level: -1, //手势优先级
        id: '' //实例id
    }
    /** end of private */
};

export default state;