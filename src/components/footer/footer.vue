<template>
    <footer>
        <div v-for="(tab,i) in tabs" :key="tab.text" class="ui-item" :class="{'ui-active':i==index}" v-tap="[onChange,i]">
            <i :class="'icon-'+tab.icon"></i>
            <span>{{tab.text}}</span>
        </div>
    </footer>
</template>

<script>
    export default{
        name: 'vFooter',
        props: {
            tabs: Array,
            index: {
                type: Number,
                default: 0
            }
        },
        methods: {
            onChange(index){
                this.$emit('switch', index);
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import '../../common/css/index';

    footer {
        display: flex;
        border-top: solid 1px rgba(0, 0, 0, .1);
        height: 3.3rem;
        background-color: $footer-bg;
        .ui-item {
            flex: 1;
            text-align: center;
            font-size: 0;
            color: #929292;
            i {
                display: block;
                font-size: 1.5rem;
                margin: 0.4rem 0 0.1rem;
            }
            span {
                font-size: 0.8rem;
            }
            &.ui-active {
                color: $red-font;
            }
        }
    }
</style>