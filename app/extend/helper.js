/* eslint-disable jsdoc/require-param */
'use strict';
/**
 * @author you
 * @date 2019/7/15
 * @version 1.0 v
 * @description: 公共方法封装类
 */
module.exports = {
  /**
   *@desc 记录日志
   *@author luofei
   *@date 2018-09-26 10:59:05
   *@params ctx
   */
  infoLogger(ctx) {
    // 去掉请求头
    ctx.logger.info('请求体: %j', ctx.request.body);
  },

  /**
   *@desc 记录错误日志
   *@author you
   *@date 2019-07-15 17:03:03
   *@params ctx
   *@params e
   */
  errLogger(ctx, e) {
    ctx.logger.error(e);
  },
  /**
   * @desc 发送http请求,只支持GET和POST请求
   * @author liup
   * @date 2018-11-14
   * @param ctx 上下文
   * @param serverUrl 请求路径，以http开头
   * @param methodType 请求类型，GET/POST
   * @param signature 验签
   * @param data 数据包 GET为数据串：参数1=值1&参数2=值2，POST为json数据包：{参数1=值1，参数2=值2}
   * @returns {*}
   */
  async onlineHttpUtil(ctx, serverUrl, method, data) {
    console.log('参数为：===', data);
    let result = null;
    result = await ctx.curl(serverUrl, {
      method,
      contentType: 'json',
      data,
      dataType: 'json',
    });
    return result;
  },
  // 获取当前时间
  formatDate(date, format) {
    if (format === undefined) {
      format = date;
      date = new Date();
    }
    const map = {
      M: date.getMonth() + 1, // 月份
      d: date.getDate(), // 日
      h: date.getHours(), // 小时
      m: date.getMinutes(), // 分
      s: date.getSeconds(), // 秒
      q: Math.floor((date.getMonth() + 3) / 3), // 季度
    };
    format = format.replace(/([yMdhmsqS])+/g, function(all, t) {
      let v = map[t];
      if (v !== undefined) {
        if (all.length > 1) {
          v = '0' + v;
          v = v.substr(v.length - 2);
        }
        return v;
      } else if (t === 'y') {
        return (date.getFullYear() + '').substr(4 - all.length);
      } else if (t === 'S') {
        const ms = `00${date.getMilliseconds()}`;
        return ms.substr(ms.length - 3);
      }
      return all;
    });
    return format;
  },
};
