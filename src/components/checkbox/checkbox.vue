<template>
    <div class="ui-checkbox" :class="{'ui-disabled':disabled}">
        <i :class="[{'icon-24':!model},{'icon-51':model}]" @click="onChange"></i>
        <label @click="onChange">
            <slot></slot>
        </label>
    </div>
</template>

<script>
    export default{
        name: 'vCheckbox',
        props: {
            value: Boolean, //选中与否
            disabled: Boolean,  //禁用与否
            label: {}   //在复选框组内有用，选中的值
        },
        computed: {
            isGroup(){ //是否存在于单选框组内
                let p = this.$parent;
                while (p) {
                    if (p.$options.name != 'vCheckboxGroup') {
                        p = p.$parent;
                    } else {
                        this._checkboxGroup = p;
                        return true;
                    }
                }
                return false;
            },
            model(){
                if (this.isGroup) {
                    return this._checkboxGroup.value.indexOf(this.label) != -1;
                } else {
                    return this.value;
                }
            }
        },
        methods: {
            onChange(){
                if (this.isGroup) {
                    let arr = [].concat(this._checkboxGroup.value);
                    if (this.model) { //反选
                        arr.removeOf(this.label);
                    } else { //选中
                        arr.push(this.label);
                    }
                    this._checkboxGroup.$emit('input', arr);
                } else {
                    this.$emit('input', !this.value);
                }
            }
        }
    };
</script>

<style lang="scss" rel="stylesheet/scss">
    @import '../../common/css/index';

    .ui-checkbox {
        position: relative;
        i {
            position: absolute;
            top: 0.3rem;
            left: 0.5rem;
            font-size: 1.5rem;
            box-sizing: border-box;
            margin-right: 0.5rem;
            width: 1.4rem;
            height: 1.4rem;
            line-height: 1.4rem;
            text-align: center;
            &.icon-checkmark {
                border: none;
                font-size: 1.1rem;
                color: #fff;
                background-color: $blue-font;
            }
        }
        label {
            display: inline-block;
            line-height: 2rem;
            padding: 0 0.5rem 0 2.4rem;
            font-size: 1.2rem;
        }
        &.ui-disabled, .ui-disabled & {
            i {
                border-color: #bbb;
                background-color: #f7f7f7;
                &.icon-checkmark {
                    background-color: #ccc;
                    color: #f2f2f2;
                }
            }
            label {
                color: $disabled-font;
            }
        }
    }
</style>