/**
 * 九宫格
 *
 * @prop {Array} items - 宫格数组，每项需包含icon（图标）和text（文本）
 * @prop {Boolean} [editable] - 是否编辑模式，编辑模式下可拖拽交换位置
 *
 * @event click - 点击触发
 * @param {Object} item - 点击的项的数据
 * @param {Number} index - 点击的下标
 * @param {Event} e - 事件对象
 * 
 * @event change - 拖拽交换位置后触发
 * @param items - 拖拽后的宫格数组
 *
 * @example
 * <v-grid :items="items"/>
 */
export { default as vGrid } from './grid'