'use strict';

const Controller = require('egg').Controller;

class reporter extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  /**
   * 获取新闻列表
   */
  async getReporterChannelList() {
    const {
      app,
      ctx,
    } = this;
    // 记录请求日志信息
    // ctx.helper.infoLogger(ctx);
    // 获取请求参数
    console.log('======================= getReporterChannelList =======================');
    let res = null;
    try {
      const res= await ctx.service.reporterChannel.getReporterChannelList();
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
   * 添加新闻
   */
  async insertReporterChannel() {
    const {
      app,
      ctx,
    } = this;
    // 记录请求日志信息
    ctx.helper.infoLogger(ctx);
    // 获取请求参数
    console.log('======================= insertReporterChannel =======================');
    const reqData = ctx.request.body;
    console.log(reqData);
    let res = null;
    try {
      const res = await ctx.service.reporterChannel.insertReporterChannel(reqData.reporter_id, reqData.channel_id, reqData.news_name);
      console.log(res);
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
