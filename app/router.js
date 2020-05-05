'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  /**
   * 价格获取接口
   */
  router.get('/lowPrice', controller.itemPrice.getItemPrice);
};
