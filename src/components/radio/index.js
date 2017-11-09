/**
 * 单选框
 * @auth by Lidc 2017-07-17
 *
 * radio：
 * @prop {*} label - 在radioGroup内有用，选中的值
 * @prop disabled、v-model与普通的radio一样使用
 *
 * radioGroup：
 * @prop disabled、v-model(*)与普通的radio一样使用
 * @desc 包裹的<v-radio>需提供属性label，代表选中该项的值
 *
 * @example
 * <v-radio v-model="checked">是否保存账号</v-radio>
 *
 * <v-radio-group v-model="sex">
 *      <v-radio :label="1">男</v-radio>
 *      <v-radio :label="2">女</v-radio>
 * </v-radio-group>
 */
export {default as vRadio} from './radio'
export {default as vRadioGroup} from './radioGroup'