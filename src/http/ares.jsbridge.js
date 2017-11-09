
var Ares = {};
 
var JSBridge = function(){
    function checkJSBridge() {
        if (!Ares.__bridge__) {
            if (WebViewJavascriptBridge) {
                Ares.__bridge__ = WebViewJavascriptBridge;
            }
        }

        if (!Ares.__bridge__) {
            throw new Error('WebViewJavascriptBridge object error');
        }
    }

    /**
     * 注册一个名为 [handler] 的处理器，并定义用于响应的处理逻辑
     */
    var _registerHandler = function (handler, callback) {
        checkJSBridge();
        Ares.__bridge__.registerHandler(handler, callback);
        
    };

    /**
     * 调用名为 [handler] 的native端处理器，并传递参数，同时设置回调处理逻辑
     */
    var _callHandler = function (handler, params, callback) {
        checkJSBridge();
        Ares.__bridge__.callHandler(handler, params, callback);
        WebViewJavascriptBridge.callHandler(handler, callback);
    };

    /**
     * onReady 确保WebViewJavascriptBridge注册完成
     */
    var _onReady = function(callback, init) {
        init = (init && typeof init == 'function') ? init : function(message, responseCallback) {};
        if (window.WebViewJavascriptBridge) {
            Ares.__bridge__ = WebViewJavascriptBridge;
            Ares.__bridge__.init(init);
			
            callback();
        } else {
            document.addEventListener('WebViewJavascriptBridgeReady', function () {
                Ares.__bridge__ = WebViewJavascriptBridge;
                Ares.__bridge__.init(init);

                callback();
            }, false);
        }
    };

    return {
        onReady:_onReady,
        registerHandler: _registerHandler,
        callHandler: _callHandler
    }
}
window.jsbridge = JSBridge();