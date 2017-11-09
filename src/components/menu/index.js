/**
 * 弹出菜单
 *
 * @prop {Array} items - 菜单项数据，每项包含：text-文本
 * @prop {String} anchor - 锚点元素的ref值，菜单会自动指向锚点
 *
 * @method open - 展开菜单
 * 
 * @method close - 收起菜单
 * 
 * @event click - 点击菜单项触发
 * @param {Number} index - 菜单项下标
 * @param {Event} e - 事件对象
 *
 * @example
 * <v-menu :items="menuItems" anchor="a1"/>
 */
export { default as vMenu } from './menu'