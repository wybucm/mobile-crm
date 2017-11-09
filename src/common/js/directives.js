/**
 * 自定义指令
 * v-tap    - 点击事件，取代响应慢的click
 * v-hold   - 长按事件
 * v-link   - 跳转链接，代替vue-router的<router-link>
 * v-form   - 与<v-form>配合，用于定义校验规则
 * v-picker - 快速生成<v-picker>，并与当前元素绑定
 * v-date-picker - 快速生成<v-date-picker>，并与当前元素绑定
 */
import Vue from "vue";

import { tap, hold } from "@/core/events";

/**
 * v-tap，点事件，取代响应慢的click
 * @value 指令的值如果为Function，代表事件函数，函数参数为event对象；
 *          如果为Array，则首个元素为事件函数，其他元素为函数参数。参数可以用占位符$e来代表event对象
 * @modifier stop - 是否阻止事件冒泡
 * 
 * @example
 *      <a v-tap="goHome">返回首页</a>
 *      <a v-tap.stop="[goHome,$e,'p1']">返回首页</a>
 */
Vue.directive("tap", tap);

/**
 * v-hold，长按事件
 * @value 指令的值如果为Function，代表事件函数，函数参数为event对象；
 *          如果为Array，则首个元素为事件函数，其他元素为函数参数。参数可以用占位符$e来代表event对象
 * @modifier stop - 是否阻止事件冒泡
 * 
 * @example
 *      <a v-hold="goHome">长按返回首页</a>
 *      <a v-hold="[goHome,$e,'p1']">长按返回首页</a>
 */
Vue.directive("hold", hold);

/**
 * v-link，跳转链接，代替vue-router的<router-link>
 * @value 指令的值为$go（或$back）的参数
 * @modifier back - 如果指定，则跳转时调用$back，而不是$go
 * 
 * @example
 *      <v-button v-link="'/login'">登录</v-button>
 *      <a v-link.back>返回</a>
 */
let linkMap = {}, //dom id=>页面跳转参数
    idIndex = 0; //自动添加的dom id的下标
Vue.directive("link", {
    bind(el, binding) {
        console.log("bind");
        let id = el.id;
        if (!id) {
            //元素没有id，则强制添加
            el.id = id = "v_link_" + idIndex++;
        }
        linkMap[id] = {
            fn: binding.modifiers.back ? "$back" : "$go",
            params: binding.value,
            tapFn() {
                $rootVm[linkMap[id].fn](linkMap[id].params);
            }
        };
        tap.bind(el, {
            value: linkMap[id].tapFn
        });
    },
    update(el, binding, vnode) {
        linkMap[el.id].fn = binding.modifiers.back ? "$back" : "$go";
        linkMap[el.id].params = binding.value
        if (vnode.componentInstance) {
            //对于Vue组件，更新之后el会重新创建，因此要重新绑定tap事件
            setTimeout(() => {
                tap.bind(el, {
                    value: linkMap[el.id].tapFn
                });
            });
        }
    },
    unbind(el) {
        delete linkMap[el.id];
        tap.unbind(el);
    }
});

/**
 * v-form，与<v-form>配合，用于定义校验规则
 * 参看 src/components/form
 * 可包含：
 *      {String} name - 字段名，与<v-form>的model的字段名对应。默认会从v-model指令匹配
 *      {String} title - 提示语主语，用于替换校验规则的错误提示语的主语占位符{0}，默认会从dom子元素下查找<label>用其内容代替
 * 
 * @example
 *      <v-input v-form v-model="phone"><label>手机号</label></v-input>  //name为'phone'，title为'手机号'
 *      等同于
 *      <v-input v-form="{name:'phone',title='手机号'}" v-model="phone"><label>手机号</label></v-input>
 * 
 *      也可应用于普通dom节点
 *      <div v-form="{name:'phone',title='手机号'}"></div>
 */
Vue.directive("form", (el, binding, vnode) => {
    //新增自定义指令v-form
    let val = binding.value; //指令的值
    if (vnode.componentInstance) {
        let name = val && val.name, //字段名
            title = val && val.title; //提示语主语
        if (!name) {
            //没指定字段名，则从v-model里找
            if (vnode.data.model) {
                name = vnode.data.model.expression.substr(
                    vnode.data.model.expression.lastIndexOf(".") + 1
                );
            }
        }
        vnode.componentInstance._uxForm = {
            name,
            title
        };
    } else {
        //没有vue实例，则是普通节点，添加自定义属性
        let ds = vnode.elm.dataset;
        if (val) {
            if (val.name) {
                ds.formName = val.name;
            }
            if (val.title) {
                ds.formTitle = val.title;
            }
        }
    }
});

/**
 * v-picker，点击当前元素时，自动创建<v-picker>
 * 参看 src/components/picker
 * 可包含：
 *      {Array} data - 数据
 *      {*} model - 绑定数据的字段，与v-model一样
 *      {String} [title] - 标题
 *      {String} [textField="text"] - data中用于显示文本的属性
 *      {String} [valueField="value"] - data中用于表示值的属性
 *      {Function} [onchange] - 切换选项时触发的函数，参数与<v-picker>的change事件一致
 *      {String|Boolean} [echoEl=当前元素] - 切换选项时回显的元素的ref值，false代表不回显
 *      {String|Function} [echoTpl="{0}"] - echoEl不为false时，用于回显的格式串或者函数，
 *                                          String格式串，以{0}为选中文本的占位符；
 *                                          Function函数，参数为选中的数据对象，需返回String-回显文本
 * 
 * @example
 *      <v-button v-picker="{model:value,data:pickerData}"></v-button>
 *      
 *      <div v-picker="{model:value,data:pickerData,echoEl:'a'}">
            <a ref="a"></a>
        </div>
 */

/**
 * v-date-picker，点击当前元素时，自动创建<v-date-picker>
 * 参看 src/components/picker
 * 可包含：
 *      {String} model - 绑定数据的字段，与v-model一样，格式为YmdHi
 *      {String} max - 允许选择的最大值，格式为YmdHi
 *      {String} min - 允许选择的最小值，格式为YmdHi
 *      {String} [title] - 标题
 *      {Boolean} [clearBtn] - 是否包含“清空”按钮
 *      {Function} [oninput] - 点击确定触发的函数，参数为v-选择的结果值
 *      {String|Boolean} [echoEl=当前元素] - 切换选项时回显的元素的ref值，false代表不回显
 *      {String|Function} [echoTpl="{0}"] - echoEl不为false时，用于回显的格式串或者函数，
 *                                          String格式串，以{0}为选择结果(Y-m-d H:i)的占位符；
 *                                          Function函数，参数为选择的结果值，需返回String-回显文本
 * 
 * @example
 *      <v-button v-date-picker="{model:value,max:max,min:min}"></v-button>
 *      
 *      <div v-picker="{model:value,max:max,min:min,echoEl:'a'}">
            <a ref="a"></a>
        </div>
 */
const pickerMap = {};
let pickerIdIndex = 0; //自动添加的dom id的下标
const pickerCfg = {
    bind(el, binding, vnode) {
        let id = el.id;
        if (!id) {
            //元素没有id，则强制添加
            el.id = id = "v_picker_" + pickerIdIndex++;
        }
        let props = binding.value,
            match = binding.expression.match(/\bmodel\s*:\s*([\w\$]+)/), //匹配model的字段名
            model, //model字段名
            echoEl = el,
            echoTpl = props.echoTpl || "{0}";
        if (match) {
            model = match[1];
        }
        if (props.echoEl === false) {
            echoEl = false;
        } else if (props.echoEl) {
            echoEl = vnode.context.$refs[props.echoEl]; //从当前vue实例作用域获取回显元素的vue实例
        }
        let unwatch = vnode.context.$watch(model, newVal => {
            //观测model字段，更改时回显到绑定元素
            if (binding.name == "picker") {
                pickerCfg.pickerEcho(
                    props.data,
                    newVal,
                    props.valueField,
                    props.textField,
                    echoEl,
                    echoTpl
                );
            } else {
                pickerCfg.datePickerEcho(newVal, echoEl, echoTpl);
            }
        });
        if (binding.name == "picker") {
            //自动回显
            pickerCfg.pickerEcho(
                props.data,
                props.model,
                props.valueField,
                props.textField,
                echoEl,
                echoTpl
            );
        } else {
            pickerCfg.datePickerEcho(props.model, echoEl, echoTpl);
        }
        pickerMap[id] = {
            el,
            cmp: null,
            props,
            unwatch,
            tapFn() {
                let cmp = pickerMap[id].cmp,
                    props = pickerMap[id].props;
                if (!cmp) {
                    if (binding.name == "picker") {
                        let Picker = Vue.component("vPicker");
                        cmp = pickerMap[id].cmp = new Picker({
                            propsData: {
                                title: props.title,
                                value: props.model,
                                data: props.data,
                                displayField: props.displayField,
                                textField: props.textField
                            },
                            beforeCreate() {
                                //动态创建组件时不知为何会报$store和toJSON找不到，所以此处补回
                                this.$store = $rootVm.$store;
                                this.toJSON = String.prototype.toJSON;
                            }
                        }).$mount();
                        cmp.$on("change", (data, v) => {
                            if (model) {
                                vnode.context[model] = v;
                            }
                            props.onchange && props.onchange(data, v);
                        });
                    } else {
                        let Picker = Vue.component("vDatePicker");
                        cmp = pickerMap[id].cmp = new Picker({
                            propsData: {
                                title: props.title,
                                value: props.model,
                                max: props.max,
                                min: props.min,
                                clearBtn: props.clearBtn
                            },
                            beforeCreate() {
                                //动态创建组件时不知为何会报$store和toJSON找不到，所以此处补回
                                this.$store = $rootVm.$store;
                                this.toJSON = String.prototype.toJSON;
                            }
                        }).$mount();
                        cmp.$on("input", v => {
                            if (model) {
                                vnode.context[model] = v;
                            }
                            props.oninput && props.oninput(v);
                        });
                    }
                    vnode.context.$el.appendChild(cmp.$el);
                } else {
                    if (cmp.title != props.title) cmp.title = props.title;
                    if (cmp.value != props.model) cmp.value = props.model;
                    if (binding.name == "picker") {
                        if (cmp.data != props.data) cmp.data = props.data;
                    } else {
                        if (cmp.max != props.max) cmp.max = props.max;
                        if (cmp.min != props.min) cmp.min = props.min;
                    }
                }
                cmp.open();
            }
        };
        tap.bind(el, {
            value: pickerMap[id].tapFn
        });
    },
    update(el, binding, vnode) {
        pickerMap[el.id].props = binding.value;
        if (vnode.componentInstance) {
            //对于Vue组件，更新之后el会重新创建，因此要重新绑定tap事件
            setTimeout(() => {
                tap.bind(el, {
                    value: pickerMap[el.id].tapFn
                });
            });
        }
    },
    unbind(el) {
        pickerMap[el.id].cmp && pickerMap[el.id].cmp.$destroy(); //销毁<v-picker>
        pickerMap[el.id].unwatch(); //去掉当前作用域的检测器
        tap.unbind(el); //解绑tap事件
        delete pickerMap[el.id];
    },
    pickerEcho(
        data,
        v,
        valueField = "value",
        textField = "text",
        echoEl,
        echoTpl
    ) {
        //picker的选中文本回显到绑定元素
        if (echoEl && !$rootVm.$tools.isEmpty(v)) {
            for (let i = 0, d = data; i < d.length; i++) {
                if (d[i][valueField] === v) {
                    let text;
                    if (typeof echoTpl == "function") {
                        text = echoTpl(d[i]);
                    } else {
                        text = echoTpl.replace("{0}", d[i][textField]);
                    }
                    echoEl.innerHTML = text;
                    break;
                }
            }
        }
    },
    datePickerEcho(v, echoEl, echoTpl) {
        if (echoEl) {
            let dateStr = $rootVm.$tools.isEmpty(v)? '': $rootVm.$tools.string2Date(v).format("Y-m-d H:i"),
                text;
            if (typeof echoTpl == "function") {
                text = echoTpl(v, dateStr);
            } else {
                text = echoTpl.replace(
                    "{0}",
                   dateStr
                );
            }
            echoEl.innerHTML = text;
        }
    }
};
Vue.directive("picker", pickerCfg);
Vue.directive("datePicker", pickerCfg);
