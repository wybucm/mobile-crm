<script>
import { slide } from '@/core/events';

const transitionDuring = 300; //动画时长
export default {
    name: 'vCarousel',
    render(createElement) {
        let vnodes = this.$slots.default;
        //计算元素数量
        if (vnodes) {
            this.itemLen = vnodes.reduce((len, item) => {
                if (item.componentOptions.Ctor.extendOptions.name == 'vCarouselItem') {
                    len++;
                }
                return len;
            }, 0);
        } else {
            this.itemLen = 0;
            if (this.wHRatio) {
                this.height = 0;
            }
        }
        //循环播放，则在前后插入额外元素
        if (this.looped && this.itemLen > 1) {
            vnodes = [this.cloneVNode(vnodes.last()), ...vnodes, this.cloneVNode(vnodes[0])];
        }
        //导航器
        let navs = [];
        if (this.nav) {
            for (let i = 0; i < this.itemLen; i++) {
                let cls = {};
                if (i == 0) {
                    cls.active = this.activeIndex == i || this.activeIndex == this.itemLen;
                } else if (i == this.itemLen - 1) {
                    cls.active = this.activeIndex == i || this.activeIndex == -1;
                } else {
                    cls.active = this.activeIndex == i;
                }
                navs.push(createElement('li', {
                    class: cls
                }));
            }
        }
        return createElement(
            'div',
            {
                class: {
                    'ui-carousel': true,
                    touching: this.touching,
                    silent: this.silent
                },
                style: {
                    height: this.height
                },
                on: {
                    touchstart: this.touchstart,
                    touchmove: this.touchmove,
                    touchend: this.touchend,
                    click: this.click
                }
            }, [
                createElement('ul', {
                    class: {
                        'ui-carousel-group': true
                    },
                    style: {
                        transform: this.ulTransform
                    }
                }, vnodes),
                createElement('ul', {
                    class: {
                        'ui-carousel-nav': true
                    }
                }, navs)
            ]);
    },
    props: {
        wHRatio: Number, //宽高比例
        index: { //默认显示第几张
            type: Number,
            default: 0
        },
        looped: { //是否循环
            type: Boolean,
            default: true
        },
        interval: { //自动轮播的间距时长，looped为true时有效，0代表不自动轮播
            type: Number,
            default: 3000
        },
        nav: { //是否显示导航器
            type: Boolean,
            default: true
        }
    },
    data() {
        return Object.assign(slide.data({
            gestureLevel: 50, //手势优先级
            dir: 'x', //滑动方向
        }), {
                itemLen: 0, //vCarouselItem数量
                activeIndex: this.index, //当前下标
                height: this.wHRatio ? innerWidth / this.wHRatio + 'px' : '', //元素高度
                silent: false, //是否不启用动画（用于出界后自动重置）
            });
    },
    computed: {
        ulTransform() { //ul的transform样式
            return `translate3d(${this.pos}px,0,0)`;
        }
    },
    methods: {
        touchstart(e) {
            if (this.itemLen <= 1) {
                this.forbat = true;
                return;
            }
            slide.touchstart.call(this, e);
            this._uxStartX = this.flick; //初始坐标
        },
        touchmove(e) {
            slide.touchmove.call(this, e);
        },
        touchend(e) {
            const ret = slide.touchend.call(this, e);
            if (ret) {
                const diffX = ret.point - this._uxStartX; //整个拖拽过程拖拽的位移
                if (Math.abs(ret.speed) > 0.2) { //瞬时速度足够大
                    if (ret.speed < 0 && diffX < 0) { //瞬时向左划 && 整天向左划
                        this.activeIndex++;
                    } else if (ret.speed > 0 && diffX > 0) { //瞬时向右划 && 整天向右划
                        this.activeIndex--;
                    }
                } else if (Math.abs(diffX) > this._uxWidth / 3) { //划动距离足够大 
                    if (diffX < 0) {
                        this.activeIndex++;
                    } else {
                        this.activeIndex--;
                    }
                }
                this.translate();
                this.startPlay();
            }
        },
        //touchmove时触发，仅触发一次，由slide调用
        touchMoveOnce(e) {
            //计算最小、最大坐标
            this.maxPos = 999999;
            this.minPos = -999999;
            if (!this.looped) {
                if (this.activeIndex == this.itemLen - 1) {
                    this.minPos = -(this.looped ? this.itemLen : (this.itemLen - 1)) * this._uxWidth;
                } else if (this.activeIndex == 0) {
                    this.maxPos = 0;
                }
            } else {
                this.stopPlay();
                if (this.resetTimeoutCode) { //去掉出界重置的setTimeout
                    this.activeIndex = this.checkWall();
                    clearTimeout(this.resetTimeoutCode);
                    this.resetTimeoutCode = null;
                }
            }
        },
        click(e) {
            this.$emit('click', this.checkWall(), e);
        },
        //设置当前下标
        setActiveItem(index) {
            this.activeIndex = index;
        },
        //移动ul
        translate() {
            let index = this.looped ? this.activeIndex + 1 : this.activeIndex;
            this.pos = -index * this._uxWidth;
        },
        //出界判断
        checkWall() {
            const len = this.itemLen,
                v = this.activeIndex;
            if (v < 0) {
                return this.looped ? v + len : 0;
            } else if (v > len - 1) {
                return this.looped ? v - len : (len - 1);
            }
            return v;
        },
        startPlay() {
            this.stopPlay();
            if (this.looped && this.interval) {
                this.intervalCode = setInterval(() => {
                    this.activeIndex++;
                }, this.interval);
            }
        },
        stopPlay() {
            if (this.intervalCode) {
                clearInterval(this.intervalCode);
                this.intervalCode = null;
            }
        },
        //克隆vnode
        cloneVNode(vnode) {
            var cloned = new vnode.constructor(
                vnode.tag,
                vnode.data,
                vnode.children,
                vnode.text,
                vnode.elm,
                vnode.context,
                vnode.componentOptions,
                vnode.asyncFactory
            );
            cloned.ns = vnode.ns;
            cloned.isStatic = vnode.isStatic;
            cloned.key = vnode.key + '-' + vnode.key;
            cloned.isComment = vnode.isComment;
            cloned.isCloned = true;
            return cloned;
        }
    },
    watch: {
        activeIndex(v) {
            const checkedV = this.checkWall();
            if (checkedV != v) {
                if (this.looped) {
                    this.resetTimeoutCode = setTimeout(() => {
                        this.silent = true;
                        this.activeIndex = checkedV;
                        setTimeout(()=>{
                            this.silent = false;
                        }, transitionDuring);
                        this.resetTimeoutCode = null;
                    }, transitionDuring);
                } else { //不循环播放时的出界处理
                    this.activeIndex = checkedV;
                    return;
                }
            }
            this.translate();
            if (!this.silent) {
                this.$emit('change', checkedV);
            }
        },
        looped() {
            this.startPlay();
        },
        interval() {
            this.startPlay();
        },
        itemLen() { //子元素数量变化时，进行出界处理
            this.activeIndex = this.checkWall();
        }
    },
    mounted() {
        this._uxWidth = this.$el.offsetWidth;
        this.translate();
        this.silent = true;
        setTimeout(()=>{
            this.silent = false;
        });
    },
    activated() {
        this.startPlay();
    },
    deactivated() {
        this.stopPlay();
    },
    destroyed() {
        this.stopPlay();
    }
}
</script>

<style lang="scss" rel="stylesheet/scss">
@import '../../common/css/index';

.ui-carousel {
    position: relative;
    width: 100%;
    .ui-carousel-group {
        position: relative;
        height: 100%;
        white-space: nowrap;
        transition: transform .3s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    .ui-carousel-nav {
        position: absolute;
        bottom: 3%;
        width: 100%;
        border-radius: 10rem;
        text-align: center;
        li {
            display: inline-block;
            margin: 0 0.3rem;
            width: 0.5rem;
            height: 0.5rem;
            border-radius: 50%;
            background-color: #fff;
            transition: background 0.3s;
            &.active {
                background-color: $red-bg;
            }
        }
    }
    &.touching .ui-carousel-group,
    &.silent .ui-carousel-group {
        transition-duration: 0s;
    }
}
</style>