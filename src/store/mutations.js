const mutations = {
    logined(state, v) {
        state.logined = v;
    },
    cardNo(state, v) {
        state.cardNo = v;
    },
    routerTransitionName(state, v) {
        state.routerTransitionName = v;
    },
    routerTransitionReverse(state, v) {
        state.routerTransitionReverse = v;
    },
    keepPages(state, v) {
        state.keepPages = v;
    },
    keepForever(state, v) {
        if (state.keepForever.indexOf(v) == -1) {
            state.keepForever.push(v);
        }
    },
    gesture(state, vm) {
        if (vm) {
            state.gesture.name = vm.$options.name;
            state.gesture.level = vm.gestureLevel;
            state.gesture.id = vm._uid;
        } else {
            state.gesture.name = '';
            state.gesture.level = -1;
            state.gesture.id = '';
        }
    },
    /**
     * 设置手势状态，但先比较vm与当前实例的优先级
     * @param {Vue} vm - 需要比较的控件实例
     * @return {Boolean} vm优先级是否更高
     */
    gestureIf(state, vm) {
        if (vm.gestureLevel > state.gesture.level) {
            mutations.gesture(state, vm);
        } else if (state.gesture.id != vm._uid) {
            return false;
        }
        return true;
    }
};
export default mutations;