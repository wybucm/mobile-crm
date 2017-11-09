<template>
    <div class="ui-menu" v-if="visible" v-tap="close">
            <div ref="content" :class="{'arrow-b':arrowB}">
                <b ref="arrow" class="arrow"/>
                <ul>
                    <li v-for="(item,i) in items" :key="item.text" v-tap.stop="[onClick,i,$e]">{{item.text}}</li>
                </ul>
            </div>
    </div>
</template>

<script>
let arrowW = 1, //箭头宽度
    arrowH = 0.6, //箭头高度
    minSpace = 0.5; //菜单与边界的最小距离

export default {
    name: 'vMenu',
    props: {
        items: Array, //菜单项
        anchor: String //锚点的ref值
    },
    data() {
        return {
            visible: false,
            arrowB: false, //超出下边界时，箭头向下指
        };
    },
    methods: {
        open() {
            this.visible = true;
            setTimeout(() => {
                let content = this.$refs.content;
                content.classList.add('visible');
                let styles = document.defaultView.getComputedStyle(content, null),
                    w = parseInt(styles.getPropertyValue('width')), //控件宽高
                    h = parseInt(styles.getPropertyValue('height'));
                if (this.anchor) {
                    let anchor = this.$vnode.context.$refs[this.anchor];
                    if (anchor) {
                        let winW = innerWidth,
                            winH = innerHeight,
                            anchorX = anchor.offsetLeft,
                            anchorY = anchor.offsetTop,
                            anchorW = anchor.offsetWidth,
                            anchorH = anchor.offsetHeight,
                            arrowL = '50%', ////箭头对于菜单的left
                            x = anchorX + anchorW / 2 - w / 2,
                            y = anchorY + anchorH + arrowH;
                        if (x < minSpace) { //超出左边界
                            x = minSpace;
                            arrowL = Math.max(anchorX + anchorW / 2 - x, arrowW / 2 + minSpace) + 'px';
                        } else if (x + w + minSpace > winW) { //超出右边界
                            x = winW - w - minSpace;
                            arrowL = Math.min(anchorX + anchorW / 2 - x, w - arrowW / 2 - minSpace) + 'px';
                        }
                        if (y + h + minSpace > winH) { //超出下边界
                            y = anchorY - h - arrowH;
                            content.classList.add('arrow-b');
                        }
                        this.$refs.arrow.style.left = arrowL;
                        content.style.left = x + 'px';
                        content.style.top = y + 'px';
                    }
                }
            });

        },
        close() {
            this.$refs.content.classList.remove('visible');
            setTimeout(() => {
                this.visible = false;
            }, 200);
        },
        onClick(i, e) {
            this.$emit('click', i, e);
            this.close();
        }
    },
    created() {
        arrowW = this.$tools.rem2Px(arrowW);
        arrowH = this.$tools.rem2Px(arrowH);
        minSpace = this.$tools.rem2Px(minSpace);
    }
}
</script>

<style lang="scss">
@import "../../common/css/index";

.ui-menu {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 3000;
    & > div {
        position: absolute;
        opacity: 0;
        transform-origin: 0 top;
        transform: scaleY(0);
        transition: transform 0.15s, opacity 0.15s;
        ul {
            overflow: hidden;
            border-radius: $border-radius;
            box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
            li {
                padding: 0.6rem 2rem;
                border-bottom:solid 1px $gray-border;
                @include button-color(#fff, $normal-font);
                &:last-child {
                    &:after {
                        content: none;
                    }
                }
            }
        }
        b.arrow {
            position: absolute;
            top: -0.95rem;
            margin-left: -0.5rem;
            width: 1rem;
            height: 1rem;
            background: url(ico_arrow.png) center bottom/contain no-repeat;
        }
        &.arrow-b {
            transform-origin: 0 bottom;
            b.arrow {
                top: initial;
                bottom: -0.9rem;
                transform: rotate(180deg);
            }
        }
        &.visible {
            opacity: 1;
            transform: none;
        }
    }
}
.v-menu-enter-active,
.v-menu-leave-active {
    // & > div {
    transform-origin: 0 top;
    transition: transform 0.1s, opacity 0.1s;
    // }
}
.v-menu-enter,
.v-menu-leave-to {
    // & > div {
    opacity: 0;
    transform: scaleY(0);
    // }
}
</style>