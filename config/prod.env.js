/**
 * 生产模式的配置项
 * 可用process.env访问各项配置
 */
module.exports = {
    NODE_ENV: '"production"',
    RUNNING_ENV: '"development"',   //运行环境，development/sit/uat/production/mock
    BSAE_URL: { //接口路径前缀
        mock: '"http://218.13.4.182:9185/crm/mock/"', //挡板
        development: '"http://218.13.4.182:9185/crm/devapi/"', //开发环境
    },
}
