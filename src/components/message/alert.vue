<template>
    <div class="ui-alert" :class="{'ui-confirm':confirm}" v-if="visible">
        <div>
            <a v-if="closable" class="icon-0 holdable" v-tap="close"></a>
            <h3 v-if="title">{{title}}</h3>
            <div class="content">
                <slot></slot>
            </div>
            <v-input v-if="typeof inputValue == 'string'" :type="inputType" :maxlength="inputMaxlength" v-model="myInputValue"/>
            <div class="btns">
                <v-button v-for="(item,i) in btns" :key="i" :class="{focus:!confirm || i==focus}" @click="onclick(i, $event)">
                    {{item.text}}
                </v-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'vAlert',
    props: {
        confirm: Boolean, //是否确认提示框
        title: String, //标题
        buttonText: [String, Array], //按钮文本
        closable: { //是否可关闭
            type: Boolean,
            default: true
        },
        focus: { //聚焦哪个按钮
            type: Number,
            default: 1
        },
        callback: [Function, Array], //点击按钮的回调函数
        inputValue: String, //输入框默认值
        inputType: { //输入框类型
            type: String,
            default: 'text'
        },
        inputMaxlength: Number //输入框最大字节数
    },
    data() {
        let btns,
            value;
        if (this.confirm) { //双按钮
            btns = [{
                text: '取消'
            }, {
                text: '确定'
            }];
            if (this.buttonText) {
                if (typeof this.buttonText == 'string') {
                    btns[1].text = this.buttonText;
                } else {
                    btns[0].text = this.buttonText[0];
                    btns[1].text = this.buttonText[1];
                }
            }
            if (this.callback) {
                if (typeof this.callback == 'function') {
                    btns[1].callback = this.callback;
                } else {
                    btns[0].callback = this.callback[0];
                    btns[1].callback = this.callback[1];
                }
            }
        } else {
            btns = [{
                text: this.buttonText || '确定',
                callback: this.callback
            }];
        }
        return {
            visible: true,
            btns,
            myInputValue: this.inputValue
        }
    },
    methods: {
        onclick(index, e) { //点击按钮触发
            if (this.btns[index].callback) {
                let args = [];
                if (typeof this.myInputValue == 'string') {
                    args.push(this.myInputValue);
                }
                args.push(e);
                if (this.btns[index].callback(...args) === false) return;
            }
            this.close(e);
        },
        close(e) { //关闭
            this.visible = false;
            this.$emit('closed', e);
        }
    }
}
</script>

<style lang="scss">
@import "../common";

.ui-alert {
    @extend %ui-common-window;
    z-index: 10005;
    & > div {
        position: relative;
        width: 75%;
        overflow: visible;
        text-align: center;
        & > a {
            position: absolute;
            top: -2.5rem;
            right: -0.5rem;
            color: #fff;
        }
        h3 {
            background-color: #fff;
            border-radius: $border-radius2 $border-radius2 0 0;
            & ~ .content {
                border-radius: 0;
            }
        }
        .content {
            padding: 1.5rem;
            background-color: #fff;
            border-radius: $border-radius2 $border-radius2 0 0;
        }
        .ui-input {
            margin: -0.5rem 1rem 1rem;
            input {
                padding: 0.2rem 0.5rem;
                height: auto;
            }
            .ui-input-cross {
                margin: 0;
                padding: 0.2rem 0.5rem;
            }
        }
        .btns {
            display: -webkit-box;
            overflow: hidden;
            border-radius: 0 0 $border-radius2 $border-radius2;
            border-top: solid 1px $gray-border;
            button {
                -webkit-box-flex: 1;
                margin: 0;
                padding: 1rem;
                border-radius: 0;
                @include button-color(#fff, $light-font);
                &.focus {
                    @include button-color(#fff, $red-font);
                }
                &:nth-child(2) {
                    border-left: solid 1px $gray-border;
                }
            }
        }
    }
    &.no-bg {
        background: none;
    }
}
</style>