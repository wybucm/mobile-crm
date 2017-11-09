/**
 * Date原型扩展
 *
 * format()     - 格式化日期
 * getDayNum()  - 获取该月天数
 * isLeapYear() - 是否闰年
 */
Object.assign(Date.prototype, {
    /**
     * 格式化日期
     * @param {String} [formatStr='Y-m-d'] - 需要输出的格式
     * @return {String} 格式化后的字符串
     * @example new Date().format(); //"2017-10-18 15:38:34"
     *          new Date().format('Y年m月d日 星期N'); //"2017年10月18日 星期三"
     */
    format(formatStr = 'Y-m-d H:i:s') {
        let str = '';
        for (let c of formatStr) {
            switch (c) {
                case 'Y': //年，4位
                    str += String(this.getFullYear()).padStart(4, '0');
                    break;
                case 'm': //月，2位
                    str += String(this.getMonth() + 1).padStart(2, '0');
                    break;
                case 'n': //月，没有前导0
                    str += this.getMonth() + 1;
                    break;
                case 'd': //日，2位
                    str += String(this.getDate()).padStart(2, '0');
                    break;
                case 'j': //日，没有前导0
                    str += this.getDate();
                    break;
                case 'H': //小时，4位
                    str += String(this.getHours()).padStart(2, '0');
                    break;
                case 'i': //分，2位
                    str += String(this.getMinutes()).padStart(2, '0');
                    break;
                case 's': //秒，2位
                    str += String(this.getSeconds()).padStart(2, '0');
                    break;
                case 'N': //星期中的第几天，汉字，日、一、二等，1位
                    str += this.getUTCDayCN();
                    break;
                default:
                    str += c;
            }
        }
        return str;
    },
    /**
     * 递增指定日期（不会改动原实例）
     * @param {String} v - 格式串，支持运算符+/-，支持单位y/m/d/h/i/s(年/月/日/时/分/秒)
     * @param {String} [formatStr] - 返回的日期格式，如果指定则返回String类型
     * @return {Date|String} 运算后的Date对象或格式化结果（如果指定formatStr）
     * @example new Date('2012-02-29 16:04:00').add('1y'); //"2013-02-28 16:04:00"
     *          new Date('2017-10-18 16:04:00').add('-2m'); //"2017-08-18 16:04:00"
     */
    add(v, formatStr) {
        v = v.trim();
        let num = parseFloat(v), //数值
            unit = v.substr(-1), //单位
            time = this.getTime(),
            ret;
        if (unit == 'y' || unit == 'm') { //年 || 月
            ret = new Date(time);
            let date = this.getDate();
            ret.setDate(1); //先把日置为1，避免计算错误
            unit == 'y' ? ret.setFullYear(ret.getFullYear() + num) : ret.setMonth(ret.getMonth() + num);
            ret.setDate(Math.min(date, ret.getDayNum())); //回填日，保证不超过当月最后一天
        } else {
            switch (unit) {
                case 'd': //日
                    time += num * 86400000;
                    break;
                case 'h': //时
                    time += num * 3600000;
                    break;
                case 'i': //分
                    time += num * 60000;
                    break;
                case 's': //秒
                    time += num * 1000;
                    break;
            }
            ret = new Date(time);
        }
        return formatStr? ret.format(formatStr): ret;
    },
    /**
     * 获取该月的天数
     * @return {Number} 该月的天数
     */
    getDayNum() {
        const m = this.getMonth() + 1;
        if (m == 2) { //2月
            return this.isLeapYear() ? 29 : 28;
        } else if (m == 4 || m == 6 || m == 9 || m == 11) {
            return 30;
        } else {
            return 31;
        }
    },
    /**
     * 是否闰年
     * @return {Boolean} 是true 否false
     */
    isLeapYear() {
        const year = this.getFullYear();
        return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
    },
    /**
     * 获取星期中的第几天
     * @returns (String)日、一、二、...六
     */
    getUTCDayCN() {
        switch (this.getUTCDay()) { //0(周日)到6(周六)
            case 0:
                return '日';
            case 1:
                return '一';
            case 2:
                return '二';
            case 3:
                return '三';
            case 4:
                return '四';
            case 5:
                return '五';
            case 6:
                return '六';
        }
    }
});