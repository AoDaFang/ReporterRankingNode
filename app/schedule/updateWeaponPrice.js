'use strict';
const Subscription = require('egg').Subscription;

const util = require('../public/js/util');

class TaskPortal extends Subscription {

  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '7m', // 间隔
      // cron: '0 0/30 */0.5 * * *',
      type: 'all', // worker 类型：每台机器上只有一个 worker 会执行这个定时任务，每次执行定时任务的 worker 的选择是随机的。
      immediate: true,
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const {
      app,
      ctx,
    } = this;
    console.log(' ======================== 定时任务开始 ======================== ');
    console.log(' ================== 分页查询商品 ================== ');
    const pageSize = 5;
    let pagingSqlRes = await pagingGoods(pageSize);
    app.config.shareData.goodsPageNum++;
    if (+pagingSqlRes.length === 0) {
      console.log(' ================== 遍历完一次商品重新开始 ================== ');
      app.config.shareData.goodsPageNum = 1; // 遍历完毕置为第一页
      pagingSqlRes = await pagingGoods(pageSize);
    }
    // 商品分页请求完毕 开始请求商品信息
    const baseUrl = app.config.buff.baseUrl;
    const url = app.config.buff.getItemArr;
    // 同时请求多个商品的网易接口
    const promiseArr = pagingSqlRes.map(item => ctx.helper.onlineHttpUtil(ctx, baseUrl + url, 'GET', {
      game: 'csgo',
      goods_id: item.goods_id,
      page_num: 1,
      sort_by: 'default',
      allow_tradable_cooldown: 1,
      _: 1573809158510,
    }));
    Promise.all(promiseArr).then(resArr => {
      // 请求下来以后 同时存库(forEach 不整体阻塞 只阻塞单次循环中的语句)
      resArr.forEach(async ({ data: resDataItem }) => {
        console.log(' ================== 请求网易接口返回： ================== ');
        console.log(resDataItem);
        if (resDataItem.code === 'OK') {
          console.log(' ================== 请求成功开始存库 ================== ');
          const curGoodsId = Object.keys(resDataItem.data.goods_infos)[0]; // 遍历的当前商品的goods_id
          // 存商品价格
          const priceSqlRes = await ctx.service.minPrice.insertWeaponPrice(curGoodsId, resDataItem.data.items[0].price, new Date(), resDataItem.data.items[0].asset_info.assetid, resDataItem.data.items[0].asset_info.paintwear);
          +priceSqlRes.res.affectedRows === 1 && console.log(` ================== goods_id = ${curGoodsId} 价格存库成功 ================== `);
          // 查库中存储过的商品最低成交价信息，用以和当前的最低成交价对比
          const { res: dataBaseGoodsInfo } = await ctx.service.goods.selectGoodsById(curGoodsId);
          // 存最低成交价（当前最低成交价和真正的最低成交价是有差别的，网易会调整最低成交价）当当前网易返回的最低成交价小于系统捕获的最低成交价的时候系统更新true_lowest_bargain_price
          if (dataBaseGoodsInfo[0].true_lowest_bargain_price === null || +resDataItem.data.items[0].lowest_bargain_price <= +dataBaseGoodsInfo[0].true_lowest_bargain_price) {
            ctx.service.goods.lowestBargainPrice(curGoodsId, resDataItem.data.items[0].lowest_bargain_price, resDataItem.data.items[0].lowest_bargain_price, new Date());// 更新系统获取到的最低成交价
          } else {
            ctx.service.goods.lowestBargainPrice(curGoodsId, resDataItem.data.items[0].lowest_bargain_price); // 不更新系统获取到的最低成交价
          }
        } else {
          console.log(' ================== 返回报错 ================== ');
          ctx.logger.error(resDataItem);
          util.sendMail('【网易接口报错】 接口不OK', '快去看看，是不是IP让人家封了(ಥ_ಥ) ');
        }
      });
    }).catch(e => {
      ctx.logger.error(e, '接口调用报错');
      util.sendMail('【网易接口报错】try catch报错', e);
    });
    // 分页查询商品
    async function pagingGoods(pageSize) {
      const { res } = await ctx.service.goods.selectPagingGoods(pageSize, (app.config.shareData.goodsPageNum - 1) * pageSize);
      return res; // 分页查询商品
    }
  }
}


module.exports = TaskPortal;
