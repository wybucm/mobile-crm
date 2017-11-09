<template>
    <transition name="v-picker">
        <div class="ui-date-picker" v-if="visible" v-tap="close">
            <div @touchend.stop="$tools.noop">
                <h3 v-if="title">{{title}}</h3>
                <div class="li-title">
                    <h5 v-for="i in 5" :key="i" :style="{marginLeft:i==1? left[0]+'%': 0,width:90/5+'%'}">
                        {{liTitls[i-1]}}
                    </h5>
                </div>
                <div ref="body" class="body" :class="{touching}" @touchstart="touchstart($event)" @touchmove="touchmove($event)" @touchend="touchend($event)">
                    <div class="rule"></div>
                    <ul v-for="i in 5" :key="i" :style="{transform:rotateX[i-1],left:left[i-1]+'%',width:90/5+'%'}">
                        <li v-for="(item,j) in liFillers[i-1]" :key="item" :class="{hidden:Math.abs(angles[i-1]- j*20)>=180 || (i==3 && item > dateRange[2]),disabled:item>maxOptions[i-1] || item<minOptions[i-1]}" :style="`transform: translateZ(${r}px) rotateX(${j*-20}deg)`">
                            {{item}}
                        </li>
                    </ul>
                </div>
                <div class="btns">
                    <v-button @click="close">取消</v-button>
                    <v-button v-if="clearBtn" @click="clear">清空</v-button>
                    <v-button @click="confirm">确定</v-button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: "vDatePicker",
    props: {
        title: String, //标题
        value: String, //值
        max: String, //最大值
        min: String, //最小值
        clearBtn: Boolean, //是否带清除按钮
    },
    data() {
        let angles = [];
        angles.length = 5;
        angles.fill(0);

        return {
            gestureLevel: 100, //手势优先级
            visible: false, //是否可见
            r: 94, //3d旋转半径
            angles, //每列的滚动角度
            liTitls: this.fillLiTitles(), //列标题
            left: this.calcLeft(), //各列left值
            forbid: false, //是否禁止拖拽
            touching: false, //是否正在拖拽
            pointY: 0, //实时手指坐标
            flick: 0, //瞬时手指坐标（用于计算缓动动画）
            flickTime: 0, //瞬时时间
            monthAdder: 0, //促使monthRange重新计算的标志
            dateAdder: 0, //促使dateRange重新计算的标志
            hourAdder: 0, //促使hourRange重新计算的标志
            minuteAdder: 0 //促使minuteRange重新计算的标志
        };
    },
    computed: {
        rotateX() {
            //每列滚动角度
            return this.angles.map(item => `perspective(1000px) rotateX(${item}deg)`);
        },
        liFillers() {
            //每列的内容
            this.max; //为了使max和min改变时触发liFillers改变
            this.min;
            const arr = [],
                minY = this._uxMinDate.getFullYear(),
                maxY = this._uxMaxDate.getFullYear();
            //年
            arr[0] = [];
            for (let i = minY; i <= maxY; i++) {
                arr[0].push(i);
            }
            //月
            arr[1] = [];
            for (let i = 1; i <= 12; i++) {
                arr[1].push(i);
            }
            //日
            arr[2] = [];
            for (let i = 1; i <= 31; i++) {
                arr[2].push(i);
            }
            //时
            arr[3] = [];
            for (let i = 0; i < 24; i++) {
                arr[3].push(i);
            }
            //分
            arr[4] = [];
            for (let i = 0; i < 60; i++) {
                arr[4].push(i);
            }
            return arr;
        },
        monthRange() {
            //选择年后，计算最大最小月份
            this.value;
            this.max;
            this.min;
            this.monthAdder;
            let y = this._uxDate.getFullYear(),
                range = [1, 12];
            if (y == this._uxMinDate.getFullYear()) {
                range[0] = this._uxMinDate.getMonth() + 1;
            }
            if (y == this._uxMaxDate.getFullYear()) {
                range[1] = this._uxMaxDate.getMonth() + 1;
            }
            this.outRange(1, range);
            return range;
        },
        dateRange() {
            //选择年月后，计算最大最小日
            this.value;
            this.max;
            this.min;
            this.monthAdder;
            this.dateAdder;
            let ym = this._uxDate.format("Ym"),
                range = [1, this._uxDate.getDayNum()];
            range[2] = range[1];
            if (ym == this._uxMinDate.format("Ym")) {
                range[0] = this._uxMinDate.getDate();
            }
            if (ym == this._uxMaxDate.format("Ym")) {
                range[1] = this._uxMaxDate.getDate();
            }
            this.outRange(2, range);
            return range;
        },
        hourRange() {
            //选择年月后，计算最大最小日
            this.value;
            this.max;
            this.min;
            this.monthAdder;
            this.dateAdder;
            this.hourAdder;
            let ymd = this._uxDate.format("Ymd"),
                range = [0, 23];
            if (ymd == this._uxMinDate.format("Ymd")) {
                range[0] = this._uxMinDate.getHours();
            }
            if (ymd == this._uxMaxDate.format("Ymd")) {
                range[1] = this._uxMaxDate.getHours();
            }
            this.outRange(3, range);
            return range;
        },
        minuteRange() {
            //选择年月后，计算最大最小日
            this.value;
            this.max;
            this.min;
            this.monthAdder;
            this.dateAdder;
            this.hourAdder;
            this.minuteAdder;
            let ymdh = this._uxDate.format("YmdH"),
                range = [0, 59];
            if (ymdh == this._uxMinDate.format("YmdH")) {
                range[0] = this._uxMinDate.getMinutes();
            }
            if (ymdh == this._uxMaxDate.format("YmdH")) {
                range[1] = this._uxMaxDate.getMinutes();
            }
            this.outRange(4, range);
            return range;
        },
        maxOptions() {
            //每列最大选项
            return [
                this._uxMaxDate.getFullYear(),
                this.monthRange[1],
                this.dateRange[1],
                this.hourRange[1],
                this.minuteRange[1]
            ];
        },
        minOptions() {
            //每列最小选项
            return [
                this._uxMinDate.getFullYear(),
                this.monthRange[0],
                this.dateRange[0],
                this.hourRange[0],
                this.minuteRange[0]
            ];
        },
        maxAngles() {
            //每列最大滚动角度
            let arr = [];
            for (let i = 0, min = [this.minOptions[0], 1, 1, 0, 0]; i <= 5; i++) {
                arr.push((this.maxOptions[i] - min[i]) * 20 + 10);
            }
            return arr;
        },
        minAngles() {
            //每列小 滚动角度
            let arr = [];
            for (let i = 0, min = [this.minOptions[0], 1, 1, 0, 0]; i <= 5; i++) {
                arr.push((this.minOptions[i] - min[i]) * 20 - 10);
            }
            return arr;
        }
    },
    methods: {
        touchstart(e) {
            if (this._uxAnim.int) {
                //正在上一轮的滚动动画，则停止动画
                this.touching = false;
                this.selectByAngle(this._uxAnim.ul, this.angles[this._uxAnim.ul]);
                clearInterval(this._uxAnim.int);
                this._uxAnim.int = null;
            }
            this.pointY = this.flick = e.touches[0].pageY;
            this.flickTime = e.timeStamp;
            this.forbid = false;
            //根据手指坐标，计算拖拽的ul下标
            let x = e.touches[0].pageX / this.$refs.body.offsetWidth * 100,
                i = 1;
            for (; i < 5 && x > this.left[i]; i++);
            this._uxUl = i-1;
        },
        touchmove(e) {
            if (this.forbid) return false;
            if (!this.touching) {
                //手势优先级处理
                this.$store.commit("gestureIf", this);
                if (this._uid != this.$store.state.gesture.id) {
                    //正在拖拽别的优先级更高的控件
                    this.forbid = true;
                    return;
                }
                this.touching = true;
            }
            e.preventDefault();
            let ul = this._uxUl,
                diff = e.touches[0].pageY - this.pointY,
                angle = this.angles[ul] + this.diff2Angle(diff);
            angle = Math.max(Math.min(angle, this.maxAngles[ul]), this.minAngles[ul]);
            this.$set(this.angles, ul, angle);
            this.pointY += diff;
            if (e.timeStamp - this.flickTime > 300) {
                //记录瞬时信息
                this.flick = this.pointY;
                this.flickTime = e.timeStamp;
            }
        },
        touchend(e) {
            if (!this.touching) return false;
            let speed = 0, //瞬时速度
                point = e.changedTouches[0].pageY; //松手坐标
            if (e.timeStamp > this.flickTime) {
                speed = (point - this.flick) / (e.timeStamp - this.flickTime);
            }
            this.inertiaScroll(this._uxUl, speed);
            this.$store.commit("gesture"); //还原手势状态
        },
        setValue() {
            let d = this._uxDate,
                val = [
                    d.getFullYear(),
                    d.getMonth() + 1,
                    d.getDate(),
                    d.getHours(),
                    d.getMinutes()
                ],
                min = [this.minOptions[0], 1, 1, 0, 0];
            for (let i = 0; i <= 5; i++) {
                this.$set(this.angles, i, (val[i] - min[i]) * 20);
            }
        },
        update(ul, li) {
            //更新this._uxDate
            switch (ul) {
                case 0: //年
                case 1: //月
                    let day = this._uxDate.getDate();
                    this._uxDate.setDate(1); //先把日置1，避免设置年月时进1
                    if (ul == 0) {
                        //年
                        this._uxDate.setFullYear(this.liFillers[0][li]);
                        this.monthAdder++;
                    } else {
                        //月
                        this._uxDate.setMonth(li);
                        this.dateAdder++;
                    }
                    let dayNum = this._uxDate.getDayNum(); //该月最大天数
                    if (day > dayNum) {
                        //当前选择的天大于该月最大天数
                        this._uxDate.setDate(dayNum);
                        this.update(2, dayNum - 1);
                    } else {
                        this._uxDate.setDate(day); //回填日
                    }
                    break;
                case 2: //日
                    this._uxDate.setDate(li + 1);
                    this.hourAdder++;
                    break;
                case 3: //时
                    this._uxDate.setHours(li);
                    this.minuteAdder++;
                    break;
                case 4: //分
                    this._uxDate.setMinutes(li);
                    break;
            }
        },
        outRange(ul, range) {
            //超出有效范围判断与处理
            let min = ul <= 2 ? range[0] - 1 : range[0],
                max = ul <= 2 ? range[1] - 1 : range[1];
            if (!this._uxAnim.int && this.angles[ul] < min * 20 - 10) {
                this.update(ul, min);
                this.$set(this.angles, ul, min * 20);
            }
            if (!this._uxAnim.int && this.angles[ul] > max * 20 + 10) {
                this.update(ul, max);
                this.$set(this.angles, ul, max * 20);
            }
        },
        selectByAngle(ul, angle) {
            //根据角度，选中最接近的li（动画结束后调用）
            //根据角度，计算最接近的li下标
            let index;
            if (angle <= this.minAngles[ul]) {
                index = Math.ceil(this.minAngles[ul] / 20);
            } else if (angle >= this.maxAngles[ul]) {
                index = Math.floor(this.maxAngles[ul] / 20);
            } else {
                index = Math.round(angle / 20);
            }
            this.$set(this.angles, ul, index * 20);
            this.update(ul, index);
        },
        open() {
            this.visible = true;
        },
        close() {
            this.visible = false;
        },
        clear(){
            this.$emit("input", '');
            this.close();
        },
        confirm() {
            //确定
            let v = this._uxDate.format("YmdHi");
            this.$emit("input", v);
            this.close();
        },
        diff2Angle(v) {
            //长度转换为角度
            let r = this.r,
                c = Math.abs(v); //只算角度不关心正否值
            let intDeg = Math.floor(c / r / 2) * 180;
            c = c % (r * 2);
            //余弦定理
            let cosC = (r * r * 2 - c * c) / (2 * r * r),
                angleC = intDeg + Math.acos(cosC) * 180 / Math.PI;
            return angleC * (v > 0 ? -1 : 1);
        },
        fillLiTitles() {
            //各列标题
            return ["年", "月", "日", "时", "分"];
        },
        calcLeft() {
            //计算各列的left值
            let tot = 90,
                w = Math.min(tot / 5, 20),
                sum = w * 5,
                left = (100 - sum) / 2,
                arr = [left];
            for (let i = 1; i < 5; i++) {
                left += w;
                arr[i] = left;
            }
            return arr;
        },
        inertiaScroll(ul, speed) {
            //惯性滚动
            let deceleration = 0.001 * (speed > 0 ? -1 : 1), //速度减小速度
                duration = -speed / deceleration, //速度消减至0所需时间 （毫秒）
                dist = speed * duration / 2, //最终移动距离
                distAngle = this.diff2Angle(dist), //滑动角度
                startAngle = this.angles[ul], //起始角度
                srcDistAngle = distAngle,
                minAngle = this.minAngles[ul],
                maxAngle = this.maxAngles[ul];
            if (startAngle + distAngle < minAngle) {
                distAngle = minAngle - startAngle;
                duration = duration * (distAngle / srcDistAngle) * 0.8;
            } else if (startAngle + distAngle > maxAngle) {
                distAngle = maxAngle - startAngle;
                duration = duration * (distAngle / srcDistAngle) * 0.8;
            }
            if (distAngle == 0 || duration < 17) {
                this.touching = false;
                this.selectByAngle(ul, startAngle);
                return;
            }
            //动画
            let _eachTime = 1000 / 60, //每帧间隔
                _dist = 0, //瞬时滑动距离
                _v = speed * _eachTime, //滑动速度
                _addUpTime = 0; //动画累计时间
            this._uxAnim = {
                ul,
                int: null
            };
            this._uxAnim.int = setInterval(() => {
                _dist += _v;
                this.$set(this.angles, ul, startAngle + this.diff2Angle(_dist));
                _addUpTime += _eachTime;
                if (
                    _addUpTime >= duration ||
                    this.angles[ul] > this.maxAngles[ul] ||
                    this.angles[ul] < this.minAngles[ul]
                ) {
                    //停止动画
                    this.touching = false;
                    this.selectByAngle(ul, this.angles[ul]);
                    clearInterval(this._uxAnim.int);
                    this._uxAnim.int = null;
                }
                _v += deceleration * _eachTime * _eachTime;
            }, _eachTime);
        }
    },
    watch: {
        value(v) {
            this._uxDate = v? this.$tools.string2Date(v): new Date();
            this.setValue();
        },
        max(v) {
            this._uxMaxDate = this.$tools.string2Date(this.max);
        },
        min(v) {
            this._uxMinDate = this.$tools.string2Date(this.min);
        }
    },
    created() {
        this._uxDate = this.value? this.$tools.string2Date(this.value): new Date();
        this._uxMaxDate = this.$tools.string2Date(this.max);
        this._uxMinDate = this.$tools.string2Date(this.min);
        this._uxAnim = {
            //惯性滚动的参数
            ul: -1,
            int: null
        };
        this.setValue();
    }
};
</script>

<style lang="scss">
@import "./picker";

.ui-date-picker {
    @extend %ui-picker;
    & > div {
        .li-title {
            overflow: hidden;
            background: #f7f7f7;
            border-bottom: solid 1px $gray-border;
            h5 {
                float: left;
                max-width: 20%;
                line-height: 2.5;
                text-align: center;
            }
        }
        .body {
            position: relative;
            height: 12rem;
            -webkit-mask-box-image: -webkit-linear-gradient(
                bottom,
                transparent,
                transparent 5%,
                #fff 20%,
                #fff 80%,
                transparent 95%,
                transparent
            );
            ul {
                position: absolute;
                left: 0;
                top: 50%;
                margin-top: -17px;
                max-width: 20%;
                line-height: 36px;
                height: 36px;
                text-align: center;
                transform-style: preserve-3d;
                color: $light-font;
                transition: 0.15s ease-out;
                li {
                    position: absolute;
                    left: 0;
                    top: 0;
                    margin: 0 10%;
                    width: 80%;
                    transform-origin: center center -94px;
                    backface-visibility: hidden;
                    @extend %no-break;
                    &.hidden {
                        visibility: hidden;
                    }
                    &.disabled {
                        text-decoration: line-through;
                        color: $disabled-font;
                    }
                }
                .ios & {
                    transform-origin: center center 94px;
                }
            }
            .rule {
                position: absolute;
                left: 0px;
                top: 50%;
                box-sizing: border-box;
                margin-top: -18px;
                border-width: 1px 0;
                border-style: solid;
                border-color: rgba(0, 0, 0, 0.1);
                width: 100%;
                height: 36px;
            }
            &.touching {
                ul {
                    transition: none;
                }
            }
        }
    }
}
</style>