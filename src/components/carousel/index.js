/**
 * 幻灯片
 *
 * carousel（幻灯片容器）*********************
 * @prop {Number} [w-h-ratio] - 宽高比例，用于设置高度
 * @prop {Number} [index=0] - 默认显示的下标
 * @prop {Boolean} [looped=true] - 是否循环无缝播放
 * @prop {Boolean} [interval=3000] - 自动播放的间隔，ms，0代表不自动播放。仅在looped=true时有效
 * @prop {Boolean} [nav=true] - 是否显示导航器
 * 
 * @attribute {Number} activeIndex - 当前下标
 *
 * @method setActiveItem - 切换幻灯片
 * @param {Number} index - 要切换的下标
 * 
 * @event click - 点击幻灯片触发
 * @param {Number} index - 当前下标
 * @param {Number} e - event对象
 * 
 * @event change - 切换幻灯片触发
 * @param {Number} index - 切换后下标
 *
 * 
 * carouselItem（幻灯片子元素）*****************
 * @prop {String} [src] - 图片路径，如果设置则会自动添加<img>标签
 * 
 * @slot 内容
 * 
 * @example
 * <v-carousel :w-h-ratio1="2">
 *     <v-carousel-item v-for="item in items" :key="item" :src="'static/img/'+item"/>
 * </v-carousel>
 */
export { default as vCarousel } from './carousel'
export { default as vCarouselItem } from './carouselItem'