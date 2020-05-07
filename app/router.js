'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  /**
   * 获取记者列表
   */
  router.get('/reporterList', controller.reporter.getReporterList);

  /**
   * 添加记者
   */
  router.post('/insertReporter', controller.reporter.insertReporter);

  /**
   * 获取渠道列表
   */
  router.get('/channelList', controller.channel.getChannelList);

  /**
   * 通过phone获取用户信息
   */
  router.post('/login', controller.user.selectUserByPhone);

  /**
   * 获取新闻列表
   */
  router.get('/reporterChannel', controller.reporterChannel.getReporterChannelList);

  /**
   * 添加新闻
   */
  router.post('/insertReporterChannel', controller.reporterChannel.insertReporterChannel);

};