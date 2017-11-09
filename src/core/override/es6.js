/**
 * es6的降级处理，兼容对es6的新函数支持得不完美的设备
 */
/** string的函数 */
const stringExt = {
    padStart(size, char = '') {
        let str = '' + this;
        while (str.length < size) {
            str = char + str;
        }
        return str;
    },
    padEnd(size, char = '') {
        let str = '' + this;
        while (str.length < size) {
            str = str + char;
        }
        return str;
    },
    includes(substr, index = 0) {
        return index <= this.indexOf(substr);
    }
};
let proto = String.prototype;
for (let k in stringExt) { //如果本就支持，则不覆盖
    if (proto[k]) {
        delete stringExt[k];
    }
}
Object.assign(String.prototype, stringExt);