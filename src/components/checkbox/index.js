/**
 * 复选框
 * @auth by Lidc 2017-07-17
 *
 * checkbox：
 * @prop {*} label - 在checkboxGroup内有用，选中的值
 * @prop disabled、v-model(Boolean)与普通的checkbox一样使用
 * @slot 复选框的文本
 *
 * checkboxGroup：
 * @prop disabled、v-model(Array)与普通的checkbox一样使用
 * @desc 包裹的<v-checkbox>需提供属性label，代表选中该项的值
 *
 * @example
 * <v-checkbox v-model="checked">是否保存账号</v-checkbox>
 *
 * <v-checkbox-group v-model="checked2">
 *      <v-checkbox :label="1">保存账号</v-checkbox>
 *      <v-checkbox :label="2">自动登录</v-checkbox>
 * </v-checkbox-group>
 */
export {default as vCheckbox} from './checkbox'
export {default as vCheckboxGroup} from './checkboxGroup'