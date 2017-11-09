/**
 * String原型扩展
 */
Object.assign(String.prototype, {
    /**
     * 格式化日期
     * @param {String} [formatStr='Y-m-d'] - 需要输出的格式
     * @return {String} 格式化后的字符串
     * @example new Date().timeFormat(); //"10/18/2017 15:38:00"
     */
    timeFormat(formatStr = 'm/d/Y H:i:s') {
        let str = '';
        for (let c of formatStr) {
            switch (c) {
                case 'Y':
                    str += this.substring(0, 4)
                    break;
                case 'm':
                    str += this.substring(4, 6)
                    break;
                case 'd':
                    str += this.substring(6, 8)
                    break;
                case 'H':
                    str += this.substring(8, 10)
                    break;
                case 'i':
                    str += this.substring(10, 12)
                    break;
                case 's':
                    str += '00'
                    break;

                default:
                    str += c;
            }
        }
        return str;
    }
});