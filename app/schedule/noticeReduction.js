'use strict';
const Subscription = require('egg').Subscription;
// 通知用户降价的定时任务
const util = require('../public/js/util');

class noticeReduction extends Subscription {

  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '15m', // 间隔
      // cron: '0 0/30 */0.5 * * *',
      type: 'all', // worker 类型：每台机器上只有一个 worker 会执行这个定时任务，每次执行定时任务的 worker 的选择是随机的。
      immediate: true,
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const {
      // app,
      ctx,
    } = this;
    const { res: goodsArr } = await ctx.service.goods.selectAllGoods(); // 获取所有的饰品
    goodsArr.forEach(async ({ goods_id, lowest_bargain_price, true_lowest_bargain_price, true_lowest_bargain_price_date, goods_name }) => {
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~ 降价提醒定时任务 ~~~~~~~~~~~~~~~~~~~~~~~~~~');
      const { res: nowGoodsItem } = await ctx.service.minPrice.selectLastItemById(goods_id); // 获取最新的当前饰品的价格

      if (nowGoodsItem.length === 0) return; // 若当前还没开始获取这个商品的数据，则不进行下面关于商品的步骤

      const nowPrice = nowGoodsItem[0].price; // 最新的价格
      const nowAssetid = nowGoodsItem[0].assetid; // 最新价格所对应饰品的assetid
      const { res: UserRes } = await ctx.service.userGoods.selectUserByGoodsId(goods_id); // 根据goods_id 查询用户收藏(查询出收藏了这个饰品的所有用户id)
      // 根据用户的id查询 用户的邮箱
      const mailPromiseArr = UserRes.filter(item => {
        // 需要发信息的用户 条件：1.当前价格比最低成交价*1.05小 并且不是上次通知的那个饰品 2.当前价格小于上次通知的价格
        if ((nowPrice <= lowest_bargain_price * 1.05 && item.assetid !== nowAssetid && +item.user_goods_state) || (nowPrice < item.price && +item.user_goods_state)) return item;
        return false;
      }).map(item => ctx.service.user.selectUserById(item.user_id)); // 符合条件的需要根据user_id获取用户的邮箱
      const userArr = await util.promiseAll(mailPromiseArr);

      userArr.forEach(userItem => {
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~ 给用户发邮件 ~~~~~~~~~~~~~~~~~~~~~~~~~~');
        // 更新所有用户的发送记录
        ctx.service.userGoods.updateNoticeInfo(userItem.res[0].id, goods_id, new Date(), nowAssetid, nowPrice);
        // 给所有用户发邮件
        const dateStr = util.dealDateFomat(true_lowest_bargain_price_date, 'yyyy-MM-dd hh:mm:SS');
        util.sendMail(`【${goods_name}饰品低价提醒】`, `${goods_name} 降价 
        当前价格：${nowPrice}
        网易返回的最低成交价: ${lowest_bargain_price}
        系统捕获的历史最低成交价: ${true_lowest_bargain_price}
        系统捕获的历史最低成交价的时间：${dateStr}
        饰品的资产ID：${nowAssetid}
            `, userItem.res[0].email);
      });
    });
  }
}


module.exports = noticeReduction;
