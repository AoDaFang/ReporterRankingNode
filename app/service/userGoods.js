'use strict';

const Service = require('egg').Service;

class userGoods extends Service {
  // 查询所有的用户收藏的商品
  async selectAllUserGoods() {
    const res = await this.app.mysql.select('user_goods');
    return { res };
  }
  // 根据不同的商品查询  用户的收藏
  async selectUserByGoodsId(goods_id) {
    const res = await this.app.mysql.select('user_goods', {
      where: {
        goods_id,
      },
    });
    return { res };
  }
  // 根据user_id和goods_id 更新 last_notice 和 assetid
  async updateNoticeInfo(user_id, goods_id, last_notice, assetid, price) {
    const row = {
      last_notice,
      assetid,
      price,
    };

    const options = {
      where: {
        user_id,
        goods_id,
      },
    };
    const res = await this.app.mysql.update('user_goods', row, options);
    return { res };
  }
}
module.exports = userGoods;
