/**
 * 表单，可用于批量校验
 * 
 * @prop {Object} model - 所有组件数据的键值对
 * @prop {Object} rules - 所有校验规则，键=>规则。内置规则可参看common/js/validator。
 *                      单个规则可用String或Object，多个规则则用Array；
 *                      单个规则可包含{String|Function}type-内置规则名称|自定义规则函数，
 *                          自定义规则函数参数为表单项的值，需返回{Boolean|String}true-校验通过|错误提示语，
 *                              错误提示语可包含{0}，作为主语的占位符；
 *                      单个规则可包含{String}message-自定义错误提示语，代替规则函数返回的错误提示语；
 *                      如果某个键配置了非空规则（required或requireSelected），则会先校验非空
 * @prop {Boolean} disabled - 禁用与否。禁用后，所有组件将不能操作
 * 
 * @method isValid - 批量校验
 * @param {String} [autoAlert=true] - 校验不通过时是否自动提示错误信息
 * @return {Boolean|String} true或错误提示语
 * 
 * @desc 仅仅使用了自定义指令v-form的组件或dom元素会受表单的校验规则影响，指令详情参看 common/js/directives
 * 
 * @example
 * <v-form :model="form" :rules="rules">
 *      <v-input v-form v-model="form.phone">
 *          <label>手机号</label>
 *      </v-input>
 *      <div v-form="{name:'job', title:'职业'}">{{form.job}}</div>
 * </v-form>
 * <script>
 *  {
 *      data(){
 *          return {
 *              form: {
 *                  phone: '',
 *                  job: ''
 *              },
 *              rules: {
 *                  phone: ['required', 'phone'],
 *                  job: 'requireSelected'
 *              }
 *          }
 *      }
 *  }
 * </script>
 */

export { default as vForm } from './form'