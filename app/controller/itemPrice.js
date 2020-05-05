'use strict';

const Controller = require('egg').Controller;

class itemPrice extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  /**
   * 更改数据存储策略
   */
  async getItemPrice() {
    const {
      app,
      ctx,
    } = this;
    // 记录请求日志信息
    ctx.helper.infoLogger(ctx);
    // 获取请求参数
    const reqData = await ctx.request.query;
    console.log('======================= getItemPrice接口 =======================');
    console.log(reqData.data);
    let res = null;
    try {
      // 获取基路径
      const baseUrl = app.config.buff.baseUrl;
      // 获取url
      const url = app.config.buff.getItemArr;
      console.log(baseUrl + url);
      res = await ctx.helper.onlineHttpUtil(ctx, baseUrl + url, 'GET', reqData);
      console.log('------------- 返回的数据 --------------');
      console.log(res.data.code);

      // 如果返回失败则发送错误提示
      res.data.code !== 'OK' && ctx.returnErrorBody('接口code 不为 OK');
      // 如果返回成功则发送错误提示
      res.data.code === 'OK' && ctx.returnDataBody('success', res.data.data);
    } catch (e) {
      console.log('------------- 捕获到异常 --------------');
      // 记录异常日志
      ctx.helper.errLogger(ctx, e);
      ctx.returnErrorBody('接口报错');
    }
  }
}

module.exports = itemPrice;
