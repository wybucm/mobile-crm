/**
 * 重写Number.toFixed()，解决四舍五入有时错误的bug，比如var a = 123456.555; a.toFixed(2); //"123456.55"
 */
Number.prototype.toFixed = function (precision) {
    let n = Math.round(this * Math.pow(10, precision)) / Math.pow(10, precision),
        ret = n.toString(),
        index = ret.lastIndexOf('.');
    if (precision > 0) { //补后缀0
        if (index == -1) {
            ret += '.'.padEnd(precision + 1, '0');
        } else {
            let diff = index - ret.length + precision + 1; //还缺多少个后缀0
            if (diff > 0) {
                ret += ''.padEnd(diff, '0');
            }
        }
    }
    return ret;
}
//处理软键盘弹出时遮住
let isAndroid = navigator.userAgent.indexOf('iPhone') == -1;
if (isAndroid) {
    let body = document.querySelector('body'),
        clientH = innerHeight,
        keyboardUp = false,
        clientHB4KeyboardUp = clientH, //键盘弹起状态与弹起前高度
        bodyScrollTop = 0; //当前页面是否上拉
    window.onresize = function (e) {
        const h = innerHeight;
        if (clientH == h) return; //高度没有变化（某些手机也会触发），忽略
        if (h < clientH) { //软键盘弹出
            document.activeElement && document.activeElement.scrollIntoViewIfNeeded(); //弹出键盘后，滚动视图使输入框在视图内
            bodyScrollTop = body.scrollTop;
            keyboardUp = true;
            clientHB4KeyboardUp = clientH;
        } else { //软键盘收起
            if (isAndroid) { //安卓
                if (bodyScrollTop) { //弹一弹页面，避免安卓标题栏悬空的bug
                    body.style.marginTop = '1px';
                    setTimeout(() => {
                        body.style.marginTop = 0;
                    }, 0);
                    bodyScrollTop = 0;
                } else {
                    body.scrollTop = 0; //调用scrollIntoViewIfNeeded()后的回弹
                }
            }
            keyboardUp = false;
        }
    }
}