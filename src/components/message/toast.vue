<template>
    <transition name="v-toast">
        <div class="ui-toast" v-show="visible">
            <div>
                <slot></slot>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'vToast',
    props: {
        remain: { //显示持续时间
            type: Number,
            default: 2000
        }
    },
    data() {
        return {
            visible: false //显示与否
        }
    },
    methods: {
        //显示
        show(){
            if (this._uxTimerCode) {
                clearTimeout(this._uxTimerCode);
            }
            this.visible = true;
            this._uxTimerCode = setTimeout(() => {
                this.visible = false;
                this._uxTimerCode = null;
            }, this.remain);
        }
    }
}
</script>

<style lang="scss" rel="stylesheet/scss">
@import '../../common/css/index';

.ui-toast {
    position: absolute;
    left: 50%;
    bottom: 3rem;
    z-index: 10010;
    margin-left: -33%;
    width: 66%;
    text-align: center;
    transition: opacity 0.5s;
    &>div {
        display: inline-block;
        padding: .5rem 1rem;
        color: #fff;
        border-radius: $border-radius2;
        font-size: .95rem;
        background-color: rgba(0, 0, 0, .7);
    }
    &.v-toast-leave-to {
        opacity: 0;
    }
}
</style>