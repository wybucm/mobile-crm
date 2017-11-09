/**
 * 负责引入与安装各个控件
 *
 * 手势优先级：
 * gGesturesState手势优先级管理： 
 *  -type-							-level-
 *  picker   底部选择器                100
 *  carousel 轮播图                     50
 *  scroller 滚动控制器                 10
 * 
 * zIndex管理：
 *  3000    vMenu
 *  5000    vPicker
 * 10000    vLoading
 * 10005    vAlert
 * 10010    vMessage
 */

import Vue from 'vue';
import * as vButton from './button';
import * as vCarousel from './carousel';
import * as vCheckbox from './checkbox';
import * as vFooter from './footer';
import * as vForm from './form';
import * as vGrid from './grid';
import * as vHeader from './header';
import * as vInput from './input';
import * as vLoading from './loading';
import * as vMenu from './menu';
import * as vMessage from './message';
import * as vPage from './page';
import * as vPicker from './picker';
import * as vRadio from './radio';
import * as vRouterView from './routerView';
import * as vScroller from './scroller';
import './common';

const cmps = {
    ...vButton, //按钮
    ...vCarousel, //轮播图
    ...vCheckbox, //复选框
    ...vFooter, //底部标签栏
    ...vGrid, //九宫格
    ...vHeader, //标题栏
    ...vInput, //输入框
    ...vLoading, //加载框
    ...vForm, //表单
    ...vMessage, //提示框
    ...vMenu, //弹出菜单
    ...vPage, //页面容器
    ...vPicker, //底部选择器
    ...vRadio, //单选框
    ...vRouterView, //路由视图
    ...vScroller, //滚动控制器
};
for (let k in cmps) {
    Vue.component(k, cmps[k]);
}