<template>
    <header class="ui-header">
        <slot></slot>
    </header>
</template>

<script>
export default {
    name: 'vHeader'
}
</script>

<style lang="scss" rel="stylesheet/scss">
@import '../../common/css/index';

.ui-header {
    position: relative;
    height: 3rem;
    background-color: $header-bg;
    color: #fff;
    line-height: 3rem;
    h1 {
        position: absolute;
        left: 5rem;
        right: 5rem;
        font-size: 1.4rem;
        text-align: center;
        @extend %no-break;
        &~.ui-button {
            float: right;
        }
    }
    .ui-button {
        float: left;
        margin: 0;
        padding: 0 0.5rem;
        width: auto;
        min-width: 3rem;
        height: 3rem;
        font-size: 1.1rem;
        border-radius: 0;
        i {
            line-height: 3rem;
        }
    }
    .ios & {
        padding-top: 1.5rem;
    }
}
</style>