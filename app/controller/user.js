'use strict';

const Controller = require('egg').Controller;

class reporter extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  /**
   * 通过phone获取用户
   */
  async selectUserByPhone() {
    const {
      app,
      ctx,
    } = this;
    // 记录请求日志信息
    ctx.helper.infoLogger(ctx);
    // 获取请求参数
    console.log('======================= selectUserByPhone =======================');
    const reqData = ctx.request.body;
    console.log(reqData);
    let res = null;
    try {
      const res = await ctx.service.user.selectUserByPhone(reqData.phone);
      console.log(res)
      if(res && res.length === 1) {
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
