<template>
    <div class="ui-loading" v-show="visible">
        <div>
            <slot>
                {{loadingText}}
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'vLoading',
    props: {
        type: { //请求类型，1(默认)-加载 2-提交
            type: Number,
            default: 1
        },
        text: String
    },
    data() {
        return {
            visible: true,
        }
    },
    computed: {
        loadingText() {
            return this.text || (this.type == 1 ? '正在加载...' : '正在处理...')
        }
    },
    methods: {
        show() {
            this.visible = true;
        },
        hide() {
            this.visible = false;
        },
        setVisible(visible) {
            visible? this.show(): this.hide();
        }
    },
    created() {
        console.log('loading!!!!')
    }
}
</script>

<style lang="scss" rel="stylesheet/scss">
@import '../../common/css/index';

.ui-loading {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    &>div {
        padding: 1rem 1.5rem;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: .6rem;
    }
}
</style>