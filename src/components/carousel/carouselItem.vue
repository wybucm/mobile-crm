<template>
    <div class="ui-carousel-item">
        <slot></slot>
        <img v-if="src" :src="src">
    </div>
</template>

<script>
export default {
    name: 'vCarouselItem',
    props: {
        src: String //图片路径，如果存在，则会自动添加<img>标签
    }
}
</script>

<style lang="scss" rel="stylesheet/scss">
@import '../../common/css/index';
.ui-carousel-item {
    display: inline-block;
    width: 100%;
    height: 100%;
    &>img {
        width: 100%;
        height: 100%;
    }
    &.silent {
        transition-duration: 0s;
    }
    &.isActive {
        z-index: 1;
    }
}
</style>