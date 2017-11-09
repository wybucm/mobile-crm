/**
 * Math扩展
 *
 * format()     - 格式化数字
 */
Object.assign(Math, {
    /**
     * 格式化数字
     * @param {Number|String} num - 数字或数字字符串
     * @param {String} [round] - 是否清除后导0
     * @param {Number} [precision=2] - 保留小数位
     * @return {String} 格式化后的字符串
     * @example Math.format('123456.555'); //"123,456.56"
     *          Math.format(1.8999, true); //1.9
     *          Math.format(1.8999, true, 2); //1.9
     *          Math.format(1.8999, false, 3); //1.900
     */
    format(num, round, precision = 2) {
        num = Number.parseFloat(num);
        const minus = num < 0;
        let s = Math.abs(num).toFixed(precision), //保留指定小数位
            arr = s.split('.'), //分割整数和小数部分
            trunc = arr[0], //整数部分
            decimal = arr[1], //小数部分
            len = trunc.length,
            left = len % 3, //首个逗号前的位数
            ret = ''; //返回的结果
        for (let i = len - 1; i >= left; i -= 3) { //每3位增加,
            ret = (i > 2 ? ',' : '') + trunc.substr(i - 2, 3) + ret;
        }
        ret = (minus ? '-' : '') + trunc.substr(0, left) + ret; //整数部分
        if (precision != 0) {
            if (round === true) { //清除后导0
                for (let i = decimal.length - 1; i >= 0; i--) { //遍历小数部分
                    if (decimal[i] != 0) {
                        ret += '.' + decimal.substr(0, i + 1); //拼接整数部分和小数部分
                        break;
                    }
                }
            } else {
                ret += '.' + decimal;
            }
        }
        return ret;
    }
});