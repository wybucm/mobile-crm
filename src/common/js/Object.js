/**
 * Object扩展
 *
 * isEmpty()    - 对象是否为null或没有属性
 * getDeepValue - 获取对象的若干个键后的值
 */
Object.assign(Object, {
    /**
     * 对象是否为null或没有属性
     * @return {Boolean} null或没有属性则true，有属性或不为对象则false
     */
    isEmpty(v) {
        if (typeof v == 'object') {
            for (let k in v) return false;
            return true;
        }
        return false;
    },
    /**
     * 获取对象的若干个键后的值
     * @param {Object} obj - 对象
     * @param {...String} keys - 键名，若干
     * @return {*} 值 或 undefined
     * @example 
     * if(Object.getDeepValue(o, 'k1', 'k2')){ ... } 等同于 if(o && o.k1 && o.k1.k2){...}
     */
    getDeepValue(obj, ...keys){
        let v = obj;
        if(!v) return v;
        for(let i=0; i<keys.length; i++){
            v = v[keys[i]];
            if(!v) return v;
        }
        return v;
    }
});