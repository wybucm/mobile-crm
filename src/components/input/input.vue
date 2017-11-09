<template>
    <div class="ui-input" :class="{'ui-disabled':disabled,'round':round}">
        <slot></slot>
        <input v-if="type!='textarea'" ref="input" :type="type" :placeholder="placeholder" :maxlength="maxlength" :value="value" @focus="onFocus" @blur="onBlur" @input="onInput">
        <textarea v-else ref="input" :placeholder="placeholder" :maxlength="maxlength" :value="value" @focus="onFocus" @blur="onBlur" @input="onInput"></textarea>
        <a v-if="clearBtn && type!='textarea'" v-show="focus && value" class="ui-input-cross icon-0" v-tap="clear"></a>
        <slot name="right"></slot>
    </div>
</template>

<script>
import tools from '@/common/js/tools';

let textareaRowH = 1.5, //每行文本高度
    textareaMinH = 3.5, //文本区最小高度
    textareaExtraH = 1; //预留高度

export default {
    name: 'vInput',
    props: {
        round: { //是否显示成四条边框
            type: Boolean
        },
        value: String, //值
        type: { //输入框类型
            type: String,
            default: 'text'
        },
        disabled: Boolean,  //禁用与否
        placeholder: String, //提示文本
        maxlength: [String, Number], //最大长度
        maxRow: { //最大行数
            type: Number,
            default: 5
        },
        clearBtn: { //是否显示清除按钮
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            focus: false
        }
    },
    computed: {
        maxHeight() { //文本区最大高度
            return this.maxRow * textareaRowH;
        }
    },
    methods: {
        onFocus(e) {
            this.focus = true;
            this.$emit('focus', e);
        },
        onBlur(e) {
            setTimeout(() => {
                this.focus = false;
                this.$emit('blur', e);
            });
        },
        onInput() {
            this.resizeTextarea();
            this.$emit('input', this.$refs.input.value);
        },
        clear() {
            this.$emit('input', '');
            setTimeout(() => {
                this.$refs.input.focus();
            });
        },
        resizeTextarea(buffer = true) { //重置textarea高度
            if (this.type == 'textarea') {
                if (buffer) {
                    tools.bufferTimeout('v-input', this.doResizeTextarea, 100);
                } else {
                    this.doResizeTextarea();
                }
            }
        },
        doResizeTextarea() {
            let textarea = this.$refs.input;
            textarea.style.height = 0;
            textarea.style.height = Math.min(Math.max(textarea.scrollHeight, textareaMinH), this.maxHeight) + textareaExtraH + 'px';
        }
    },
    beforeCreate() {
        textareaRowH = this.$tools.rem2Px(textareaRowH);
        textareaMinH = this.$tools.rem2Px(textareaMinH);
        textareaExtraH = this.$tools.rem2Px(textareaExtraH);
    },
    mounted() {
        if (this.$parent.$options.name == 'vAlert') {
            textareaMinH = tools.rem2Px(2.5); //文本区最小高度
            textareaExtraH = tools.rem2Px(0.2); //预留高度
        }
        this.resizeTextarea(false);
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
@import "../../common/css/index";

.ui-input {
    display: flex;
    align-items: center;
    margin: 0 auto;
    overflow: hidden;
    background-color: #fff;
    border-bottom: solid 1px $gray-border;
    & > [class^="icon-"],
    & > [class*=" icon-"] {
        //左图标
        margin: 0 -1rem 0 0.5rem;
        padding: 0.5rem;
    }
    label {
        //标签
        margin-left: 1rem;
    }
    input,
    textarea {
        flex: 1;
        padding: 1rem;
        height: 3.5rem;
        box-sizing: border-box;
        background-color: transparent;
        & ~ [class^="icon-"],
        & ~ [class*=" icon-"] {
            //右图标
            margin: 0 0.5rem 0 0;
            padding: 1.1rem 0.5rem 0.5rem;
        }
    }
    textarea {
        padding-top: 1.1rem;
    }
    .ui-input-cross[class*=" icon-"] {
        //清除按钮
        & ~ [class^="icon-"],
        & ~ [class*=" icon-"] {
            //带清除按钮的时的右图标
            margin: 0;
        }
    }
    &.ui-disabled,
    .ui-disabled & {
        background-color: $disabled-bg;
        input,
        textarea {
            color: $disabled-font;
        }
    }
    &.round {
        border: solid 1px $gray-border;
        width: 90%;
        border-radius: $border-radius;
        input {
            height: 2.5rem;
        }
    }
    .common-li > &,
    .common-ul > li > & {
        border: none;
    }
}
</style>