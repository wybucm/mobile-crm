/**
 * 按钮
 *
 * @prop {String} [icon] - 左图标，省略icon-前缀
 * @prop {String} [icon-r] - 右图标，省略icon-前缀
 * @prop {Boolean} [loading=false] - 是否正在加载
 * @prop {String} [loadingText=$slots.default] - 加载中的文本
 * 
 * @slot {String} 按钮文本
 *
 * @attribute class - 可添加样式：white(白色按钮)、blue(蓝色按钮)、gray(灰色按钮)、wide(增加文字间距)、inline(行内)
 *
 * @event click - 点击触发
 *
 * @example
 * <v-button>登录</v-button>
 */
export { default as vButton } from './button'