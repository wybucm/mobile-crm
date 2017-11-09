/**
 * 底部标签栏
 * @auth by Lidc 2017-07-17
 *
 * @prop {Array} tabs - 各标签
 * @prop {String} tabs.icon - 图标，省略前缀icon-
 * @prop {String} tabs.text - 文本
 * @prop {Number} [index=0] - 选中的下标
 *
 * @event switch 点击切换时触发
 * @param {Number} index - 选中的下标
 *
 * @example
 * <v-footer :tabs="tabs"></v-footer>
 *
 * tabs: [{
 *        icon: 'home3',
 *        text: '首页'
 *    }, {
 *        icon: 'share2',
 *        text: '理财'
 *    }, {
 *        icon: 'user',
 *        text: '资产'
 *    }, {
 *       icon: 'menu',
 *        text: '更多'
 *    }]
 */
export {default as vFooter} from './footer'