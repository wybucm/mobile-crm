/**
 * 开发模式的配置项
 * 可用process.env访问各项配置
 */
var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"'
})
