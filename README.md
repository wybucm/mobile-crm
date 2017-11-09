### 简介
本项目以Vue-Cli为基础搭建而成，依赖vue全家桶、webpack。
.js语法使用es6
.css语法使用scss
.注释以JSDoc为标准

|-- build                            // 项目构建(webpack)相关代码
|   |-- build.js                     // 生产环境构建代码
|   |-- check-version.js             // 检查node、npm等版本
|   |-- dev-client.js                // 热重载相关
|   |-- dev-server.js                // 构建本地服务器
|   |-- utils.js                     // 构建工具相关
|   |-- vue-loader.conf.js           // .vue文件的加载器
|   |-- webpack.base.conf.js         // webpack基础配置
|   |-- webpack.dev.conf.js          // webpack开发环境配置
|   |-- webpack.prod.conf.js         // webpack生产环境配置
|-- config                           // 项目开发环境配置
|   |-- dev.env.js                   // 开发环境变量
|   |-- index.js                     // 项目一些配置变量
|   |-- prod.env.js                  // 生产环境变量
|-- src                              // 源码目录
|   |-- common                       // 公共的文件
|   |   |-- css                      // 公共的css样式文件
|   |   |   |-- _common.scss         // 通用的公共样式
|   |   |   |-- _fonts.css           // 字体图标样式(icomoon导出的文件)
|   |   |   |-- _mixin.scss          // 继承类和宏定义公共样式
|   |   |   |-- _variable.scss       // 变量类公共样式
|   |   |   |-- base.scss            // 基础公共样式
|   |   |   |-- index.scss           // 引用文件
|   |   |-- fonts                    // 字体图标文件(icomoon导出的文件)(https://icomoon.io/app)
|   |   |-- js                       // 公共的js样式文件
|   |   |   |-- array.js			// array原型扩展
|   |   |   |-- date.js				// date原型扩展
|   |   |   |-- directive.js         // 自定义的指令
|   |   |   |-- filters.js           // 自定义的Vue过滤器
|   |   |   |-- Math.js            	 // Math扩展
|   |   |   |-- messages.js          // 话术
|   |   |   |-- Object.js            // Object扩展
|   |   |   |-- tools.js             // 工具函数
|   |   |   |-- validator.js         // 校验库函数
|   |   |   |-- index.js             // 引用文件
|   |-- components                   // 公共组件
|   |   |-- button                   // 按钮
|   |   |-- carousel                 // 轮播图
|   |   |-- checkbox                 // 复选框
|   |   |-- footer                   // 底部标签
|   |   |-- form                     // 表单
|   |   |-- header                   // 标题栏
|   |   |-- input                    // 输入框
|   |   |-- loading                  // 加载框
|   |   |-- message                  // 提示框
|   |   |-- page                     // 页面容器
|   |   |-- radio                    // 单选框
|   |   |-- routerView               // 路由视图
|   |   |-- scroller                 // 滚动控制器
|   |   |-- index.js                 // 引用文件
|   |-- core                         // 框架源文件(与业务开发无关)
|   |-- http                         // 调接口用
|   |-- pages                        // 页面模块文件
|   |   |-- home                     // home模块
|   |   |-- login                    // login模块
|   |-- router                       // vue-router配置与扩展
|   |   |-- index.js                 // 引用文件，定义$go()和$back()
|   |   |-- route.js                 // 页面路由定义
|   |-- store                        // vuex的状态管理
|   |   |-- actions.js               // 
|   |   |-- getters.js               //
|   |   |-- mutations.js             //
|   |   |-- state.js                 //
|   |   |-- index.js                 //
|   |-- test                         // 测试文件
|   |   |-- icomoon                  //
|   |   |-- WL                       //
|   |   |-- index.js                 //
|   |   |-- native.js                //
|   |-- App.vue                      // 所有页面的外壳
|   |-- main.js                      // 程序入口文件，加载各种公共组件
|-- static                           // 静态文件，比如一些图片，json数据等
|   |-- img                          // 图片
|   |-- test                         // 测试数据
|-- .babelrc                         // ES6语法编译配置
|-- .gitignore                       // git上传需要忽略的文件格式
|-- .postcssrc.js                    // postcss工具的配置文件
|-- index.html                       // 入口页面
|-- package.json                     // 项目基本信息
|-- README.md                        // 项目说明
.

### 说明
#### 运行项目
1、在命令行进入项目目录
2、初次运行，键入命令>npm install
3、运行模式，键入命令>npm run dev
4、打包模式，键入命令>npm run build，打包后会生成（或覆盖）dist目录，然后启动本地服务（apache、node等），访问dist/index.html
#### 新建模块
1、如果是新模块，则在对应目录新建子目录
2、在目录内新建index.vue，<template>引用<v-router-view>创建子路由（如果该模块只有一个页面，则可不创建子路由）
3、在src/router/route定义新模块
#### 页面跳转
两个方案：
1、使用vm.$go()跳转页面，使用vm.$back()返回上一页，参考src/router。
2、使用v-link指令，参考src/common/js/directive
#### 数据共享
现提供一种数据共享的方式(应用情景：在一个模块中，多个组件共享一个随时会改变的数据)
父盒子想要拿到子盒子的数据。可以在data中通过以下方式获取。

字段名+`@p.sync`：子盒子的数据改变。父盒子绑定的子盒子的数据也会做相应的改变
字段名+`@p.once`：只会有一次数据的改变，只会数据不会改变。

p       - 绑定父路由的字段，可省略

sync    - 双向绑定，自身的修改会触发指定作用域字段的变更
once    - 仅绑定一次，之后指定作用域字段的修改不会触发自身变更（即仅取默认值）
说明：
分隔符为@，分隔符前为自身字段名，分隔符后为作用域和修饰符，值为指定作用域的字段名，如“'myKey@p': 'thatKey'”，绑定后，自身字段会赋值为目标字段的值，且目标字段修改会自动触发自身的修改。
ex：
data(){
  return {
	'key1@p': 'thatKey', //自身字段key1绑定父路由的字段thatKey
    'key2@': '', //未指定作用域，则取默认值p；未指定目标字段名，则取自身字段名key2
    'key3@.once': 'thatKey' //key3的初始值为父路由的thatKey的值，之后thatKey修改不会影响key3
  }
}