<template>
    <div class="ui-page">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'vPage',
    created(){
        console.log(this)
    }
}
</script>

<style lang="scss" rel="stylesheet/scss">
@import '../../common/css/index';

.ui-page {
    position: absolute;
    top: 0;
    left: 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    width: 100%;
    height: 100%;
    overflow: scroll;
    font-size: 1rem;
    color: $normal-font;
    background-color: $gray-bg;
    main {
        -webkit-box-flex: 1;
        width: 100%;
        overflow: scroll;
    }
}
</style>