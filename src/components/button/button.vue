<template>
    <button class="ui-button" :class="{'loading':loading}" :disabled="disabled" v-tap="onClick">
        <i v-if="loading" class="loading-icon icon-spinner11"></i>
        <i v-if="icon" v-show="!loading" :class="'icon-'+ icon"></i>
        <span v-if="$slots.default" v-show="!loading || !loadingText">
            <slot></slot>
        </span>
        <span v-if="loadingText" v-show="loading">
            {{loadingText}}
        </span>
        <i v-if="iconR" :class="'icon-'+ iconR"></i>
    </button>
</template>

<script>
export default {
    name: 'vButton',
    props: {
        disabled: Boolean,  //是否禁用
        icon: String,   //左图标，省略icon-前缀
        iconR: String,  //右图标，省略icon-前缀
        loading: Boolean,    //是否加载中
        loadingText: String    //加载中的文本，默认与按钮原文本一致
    },
    methods: {
        onClick(e) {
            this.$emit('click', e);
        }
    }
}
</script>

<style lang="scss">
@import '../../common/css/index';

.ui-button {
    display: block;
    margin: 1rem auto;
    padding: .7em 1em;
    width: 70%;
    line-height: 1;
    text-align: center;
    border-radius: $border-radius9;
    @extend %no-break;
    @include button-color($btn-bg);
    &.red {
        @include button-color($red-btn);
    }
    &.blue {
        @include button-color($blue-btn);
    }
    &.gray {
        @include button-color($gray-btn);
    }
    &.wide {
        letter-spacing: 0.2rem;
        text-indent: 0.2rem;
    }
    &.inline {
        display: inline-block;
        width: auto;
        margin: inherit;
    }
    &[disabled] {
        background-color: $disabled-bg;
    }
    &.loading {
        pointer-events: none;
        .loading-icon {
            animation: rotating 1s linear infinite;
            @keyframes rotating {
                0% {
                    transform: rotate(0deg)
                }
                to {
                    transform: rotate(1turn)
                }
            }
        }
    }
}
</style>