<template>
    <form class="ui-form" :class="{'ui-disabled':disabled}">
        <slot></slot>
    </form>
</template>

<script>
export default {
    name: 'vForm',
    props: {
        model: Object, //所有数据的键值对
        rules: Object, //所有数据的校验规则
        disabled: Boolean  //禁用与否
    },
    methods: {
        /**
         * 批量校验
         * @param {String} [autoAlert=true] - 校验不通过时是否自动提示错误信息
         * @return {Boolean|String} 校验通过返回true，否则返回错误提示语
         * @desc 如果配置了非空（required或requireSelected），则总会先校验非空
         */
        isValid(autoAlert = true) {
            if (this.rules) {
                for (let k in this.rules) { //遍历字段=>规则
                    let errMsg, //错误提示语
                        hasRequired, //是否已校验非空
                        rule = this.rules[k],
                        v = this.model[k];
                    if (!Array.isArray(rule)) rule = [rule];
                    for (let item of rule) { //遍历当前字段的每个规则
                        let type, message;
                        if (typeof item == 'string') {
                            type = item;
                        } else {
                            type = item.type;
                            message = item.message;
                        }
                        if (typeof type == 'string') {
                            if (type == 'required' || type == 'requireSelected') {
                                hasRequired = true;
                            }
                            type = this.$validator[type];
                        }
                        if (errMsg && !hasRequired) continue; //已存在校验不通过的记录 && 当前检验不是非空，则继续遍历直到找到非空校验
                        let ret = type(v); //执行校验
                        if (ret !== true) { //校验不通过，则ret为提示语
                            errMsg = message || ret;
                        }
                        if (errMsg && hasRequired) break; //校验不通过 && 已校验非空，则校验结束
                    }
                    if (errMsg) {
                        if (errMsg.indexOf('{0}') != -1) { //存在主语占位符
                            let t = this._getTitle(k);
                            if (t) {
                                errMsg = errMsg.replace('{0}', t); //替换提示语的主语
                                if (autoAlert) {
                                    this.$message(errMsg);
                                }
                            } else {
                                console.error(`字段“${k}”没有匹配的title！`);
                            }
                        }
                        return errMsg;
                    }
                }
            }
            return true;
        },
        /**
         * 根据字段名，查找title
         * @param {String} name - 字段名
         * @param {Array} [children] - Vue子实例
         * @param {Boolean} [recursion=false] - 是否递归调用
         * @return {String} 错误提示语的主语title
         */
        _getTitle(name, children, recursion) { //根据字段名，查找title，用于显示错误信息
            if (!children) children = this.$children;
            for (let c of children) {
                if (c._uxForm && c._uxForm.name == name) { //匹配到就是此实例
                    if (c._uxForm.title) return c._uxForm.title;
                    let label = c.$el.querySelector('label'); //没有定义title，则查找首个<label>作为title
                    if (label) return label.innerText;
                    return '';
                }
                if (c.$children.length) { //递归从子实例查找
                    let t = this._getTitle(name, c.$children, true);
                    if (t !== undefined) return t;
                }
            }
            if (!recursion) {
                let el = this.$el.querySelector(`[data-form-name="${name}"]`);
                if (el) {
                    if (el.dataset.formTitle) return el.dataset.formTitle;
                    let label = el.querySelector('label'); //没有定义title，则查找首个<label>作为title
                    if (label) return label.innerText;
                }
            }
        }
    }
};
</script>

<style lang="scss">

</style>