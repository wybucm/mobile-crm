/**
 * 实现jsonp请求
 */
import qs from "qs";
const noop = () => {};

export function jsonp(url, opts = {}, fn = noop) {
    let name = opts.name, //jsonp的函数名
        timeout = opts.timeout || 60000, //超时
        fullUrl,
        timer,
        script;
    fullUrl = url + '?';
    if(opts.params && !Object.isEmpty(opts.params)){
        fullUrl += qs.stringify(opts.params)+ '&';
    }
    fullUrl += 'callback='+ name;
    timer = setTimeout(function() {
        cleanup();
        if (fn) fn(new Error("Timeout"));
    }, timeout);

    window[name] = function(data) {
        cleanup();
        fn(null, data);
    };
    script = document.createElement("script");
    script.src = fullUrl;
    document.body.appendChild(script);
    return cancel;

    //清除请求时添加的延时器和script
    function cleanup() {
        script.parentNode.removeChild(script);
        delete window[name];
        if (timer) clearTimeout(timer);
    }
    //中止请求
    function cancel() {
        if (window[name]) {
            cleanup();
        }
    }
}