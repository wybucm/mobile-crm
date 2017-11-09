/**
 * 滚动控制器
 * @auth by Lidc 2017-07-17
 *
 * @prop {Boolean} [to-refresh=false] - 是否开启下拉刷新
 * @prop {Boolean} [to-load-more=false] - 是否开启上拉加载
 * @prop {Boolean} [out-top=false] - 是否允许下拉出界，toRefresh=true时强制true
 * @prop {Boolean} [out-bottom=false] - 是否允许上拉出界，toLoadMore=true时强制true
 *
 * @method update - 刷新高度，高度改变后调用
 *
 * @method end - 结束刷新和加载（回弹、重算高度），会自动调用update()
 * @param {object} opts - 参数
 * @param {Boolean} [opts.nomore=false] - 是否无更多数据
 *
 * @method scrollTo - 滚动到指定位置
 * @param {Number} y - 目标y坐标
 * @param {Number} [duration=100] - 滚动动画时间，毫秒
 *
 * @event refresh - 下拉刷新触发
 * @event loadmore - 上拉加载触发
 * @event scroll - 滚动时触发
 * 
 * @desc vScroller必须是独生子，不能有兄弟节点（否则高度计算会有问题）
 * @desc vScroller的父元素不能是display:flex或者box
 * @desc 下拉刷新和上拉加载后，要手动调用end结束加载状态（回弹、重算高度）
 *
 * @example
 * <v-scroller>
 *     ...内容...
 * </v-scroller>
 */
export {default as vScroller} from './scroller'