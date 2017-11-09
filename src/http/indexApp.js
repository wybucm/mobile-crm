import Vue from "vue";
import {jsbridge} from "./ares.jsbridge";

window.jsbridge.onReady(function(){
    window.jsbridge.registerHandler("HttpPlugin")
    
})
export function cc(data,callback){
    window.jsbridge.callHandler("HttpPlugin",data,callback)
}
