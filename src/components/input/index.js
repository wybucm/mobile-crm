/**
 * 输入框
 *
 * @prop {Boolean} [clear-btn=true] - 是否显示清除按钮
 * @prop {Boolean} [round] - 是否显示成四条边框的样式
 * @prop {Number} [maxRow=5] - type为textarea有效，文本区最大行数
 * @prop type、placeholder、disabled、v-model(String)与普通的input一样使用
 * @prop 当type为textarea时，代表文本区
 *
 * @desc 可包含<label>，代表输入框左侧标签
 * @desc 可包含图标文字，代表输入框左侧图标
 * @desc 可包含slot="right"的图标，代表输入框右侧图标
 *
 * @example
 * <v-input v-model="userName">
 *     <i class="icon-user"></i>
 * </v-input>
 */
export {default as vInput} from './input'