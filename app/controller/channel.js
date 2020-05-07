'use strict';

const Controller = require('egg').Controller;

class reporter extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  /**
   * 获取记者列表
   */
  async getChannelList() {
    const {
      app,
      ctx,
    } = this;
    // 记录请求日志信息
    // ctx.helper.infoLogger(ctx);
    // 获取请求参数
    console.log('======================= getChannelList =======================');
    let res = null;
    try {
      const res= await ctx.service.channel.getChannelList();
      console.log(res)
      if(res && res.length > 0) {
        ctx.returnDataBody('success', res);
      } else {
        ctx.returnErrorBody('数据库返回有错误');
      }
    } catch (e) {
      console.log('------------- 捕获到异常 --------------');
      // 记录异常日志
      ctx.helper.errLogger(ctx, e);
      ctx.returnErrorBody('捕获到异常');
    }
  }
}

module.exports = reporter;
