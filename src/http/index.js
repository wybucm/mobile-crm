/**
 * 调用接口
 * @param {String} tranCode - 接口号
 * @param {Object} params - 请求参数
 * @param {Object} cfg - 配置
 * @param {Function} [cfg.onSuccess] - 业务成功（errorCode="0000"）时回调，参数：
 *                                      1、{Object} data - 数据
 * @param {Function} [cfg.onBizFailure] - 业务错误（errorCode不为"0000"）时回调，默认会弹框提示错误（errorMsg），参数：
 *                                      1、{Object} data - 数据
 *                                      2、{Function} echo - 弹框提示错误的函数
 * @param {Function} [cfg.onFailure] - 请求失败，默认会弹框提示错误，参数：
 *                                      1、{Object} err - 错误信息
 *                                      2、{Function} echo - 弹框提示错误的函数
 * @param {Function} [cfg.finally] - 在其他回调函数执行后执行的函数，参数：
 *                                      1、status - 0:成功 1:业务错误 2:请求失败
 *                                      2、data - 当status为0或1时代表数据，为2时代表错误信息
 * @param {Object|Number} [loading] - 等待框的配置，如果配置，则自动显示/隐藏等待框。
 *                                      当Number时，代表等待框的类型（同loading.type），1-请求、2-提交、3-页面初始化
 * @param {Number} [loading.type] - 等待框的类型，1-请求、2-提交、3-页面初始化
 * @param {String} [loading.text] - 等待框的文本
 * 
 * @param {Object|Vue} [scroller] - scroller的配置，如果配置，则执行回调后自动调用scroller的end，且loading强制不显示
 *                                      当Vue时，代表scroller实例（同scroller.instance）
 * @param {Vue} [scroller.instance] - scroller实例
 * @param {String} [scroller.endIf] - 判断scroller是否nomore（无更多数据）的条件表达式，表达式返回true代表nomore。
 *                                      ex.'(data.pos+1)*10>=data.tot'
 * 
 * @param {Boolean} [silent] - 是否启用静默模式，启用后不弹loading和失败提示框，且loading和scroller强制失效
 */

import Vue from "vue";
import {jsonp} from "./jsonp";

const baseUrl = process.env.BSAE_URL[process.env.RUNNING_ENV], //接口路径前缀
    callback = "mprm", //jsonp的函数名
    timeout = 40000; //超时时间

function http(tranCode, params, cfg) {
    let loading = cfg.loading, //loading配置
        scroller = cfg.scroller, //scroller配置
        silent = cfg.silent, //是否静默模式
        onSuccess = cfg.onSuccess, //成功回调
        onBizFailure = cfg.onBizFailure, //业务错误回调
        onFailure = cfg.onFailure, //失败回调
        onFinally = cfg.finally; //最终总会执行的回调
    if (silent) {
        loading = false;
        scroller = false;
    } else if (scroller) {
        if (scroller._isVue) {
            scroller = {
                instance: scroller
            };
        }
        loading = false;
    } else {
        if (typeof loading == "number") {
            loading = {
                type: loading
            };
        }
    }
    if (loading) {
        //自动弹框
        $rootVm.$loading(true, loading.type, loading.text);
    }
    jsonp(
        baseUrl + tranCode,
        {
            name: callback, //jsonp的函数名
            params, //序列化参数
            timeout //超时时间
        },
        (err, data) => {
            let status; //0:成功 1:业务错误 2:请求失败
            if (loading) {
                //隐藏弹框
                $rootVm.$loading(false);
            }
            if (err) {
                //请求失败
                status = 2;
                if (onFailure) {
                    onFailure(err, echo);
                    cb();
                } else {
                    echo(cb);
                }
            } else {
                if (data.errorCode == "0000") {
                    //成功
                    status = 0;
                    onSuccess && onSuccess(data);
                    cb();
                } else {
                    //业务错误
                    status = 1;
                    if (onBizFailure) {
                        onBizFailure(data, echo);
                        cb();
                    } else {
                        echo(cb);
                    }
                }
            }
            //回调函数执行后调用的函数
            function cb() {
                if (onFinally) {
                    onFinally(status, status == 2 ? err : data);
                }
                if (scroller) {
                    let nomore = false;
                    if (scroller.endIf) {
                        try {
                            nomore = eval(scroller.endIf);
                        } catch (e) {}
                    }
                    scroller.instance.end(nomore);
                }
            }
            //弹框提示错误信息
            function echo(fn = $rootVm.$tools.noop) {
                if(!silent){
                    if (loading.type == 3) { //页面初始化调用接口失败
                        $rootVm.$confirm({
                            text: status == 1 ? data.errorMsg : $rootVm.$message(err.message),
                            title: "错误",
                            buttonText: ["返回", "重新加载"],
                            closable: false,
                            callback: [$rootVm.$back, ()=>{
                                http(tranCode, params, cfg);
                            }]
                        });
                    }else{
                        $rootVm.$alert({
                            title: '错误',
                            text:
                                status == 1
                                    ? data.errorMsg
                                    : $rootVm.$message(err.message),
                            callback: fn
                        });
                    }
                }
            }
        }
    );
}

Vue.prototype.$http = http;
