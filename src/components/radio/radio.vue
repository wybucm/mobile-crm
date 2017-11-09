<template>
    <div class="ui-radio" :class="{'ui-disabled':disabled}">
        <i :class="{'ui-checked':model==label}" @click="onChange"></i>
        <label @click="onChange">
            <slot></slot>
        </label>
    </div>
</template>

<script>
export default {
    name: 'vRadio',
    props: {
        value: {},  //值
        disabled: Boolean,  //是否禁用
        label: {}  //选中的值
    },
    computed: {
        isGroup() { //是否存在于单选框组内
            let p = this.$parent;
            while (p) {
                if (p.$options.name != 'vRadioGroup') {
                    p = p.$parent;
                } else {
                    this._radioGroup = p;
                    return true;
                }
            }
            return false;
        },
        model() {
            return this.isGroup ? this._radioGroup.value : this.value;
        }
    },
    methods: {
        onChange() {
            if (this.isGroup) {
                this._radioGroup.$emit('input', this.label);
            } else {
                this.$emit('input', this.label);
            }
        }
    },
    mounted() {
        let w = this.$tools.rem2Px(1.4),
            $i = this.$el.querySelector('i');
        w = Math.round(w / 4) * 4;
        $i.style.width = w + 'px';
        $i.style.height = w + 'px';
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
@import '../../common/css/index';

.ui-radio {
    position: relative;
    i {
        position: absolute;
        top: 50%;
        left: 0.5rem;
        box-sizing: border-box;
        margin-right: 0.5rem;
        border: solid 1px #999;
        width: 1.4rem;
        height: 1.4rem;
        transform: translateY(-50%);
        background-color: #fff;
        border-radius: 50%;
        &.ui-checked {
            border: none;
            background-color: $radio-selected;
            &:after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 50%;
                height: 50%;
                transform: translate(-50%, -50%);
                border-radius: 50%;
                background-color: #fff;
            }
        }
    }
    label {
        display: inline-block;
        line-height: 2rem;
        padding: 0 0.5rem 0 2.4rem;
        width: 88%;
    }
    &.ui-disabled,
    .ui-disabled & {
        i {
            border-color: #bbb;
            background-color: #f7f7f7;
            &.ui-checked {
                background-color: #ccc;
                &:after {
                    background-color: #f2f2f2;
                }
            }
        }
        label {
            color: $disabled-font;
        }
    }
}
</style>