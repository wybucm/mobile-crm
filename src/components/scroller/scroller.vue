<template>
    <div :style="style" class="ui-scroller" :class="{'out-wall':outWall,'ui-scroller-x':direction == 'x'}" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend" @webkitTransitionEnd.self="transitionEnd">
        <div v-if="toRefresh" v-show="!loadingMore" class="top-pocket">{{refreshText}}</div>
        <slot></slot>
        <div ref="bottomPocket" v-if="toLoadMore" v-show="loadingMore || nomore" class="bottom-pocket">{{loadMoreText}}</div>
    </div>
</template>

<script>
import { slide } from '@/core/events';
import tools from '@/common/js/tools';

const downEnoughDiff = tools.rem2Px(4), //触发下拉刷新的足够距离
    upEnoughDiff = tools.rem2Px(8), //触发上拉加载的足够距离（拖到底部前的剩余距离）
    topPocketHeight = tools.rem2Px(4), //下拉刷新的文本所占高度
    bottomPocketHeight = Math.floor(tools.rem2Px(3)); //加载更多的文本所占高度

export default {
    name: 'vScroller',
    props: {
        direction: { //滑动方向，x/y
            type: String,
            default: 'y'
        },
        toRefresh: { //是否启用下拉刷新，启用后outTop强制为true
            type: Boolean,
            default: false
        },
        toLoadMore: { //是否启用上拉加载，启用后outBottom强制为true
            type: Boolean,
            default: false
        },
        outTop: { //是否允许下拉出界
            type: Boolean,
            default: false
        },
        outBottom: { //是否允许上拉出界
            type: Boolean,
            default: true
        }
    },
    data() {
        return Object.assign(slide.data({
            gestureLevel: 10, //手势优先级
            dir: this.direction, //滑动方向
            checkAngle: this.direction == 'x', //校验拖拽角度
            outsideTimes: 1 / 3 //出界后的坐标变化比例
        }), {
                outWall: false, //是否出界回弹中
                refreshing: false, //是否正在刷新
                loadingMore: false, //是否正在加载更多
                nomore: false, //是否没有更多数据，刷新后自动置为false
                refreshOff: false, //是否刷新完毕后的回弹状态
                maxPos: 0, //最大坐标
                minToken: 0 //用于触发重算min的标志
            });
    },
    computed: {
        style() { //滚动样式
            return {
                transitionDuration: `${this._uxDuration}ms`,
                transform: 'translate3d(' + (this.direction == 'x' ? `${this.pos}px,0,0)` : `0,${this.pos}px,0)`)
            };
        },
        min() { //计算最小值
            this.minToken;
            let wh = this.direction == 'x' ? 'Width' : 'Height',
                wrap = this.$el.parentNode['offset' + wh],
                el = this.$el['offset' + wh];
            this.$el.style['min' + wh] = wrap + 'px';
            return Math.min(0, wrap - el - (this.loadingMore || this.nomore ? bottomPocketHeight : 0));
        },
        downEnough() { //下拉距离是否足以触发刷新
            return this.pos >= downEnoughDiff;
        },
        upEnough() { //上拉距离是否足以触发加载
            return this.pos <= this.min + upEnoughDiff;
        },
        refreshText() { //刷新文本
            if (this.refreshing) return '正在刷新...';
            if (this.refreshOff) return '刷新成功';
            if (this.downEnough) return '释放立即刷新';
            return '下拉刷新';
        },
        loadMoreText() { //加载更多文本
            if (this.loadingMore) return '正在加载...';
            if (this.nomore) return '已加载全部数据';
            return '加载更多';
        }
    },
    methods: {
        touchstart(e) {
            if (this.refreshOff) { //刷新成功后回弹
                this.forbid = true;
                return;
            }
            if (this.inTransition) { //正在动画，则停止动画
                let tmp = this.pos;
                setTimeout(() => {
                    if (tmp == this.pos) { //如果目标坐标60ms内没有改变，则认为是按住屏幕，停止动画
                        this.scrollTo(this.getComputedTransform(), 0);
                        this.inTransition = false;
                    }
                }, 60);
            }
            slide.touchstart.call(this, e);
            this.outWall = false;
            this.minPos = this.min;
        },
        touchmove(e) {
            if (slide.touchmove.call(this, e) === false) return;
            this.scrollTo(this.pos, 0);
            if (this.toLoadMore && !this.nomore && !this.loadingMore && this.upEnough && !this.refreshing) { //下拉距离足够，执行加载
                this.loadingMore = true;
                this.$emit('loadmore'); //触发loadmore事件
            }
        },
        touchend(e) {
            const ret = slide.touchend.call(this, e);
            if (ret) {
                if (this.checkWall() === false) { //没有出界，启用滑动动画
                    const anim = this.momentum(ret.speed); //计算缓动动画参数
                    this.scrollTo(anim.destination, anim.duration);
                }
                this.inTransition = true;
            }
        },
        transitionEnd() {
            this._uxDuration = 0;
            this.inTransition = false;
            if (this.refreshOff) { //刷新结束后的回弹
                if (this.pos <= 0) {
                    this.refreshOff = false;
                    this.outWall = false;
                }
            } else if (this.outWall) { //出界后回弹
                this.outWall = false;
            } else if (this.checkWall() === false) { //出界处理 false-没有出界
            }
        },
        checkWall() { //滑动结束后的出界检测
            let pos = this.pos;
            if (this.refreshing) {
                if (this.downEnough) {
                    this.outWall = true;
                    this.pos = downEnoughDiff;
                    return;
                }
            }
            if (this.refreshOff) return;
            if (!this.refreshing && !this.loadingMore) {
                if (this.toRefresh && this.downEnough) { //下拉距离足够，执行刷新
                    this.refreshing = true;
                    this.outWall = true;
                    this.pos = downEnoughDiff;
                    this.$emit('refresh'); //触发refresh事件
                    return;
                }
                if (this.toLoadMore && !this.nomore && this.upEnough) { //上拉距离足够，执行加载
                    this.loadingMore = true;
                    this.$emit('loadmore'); //触发loadmore事件
                    this.outWall = true;
                    this.pos = this.min; //回弹到边界
                    return;
                }
            }
            if (pos > 0) {
                pos = 0;
            } else if (pos < this.min) {
                pos = this.min;
            } else {
                return false;
            }
            this.inTransition = true;
            this.outWall = true;
            this.pos = pos;
        },
        /**
         * 刷新高度
         */
        update() {
            this.$nextTick(() => {
                this.minToken++;
                if (this.pos < this.min) { //出界检测与处理
                    this.scrollTo(this.min);
                }
            });
        },
        /**
         * 结束刷新和加载，回弹、重算高度
         * @param {object} opts - 参数
         * @param {Boolean} [opts.nomore=false] - 是否无更多数据
         */
        end({ nomore = false } = {}) {
            if (this.refreshing) { //正在刷新
                this.refreshing = false;
                this.refreshOff = true;
                setTimeout(() => { //停留一会，显示“刷新成功”字样才回弹
                    if (this.pos > 0) {
                        this.refreshOff = true;
                        this.outWall = true;
                        this.pos = 0;
                        this.forbid = true;
                    } else {
                        this.refreshOff = false;
                    }
                }, 500);
            } else if (this.loadingMore) { //正在上拉加载更多
                this.loadingMore = false;
            }
            this.nomore = nomore;
            this.update(); //刷新高度
        },
        /**
         * 滚动到指定位置
         * @param {Number} pos - 目标y坐标
         * @param {Number} [duration=100] - 滚动动画时间，毫秒
         */
        scrollTo(pos, duration = 100) {
            this._uxDuration = duration;
            this.pos = pos;
            this.$emit('scroll', pos);
        },
        momentum(speed) { //根据滑动速度计算滑动目的地
            let deceleration = 0.001, //滑动阻力
                duration = Math.abs(speed) / deceleration, //持续时间
                current = this.pos, //初始y
                destination = current + (speed * speed) / (2 * deceleration) * (speed < 0 ? -1 : 1); //目的地y
            if (destination > 0) {
                if (!this._outTop) {
                    destination = 0;
                } else {
                    destination = this.$tools.rem2Px(2) + (this.refreshing ? topPocketHeight : 0);
                }
                let distance = Math.abs(current) + destination;
                duration = distance / Math.abs(speed);
            } else if (destination < this.min) {
                if (!this._outBottom) {
                    destination = this.min;
                } else {
                    destination = this.min - this.$tools.rem2Px(2) - (this.toLoadMore && !this.loadingMore ? bottomPocketHeight : 0);
                }
                let distance = Math.abs(destination - current);
                duration = distance / Math.abs(speed);
            }
            return {
                destination: Math.round(destination),
                duration: duration
            };
        },
        /**
         * 获取指定元素的瞬时transform的x/y，用于动画中获取位置用
         * @return pos
         */
        getComputedTransform: function () {
            var styles = document.defaultView.getComputedStyle(this.$el, null),
                translateString = styles.getPropertyValue(this.$equipment.cssPre + 'transform') || styles[this.$equipment.cssPre + 'transform'],
                matches = translateString.match(/[\-\d\.]+/g);
            return Number(matches[this.direction == 'x' ? 4 : 5]);
        }
    },
    created() {
        this._outTop = this.toRefresh || this.outTop;
        this._outBottom = this.toLoadMore || this.outBottom;
        if (!this._outTop) {
            this.outsideTimes[0] = 0;
        }
        if (!this._outBottom) {
            this.outsideTimes[1] = 0;
        }
        this._uxDuration = 0; //动画持续时间
    },
    mounted() {
        this.$el.parentNode.classList.add('ui-scroller-wrap');
        setTimeout(() => {
            this.update();
        }, 0);
    }
}
</script>

<style lang="scss" rel="stylesheet/scss">
@import "../../common/css/index";

.ui-scroller {
    position: relative;
    z-index: 1;
    box-sizing: border-box;
    background-color: $gray-bg;
    transition: transform 0ms cubic-bezier(0.1, 0.57, 0.1, 1);
    .top-pocket {
        position: absolute;
        left: 0;
        bottom: 100%;
        width: 100%;
        line-height: 4;
        text-align: center;
        color: #666;
    }
    .bottom-pocket {
        border-top: solid 1px $gray-border;
        position: absolute;
        top: 100%;
        width: 100%;
        line-height: 3;
        text-align: center;
        color: #666;
    }
    &.ui-scroller-x {
        float: left;
    }
    &.out-wall {
        transition: transform 300ms cubic-bezier(0.165, 0.84, 0.44, 1) !important;
    }
}

.ui-scroller-wrap {
    position: relative;
    overflow: hidden;
}
</style>