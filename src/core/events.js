/**
 * 事件封装
 */
import Vue from "vue";
import tools from "@/common/js/tools";

Vue.prototype.$e = new MouseEvent("tap"); //注入一个tap/hold事件对象的占位符

/**
 * 点击事件，比click更快的点击
 */
let tapMap = {}, //记录各个dom元素的tap事件参数
    tapIdIndex = 0; //自动添加的dom id的下标
const tapTimeThreshold = 1000, //touchstart和touchend的时间允许范围
    tapDiffThreshold = tools.rem2Px(0.5); //touchstart和touchend的坐标允许范围
const tap = {
    bind(el, binding) {
        let id = el.id;
        if (!id) {
            //元素没有id，则强制添加
            el.id = id = "v_tap_" + tapIdIndex++;
        }
        if (tapMap[id]) {
            tap.unbind(el);
        }
        let fn = binding.value,
            params = [];
        if (Array.isArray(fn)) {
            //指令值为数组，则首个元素为事件函数，后面的为函数参数
            params = fn.slice(1);
            fn = fn[0];
        } else {
            //否则指令值为事件函数，函数参数为event对象
            params = [Vue.prototype.$e];
        }
        let t = 0, //touchstart的时间戳
            x = -100, //touchstart的坐标
            y = -100;
        tapMap[id] = {
            fn,
            params,
            forbit: false, //是否被禁止（由hold事件控制，避免事件冲突）
            touchstart(e) {
                if (Object.getDeepValue(binding, 'modifiers', 'stop')) {
                    e.stopPropagation();
                }
                t = e.timeStamp;
                x = e.targetTouches[0].pageX;
                y = e.targetTouches[0].pageY;
                tapMap[this.id].forbit = false;
            },
            touchend(e) {
                if (e.timeStamp - t < tapTimeThreshold) {
                    let diff = Math.sqrt(
                        Math.pow(e.changedTouches[0].pageX - x, 2) +
                            Math.pow(e.changedTouches[0].pageY - y, 2)
                    );
                    if (diff < tapDiffThreshold) {
                        let map = tapMap[this.id];
                        if (!map || map.forbit) return;
                        e.preventDefault();
                        e.stopPropagation();
                        let params = map.params.map(item => {
                            if (
                                item instanceof MouseEvent &&
                                item.type == "tap"
                            ) {
                                //把$e替换成事件对象
                                return e;
                            }
                            return item;
                        });
                        map.fn(...params);
                    }
                }
            }
        };
        el.addEventListener("touchstart", tapMap[id].touchstart);
        el.addEventListener("touchend", tapMap[id].touchend);
    },
    update(el, binding) {
        let fn = binding.value,
            params;
        if (Array.isArray(fn)) {
            params = fn.slice(1);
            fn = fn[0];
        } else {
            //否则指令值为事件函数，函数参数为event对象
            params = [Vue.prototype.$e];
        }
        tapMap[el.id].fn = fn;
        tapMap[el.id].params = params;
    },
    unbind(el) {
        el.removeEventListener("touchstart", tapMap[el.id].touchstart);
        el.removeEventListener("touchend", tapMap[el.id].touchend);
        delete tapMap[el.id];
    }
};

/**
 * 长按事件
 */
let holdMap = {}, //记录各个dom元素的hold事件参数
    holdIdIndex = 0; //自动添加的dom id的下标
const holdTimeThreshold = 500, //按下触发长按所需的时长
    holdDiffThreshold = tools.rem2Px(0.5); //touchstart和touchend的坐标允许范围
const hold = {
    bind(el, binding) {
        let id = el.id;
        if (!id) {
            //元素没有id，则强制添加
            el.id = id = "v_hold_" + holdIdIndex++;
        }
        let fn = binding.value,
            params = [];
        if (Array.isArray(fn)) {
            //指令值为数组，则首个元素为事件函数，后面的为函数参数
            params = fn.slice(1);
            fn = fn[0];
        } else {
            //否则指令值为事件函数，函数参数为event对象
            params = [Vue.prototype.$e];
        }
        let t = 0, //touchstart的时间戳
            x = -100, //touchstart的坐标
            y = -100;
        holdMap[id] = {
            fn,
            params,
            timeoutId: null,
            touchstart(e) {
                if (Object.getDeepValue(binding, 'modifiers', 'stop')) {
                    e.stopPropagation();
                }
                t = e.timeStamp;
                x = e.targetTouches[0].pageX;
                y = e.targetTouches[0].pageY;
                let map = holdMap[this.id];
                if (map.timeoutId) {
                    clearTimeout(map.timeoutId);
                }
                map.timeoutId = setTimeout(() => {
                    e.preventDefault();
                    let map = holdMap[this.id];
                    if (!map) return;
                    params = map.params.map(item => {
                        if (item instanceof MouseEvent && item.type == "tap") {
                            //把$e替换成事件对象
                            return e;
                        }
                        return item;
                    });
                    map.fn(...params);
                    map.timeoutId = null;
                    if (tapMap[this.id]) {
                        //如果该元素也绑定了tap，则禁止本次触发tap
                        tapMap[this.id].forbit = true;
                    }
                }, holdTimeThreshold);
            },
            touchmove(e) {
                let map = holdMap[this.id];
                if (map.timeoutId) {
                    e.preventDefault();
                    let diff = Math.sqrt(
                        Math.pow(e.targetTouches[0].pageX - x, 2) +
                            Math.pow(e.targetTouches[0].pageY - y, 2)
                    );
                    if (diff > holdDiffThreshold) {
                        clearTimeout(map.timeoutId);
                        map.timeoutId = null;
                    }
                }
            },
            touchend(e) {
                let map = holdMap[this.id];
                if (!map) return;
                if (map.timeoutId) {
                    clearTimeout(map.timeoutId);
                    map.timeoutId = null;
                }
            }
        };
        el.addEventListener("touchstart", holdMap[id].touchstart);
        el.addEventListener("touchmove", holdMap[id].touchmove);
        el.addEventListener("touchend", holdMap[id].touchend);
    },
    update(el, binding) {
        let fn = binding.value,
            params;
        if (Array.isArray(fn)) {
            params = fn.slice(1);
            fn = fn[0];
        } else {
            //否则指令值为事件函数，函数参数为event对象
            params = [Vue.prototype.$e];
        }
        let map = holdMap[el.id];
        if (map.timeoutId) {
            clearTimeout(map.timeoutId);
        }
        holdMap[el.id].fn = fn;
        holdMap[el.id].params = params;
    },
    unbind(el) {
        let map = holdMap[el.id];
        if (map.timeoutId) {
            clearTimeout(map.timeoutId);
        }
        el.removeEventListener("touchstart", holdMap[el.id].touchstart);
        el.removeEventListener("touchmove", holdMap[el.id].touchmove);
        el.removeEventListener("touchend", holdMap[el.id].touchend);
        delete holdMap[el.id];
    }
};

/**
 * 滑动事件，滑动类控件专用
 */
const slide = {
    data({ gestureLevel, dir, checkAngle = true, outsideTimes = 0 }) {
        if (!Array.isArray(outsideTimes)) {
            outsideTimes = [outsideTimes, outsideTimes];
        }
        return {
            gestureLevel, //手势优先级
            dirName: dir == "x" ? "pageX" : "pageY", //滑动方向，x/y
            forbid: false, //是否禁止拖拽
            touching: false, //是否正在拖拽
            pos: 0, //实时坐标
            maxPos: 999999, //最大坐标
            minPos: -999999, //最小坐标
            checkAngle, //是否需要校验拖拽角度
            outsideTimes, //出界之后，拖拽的距离为原距离的多少倍
            points: {
                //实时手指坐标
                pageX: 0,
                pageY: 0
            },
            flick: 0, //拖拽过程中主轴瞬时坐标
            flickTime: 0 //拖拽过程中瞬时时间
        };
    },
    touchstart(e) {
        this.points.pageX = e.touches[0].pageX;
        this.points.pageY = e.touches[0].pageY;
        this.flick = this.points[this.dirName];
        this.flickTime = e.timeStamp;
        this.forbid = false;
    },
    touchmove(e) {
        if (this.forbid) return false;
        let diff = e.touches[0][this.dirName] - this.points[this.dirName];
        if (!this.touching) {
            if (this.checkAngle) {
                const otherDir = this.dirName == "pageX" ? "pageY" : "pageX",
                    otherDiff = e.touches[0][otherDir] - this.points[otherDir];
                if (Math.abs(diff) < Math.abs(otherDiff)) {
                    //拖拽的主轴方向距离<副轴，不启用拖拽
                    this.forbid = true;
                    return;
                }
            }
            //手势优先级处理
            this.$store.commit("gestureIf", this);
            if (this._uid != this.$store.state.gesture.id) {
                //正在拖拽别的优先级更高的控件
                this.forbid = true;
                return;
            }
            this.touchMoveOnce && this.touchMoveOnce();
            this.touching = true;
        }
        e.preventDefault();
        let pos = this.pos + diff;
        if (pos > this.maxPos && diff > 0) {
            pos -= diff * (1 - this.outsideTimes[0]);
        } else if (pos < this.minPos && diff < 0) {
            pos -= diff * (1 - this.outsideTimes[1]);
        }
        this.pos = pos;
        this.points[this.dirName] += diff;
        if (e.timeStamp - this.flickTime > 300) {
            //记录瞬时信息
            this.flick = this.points[this.dirName];
            this.flickTime = e.timeStamp;
        }
    },
    touchend(e) {
        if (!this.touching) return false;
        let speed = 0, //瞬时速度
            point = e.changedTouches[0][this.dirName]; //松手坐标
        if (e.timeStamp > this.flickTime) {
            speed = (point - this.flick) / (e.timeStamp - this.flickTime);
        }
        this.$store.commit("gesture"); //还原手势状态
        this.touching = false;
        return {
            speed,
            point
        };
    }
};
export { tap, hold, slide };
