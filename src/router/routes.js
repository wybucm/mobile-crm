/**
 * 路由页面
 * 各项配置：
 *      {Object} [meta] - 元信息，内置的meta包括：
 *          {String} anchor - 锚点，与$go()和$back()配合使用
 *      {Object} [metaPass] - 会向下传递的元信息，内置的metaPass包括：
 *          {Boolean} requiresAuth - 是否需要登录后才能进入。如果未登录则自动进入登录页面
 *          {Boolean} keepAlive - 是否始终缓存
 */

export default [{
    path: '/home',
    metaPass: {
        keepAlive: true
    },
    component: (resolve) => {
        require(['#/home/index'], resolve);
    }
}, { // 自定义 /custom
    path: '/custom',
    component: (resolve) => {
        require(['#/home/custom'], resolve);
    },
}, { // 每日战报 /dailyWork
    path: '/dailyWork',
    component: (resolve) => {
        require(['#/dailyWork/index'], resolve);
    },
}, { //设置 /setting/index
    path: '/setting',
    component: (resolve) => {
        require(['#/setting/index'], resolve)
    }
}, { //职位变动 /position
    path: '/position',
    component: (resolve) => {
        require(['#/setting/position'], resolve)
    }
}, { //字体变动 /fontSetting
    path: '/fontSetting',
    component: (resolve) => {
        require(['#/setting/fontSetting'], resolve)
    }
}, { //工作日程 /schedule
    path: '/schedule',
    component: (resolve) => {
        require(['#/schedule/schedule'], resolve)
    }
}, { //修改线索
    path: '/updateSchedule',
    component: (resolve) => {
        require(['#/schedule/updateSchedule'], resolve);
    }
}, { //日程详情 /scheduleDetail
    path: '/scheduleDetail',
    component: (resolve) => {
        require(['#/schedule/scheduleDetail'], resolve)
    }
}, { //更多关联提醒 /moreSchedule
    path: '/moreSchedule',
    component: (resolve) => {
        require(['#/schedule/moreSchedule'], resolve)
    }
}, { // 通话管理
    path: '/record',
    component: (resolve) => {
        require(['#/record/recordBase'], resolve)
    }
}, { // 客户服务
    path: '/service',
    component: (resolve) => {
        require(['#/service/index'], resolve)
    }
}, { // 客户管理
    path: '/manageClient',
    component: (resolve) => {
        require(['#/service/manageClient'], resolve)
    }
}, { // 客户信息详情
    path: '/queryDetail',
    component: (resolve) => {
        require(['#/service/queryDetail'], resolve)
    }
},, { //工作管理首页
    path: '/workManageIndex',
    component: (resolve) => {
        require(['#/workManage/index'], resolve);
    }
}, { //销售支持
    path: '/sellingSupport',
    component: (resolve) => {
        require(['#/workManage/sellingSupport'], resolve);
    }
}, { //客户提醒首页
    path: '/clientIndex',
    component: (resolve) => {
        require(['#/clientRemind/index'], resolve);
    },
}, { //消息提醒
    path: '/messageWarm',
    component: (resolve) => {
    require(['#/commonPage/clueList/index'], resolve);
    },
},{ //线索与任务列表
    path: '/clueList',
    component: (resolve) => {
        require(['#/commonPage/clueList/index'], resolve);
    }
}, { //线索与任务列表
    path: '/personal',
    component: (resolve) => {
        require(['#/commonPage/clueList/personal'], resolve);
    }
}, { //创建线索
    path: '/createClue',
    component: (resolve) => {
        require(['#/commonPage/clueProcess/createClue'], resolve);
    }
}, { //创建or设置日程
    path: '/setSchedule',
    component: (resolve) => {
        require(['#/commonPage/clueProcess/setSchedule'], resolve);
    }
}, { //线索or任务登记
    path: '/finish',
    component: (resolve) => {
        require(['#/commonPage/clueProcess/finish'], resolve);
    }
}, { // 选择证件
    path: '/identificationType',
    component: (resolve) => {
        require(['#/identificationType/index'], resolve);
    }
}, { // 选择营销活动
    path: '/activity',
    component: (resolve) => {
        require(['#/activity/index'], resolve);
    }
}];