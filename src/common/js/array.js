/**
 * Array原型扩展
 *
 * last()       - 获取数组最后一项
 * removeOf()   - 删除指定元素
 */
Object.assign(Array.prototype, {
    /**
     * 获取数组最后一项
     * @return {*} 数组最后一项
     */
    last(){
        return this[this.length-1];
    },
    /**
     * 删除指定元素
     * @param {*} a - 需要删除的变量
     * @return {Number} 元素下标，如果不存在则-1
     */
    removeOf(a){
        for (let [i, item] of this.entries()) {
            if(item === a){
                this.splice(i, 1);
                return i;
            }
        }
        return -1;
    }
});