/**
 * 底部选择器
 *
 * picker 底部选择器 ***********************************************************
 * @prop {Array} data - 数据
 * @prop {String} [title] - 标题
 * @prop {String} [textField='text'] - data中用于显示文本的属性
 * @prop {String} [valueField='value'] - data中用于表示值的属性
 * @attribute v-model - 使用v-model进行数据绑定
 *
 * @method open - 显示选择器
 * 
 * @method close - 关闭选择器
 * 
 * @event change - 切换选项时触发
 * @param {Object} data - 选中项的数据
 * @param {*} value - 选中的值
 * @param {Object} - event对象
 * 
 * @desc 可使用v-picker指令与点击元素进行绑定，参看src/common/js/directives
 *
 * @example
 * <v-picker :data="pickerData" v-model="pickerVal" />
 * 
 * datePicker 底部日期时间选择器 **************************************************
 * @prop {String} max - 最大日期，格式为YmdHi
 * @prop {String} min - 最小日期，格式为YmdHi
 * @prop {String} [title] - 标题
 * @prop {Boolean} [clearBtn] - 是否包含“清空”按钮
 * @attribute v-model - 使用v-model进行数据绑定，格式为YmdHi
 * 
 * @method open - 显示选择器
 *
 * @method close - 关闭选择器
 * 
 * @desc 可使用v-data-picker指令与点击元素进行绑定，参看src/common/js/directives
 * 
 * @example
 * <v-date-picker v-model="pickerV1" :max="pickerMax1" :min="pickerMin1"/>
 */
export { default as vPicker } from './picker'
export { default as vDatePicker } from './datePicker'