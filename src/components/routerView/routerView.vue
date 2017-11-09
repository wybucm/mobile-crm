<template>
    <keep-alive v-if="noTransition" :include="$store.getters.keepPages">
        <router-view></router-view>
    </keep-alive>
    <transition v-else :name="transitionName">
        <keep-alive :include="$store.getters.keepPages">
            <router-view></router-view>
        </keep-alive>
    </transition>
</template>

<script>
export default {
    name: 'vRouterView',
    props: {
        noTransition: Boolean,
        transition: {
            type: String,
            default: 'slide'
        }
    },
    computed: {
        transitionName() {
            return 'v-' + (this.$store.state.routerTransitionName || this.transition)
                + (this.$store.state.routerTransitionReverse ? '-back' : '');
        }
    }
}
</script>

<style rel="stylesheet/scss">
.v-slide-enter-active,
.v-slide-leave-active,
.v-slide-back-enter-active,
.v-slide-back-leave-active {
    transition: transform .3s ease;
}

.v-slide-leave-active,
.v-slide-back-leave-active {
    transition-timing-function: ease-out;
}

.v-slide-enter-active,
.v-slide-back-leave-active {
    box-shadow: 0 0 1.5rem rgba(0, 0, 0, .5);
}

.v-slide-back-leave {
    z-index: 1;
}

.v-slide-enter,
.v-slide-back-leave-to {
    z-index: 1;
    transform: translate3d(105%, 0, 0);
}

.v-slide-leave-to,
.v-slide-back-enter {
    transform: translate3d(-50%, 0, 0);
}

/** 修正跨页面返回 && 返回前后的路由的父亲不一致时，动画重叠的bug **/
[class*="-back-enter-to"] [class*="-back-leave-to"],
[class*="-back-enter-to"] [class*="-back-enter-to"] {
    transition: none;
}
</style>