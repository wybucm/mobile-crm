<template>
    <div class="ui-grid" :class="{'editable':editable,'dragging':dragging}" :style="style">
        <ul ref="ul">
            <li v-for="(item,i) in myItems" :key="item.text" v-tap="[onClick,i,$e]" v-hold="[onHold,i,$e]" :style="calcLiStyle(i)">
                <!--<span :style="'background-image:url('+item.icon+')'" />-->
                <span class="function" :class="'icon-'+item.iconFunc"></span>
                <span :class="'icon-'+item.icon">
                    <span v-for="i in item.count" :class="'path'+i"></span>
                </span>
                <label>{{item.text}}</label>
            </li>
        </ul>
    </div>
</template>

<script>
import tools from '@/common/js/tools';

//编辑模式下的常量
const totW = innerWidth, //容器宽度
    eachLiMargin = [totW * 0.036666, tools.rem2Px(0.5)], //每个宫格的边距
    eachLiRoom = [totW / 3, tools.rem2Px(5.5)], //每个宫格所占位置（大小+边距）
    eachLiSize = [eachLiRoom[0] - eachLiMargin[0] * 2, eachLiRoom[1] - eachLiMargin[1] * 2]; //每个宫格的大小

export default {
    name: 'vGrid',
    props: {
        items: Array, //宫格数据
        editable: Boolean //是否可编辑
    },
    data() {
        return {
            dragging: false, //是否正在拖拽
            dragSource: -1, //拖拽宫格的下标
            dragDest: -1, //拖拽目的地下标
        };
    },
    computed: {
        myItems() {
            return this.editable ? [...this.items] : this.items;
        },
        style() {
            if (this.editable) { //编辑模式，高度需要动态计算
                return {
                    // height: Math.ceil(this.myItems.length / 3) * eachLiRoom[1] + 'px'
                }
            }
        }
    },
    methods: {
        onClick(i, e) {
            this.$emit('click', this.myItems[i], i, e);
        },
        onHold(i, e) {
            if (this.editable) {
                this._uxOffsetTop = this.$el.offsetTop;
                this._uxOffsetH = this.$el.offsetHeight;
                let el = this.$refs.ul.querySelectorAll('li')[i],
                    point = [e.targetTouches[0].pageX, e.targetTouches[0].pageY],
                    pos = this.calcPositionByIndex(i),
                    translate = [point[0] - pos.left - eachLiSize[0] / 2, point[1] - this._uxOffsetTop - pos.top - eachLiSize[1] / 2];
                this._uxDrag = {
                    el, //按住的li
                    point, //手指坐标
                    pos,//li的坐标
                    translate, //li的坐标偏移
                };
                el.classList.add('drag-source');
                el.style[this.$equipment.cssPre + 'transform'] = `translate3d(${translate[0]}px,${translate[1]}px,0)`;
                this.$el.addEventListener('touchmove', this.touchmove);
                this.$el.addEventListener('touchend', this.touchend);
                this.dragSource = this.dragDest = i;
                setTimeout(() => {
                    this.dragging = true;
                }, 100);
            }
        },
        touchmove(e) {
            let x = e.targetTouches[0].pageX,
                y = e.targetTouches[0].pageY,
                translate = this._uxDrag.translate;
            translate[0] += x - this._uxDrag.point[0];
            translate[1] += y - this._uxDrag.point[1];
            this._uxDrag.point = [x, y];
            this.calcDragDest(x, y); //计算目的地下标
            this.outWall(); //出界处理
            this._uxDrag.el.style[this.$equipment.cssPre + 'transform'] = `translate3d(${translate[0]}px,${translate[1]}px,0)`;
        },
        touchend(e) {
            //交换位置
            if (this.dragSource != this.dragDest) {
                let item = this.myItems.splice(this.dragSource, 1)[0];
                this.myItems.splice(this.dragDest, 0, item);
                this.$emit('change', this.myItems);
            }

            let el = this._uxDrag.el,
                pos = this._uxDrag.pos,
                pos2 = this.calcPositionByIndex(this.dragDest),
                translate = this._uxDrag.translate;
            let x = translate[0] - (pos2.left - pos.left),
                y = translate[1] - (pos2.top - pos.top);
            el.style[this.$equipment.cssPre + 'transform'] = `translate3d(${x}px,${y}px,0)`;
            document.defaultView.getComputedStyle(el, null).getPropertyValue('transform');
            this.dragSource = this.dragDest = -1;
            this.dragging = false;
            setTimeout(() => {
                el.style[this.$equipment.cssPre + 'transform'] = 'none';
                setTimeout(() => {
                    el.classList.remove('drag-source');
                }, 200);
            }, 50);
            this.$el.removeEventListener('touchmove', this.touchmove);
            this.$el.removeEventListener('touchend', this.touchend);
        },
        calcLiStyle(i) { //计算各个宫格位置
            if (this.editable) {
                let pos = this.calcPositionByIndex(i),
                    i2 = i,
                    transform = 'none';
                if (i > this.dragSource && this.dragDest >= i) {
                    i2--;
                } else if (i < this.dragSource && this.dragDest <= i) {
                    i2++;
                }
                if (i2 != i) {
                    let pos2 = this.calcPositionByIndex(i2);
                    transform = `translate3d(${pos2.left - pos.left}px, ${pos2.top - pos.top}px, 0)`;
                }
                return {
                    // left: pos.left + 'px',
                    // top: pos.top + 'px',
                    transform
                };
            }
        },
        calcPositionByIndex(i) { //根据下标计算left、top
            let row = Math.floor(i / 3),
                column = i % 3;
            return {
                left: column * eachLiRoom[0] + eachLiMargin[0],
                top: row * eachLiRoom[1] + eachLiMargin[1]
            }
        },
        calcDragDest(x, y) { //计算拖拽目的地下标
            const len = this.myItems.length;
            let column = Math.floor(x / eachLiRoom[0]);
            column = Math.max(Math.min(column, 2), 0);
            let row = Math.floor((y - this._uxOffsetTop) / eachLiRoom[1]);
            row = Math.max(Math.min(row, Math.ceil(len / 3) - 1), 0);
            let dest = row * 3 + column;
            if (dest > len - 1) {
                column -= dest - len + 1;
                dest = len - 1;
            }
            this.dragDest = dest;
        },
        outWall(x, y) { //拖拽过程中的出界检测与处理
            let limitX = eachLiSize[0] / 10,
                limitY = eachLiSize[1] / 10,
                dragInfo = this._uxDrag,
                outX = false,
                outY = false;
            if (dragInfo.pos.left + dragInfo.translate[0] < -limitX) { //左边界
                dragInfo.translate[0] = -limitX - dragInfo.pos.left;
                outX = true;
            } else if (dragInfo.pos.left + dragInfo.translate[0] + eachLiSize[0] > totW + limitX) { //右边界
                dragInfo.translate[0] = totW + limitX - eachLiSize[0] - dragInfo.pos.left;
                outX = true;
            }
            if (dragInfo.pos.top + dragInfo.translate[1] < -limitY) { //上边界
                dragInfo.translate[1] = -limitY - dragInfo.pos.top;
                outY = true;
            } else if (dragInfo.pos.top + dragInfo.translate[1] + eachLiSize[1] > this._uxOffsetH + limitY) { //下边界
                dragInfo.translate[1] = this._uxOffsetH + limitY - eachLiSize[1] - dragInfo.pos.top;
                outY = true;
            }
            if (outX) {
                dragInfo.point[0] = dragInfo.translate[0] + dragInfo.pos.left + eachLiSize[0] / 2;
            }
            if (outY) {
                dragInfo.point[1] = dragInfo.translate[1] + this._uxOffsetTop + dragInfo.pos.top + eachLiSize[1] / 2;
            }
        }
    }
}
</script>

<style lang="scss">
@import "../../common/css/index";

.ui-grid {
    overflow: hidden;
    background-color: #fff;
    li {
        float: left;
        padding: 1.5rem 0;
        width: 33%;
        border-bottom: 1px solid #e6e6e6;
        border-right: 1px solid #e6e6e6;
        @include bg(#fff);
        // span {
        //     display: block;
        //     margin: 0 auto;
        //     padding-top: 25%;
        //     width: 25%;
        //     background: 0/contain no-repeat;
        // }
        label {
            display: block;
            margin: 0 auto;
            width: 90%;
            line-height: 2;
            text-align: center;
            font-size: 0.9rem;
            @extend %no-break;
        }
        &:nth-child(3n+0){
            border-right: none;
        }
    }
    &.editable {
        position: relative;
        li {
            // position: absolute;
            margin: 0;
            width: 33%;
            height: 4.5rem;
            background-color: #fff;
            text-align: center;
            position: relative;
            // border-radius: $border-radius;
            &.drag-source {
                z-index: 1;
                opacity: 0.7;
                box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
                transition: opacity 0.1s, box-shadow 0.1s, transform 0.2s;
            }
            [class*=" icon-"],[class^="icon-"]{
                font-size: 3rem;
                &.function{
                    font-size: initial;
                    position: absolute;
                    top: 0.3rem;
                    right: 0.3rem;
                }
            }
        }
        &.dragging {
            li {
                transition: transform 0.3s;
                &.drag-source {
                    transition: none;
                }
            }
        }
    }
}
</style>