/**
 * 标题栏
 *
 * header 标题栏 **********************************
 * @desc 可包含<h1>，代表标题
 * @desc 可包含<v-back>，代表返回按钮
 *
 * back 返回按钮 ************************************
 * @prop [transition] - 返回上一页的跳转动画，参看src/router的$back
 * @event click - 点击触发
 *
 * @example
 * <v-header>
 *      <v-back/>
 *      <h1>登录</h1>
 *      <v-button>首页</v-button>
 * </v-header>
 */
export {default as vHeader} from './header'
export {default as vBack} from './back'