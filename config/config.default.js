
'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1569316505200_2299';

  // add your middleware config here
  config.middleware = [];

  // 解决跨域添加
  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [ '*' ],
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };
  // 解决跨域添加

  // config.cluster = {
  //     listen: {
  //       port: 8082,
  //       hostname: '10.140.128.41',
  //     }
  // };

  // 系统配置相关接口
  config.configure = {
    query: '/api/v1/config/event',
    handle: '/api/v1/config/event',
  };

  config.mysql = {
    client: {
      // host
      host: '182.92.198.108',
      // 端口号
      port: '3306',
      // 用户名
      user: 'ReporterRankDB',
      // 密码
      password: 'fmw123456',
      // 数据库名
      database: 'ReporterRankDB',
      // database: 'bufftest',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  // 内网相关配置
  config.buff = {
    baseUrl: 'https://buff.163.com/',
    getItemArr: 'api/market/goods/sell_order',
  };
  // 
  // 配置参数校验相关信息
  config.validate = {
    // 设置检验不通时的返回体
    resolveError(ctx, errors) {
      if (errors.length) {
        ctx.body = {
          result: {
            code: 1,
            message: errors[0].message,
          },
        };
      }
    },
  };
  // 共享数据
  config.shareData = {
    goodsPageNum: 1, // 商品分页的页码
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  return {
    ...config,
    ...userConfig,
  };
};
