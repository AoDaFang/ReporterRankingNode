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
  async getReporterList() {
    const {
      app,
      ctx,
    } = this;
    // 记录请求日志信息
    // ctx.helper.infoLogger(ctx);
    // 获取请求参数
    console.log('======================= getReporterList =======================');
    let res = null;
    try {
      const res= await ctx.service.reporter.selectReporterList();
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

  /**
   * 添加记者
   */
  async insertReporter() {
    const {
      app,
      ctx,
    } = this;
    // 记录请求日志信息
    ctx.helper.infoLogger(ctx);
    // 获取请求参数
    console.log('======================= insertReporter =======================');
    const reqData = ctx.request.body;
    console.log(reqData);
    let res = null;
    try {
      const res = await ctx.service.reporter.insertReporter(reqData.reporter_name, reqData.phone_num);
      console.log(res)
      if(res && res.affectedRows === 1) {
        ctx.returnDataBody('success');
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
