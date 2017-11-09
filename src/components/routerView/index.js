/**
 * 对<router-view>二次封装：
 * 1、自动缓存历史页面
 *
 * @prop {Boolean} [noTransition=false] - 是否不启用动画
 * @prop {String} [transition="slide"] - 动画名称，可选"slide"-滑动/"none"-无动画，noTransition=false时有效
 * 
 * @desc 
 * 
 * @example
 * <v-page>
 *     <main>
 *          ...内容...
 *     </main>
 * </v-scroller>
 */

export { default as vRouterView } from './routerView'