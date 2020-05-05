'use strict';

const Service = require('egg').Service;

class goods extends Service {
  /**
   * 更新最小成交价格
   * @param {*} goods_id 商品id
   * @param {*} lowest_bargain_price 当前网易接口返回的最低成交价
   * @param {*} true_lowest_bargain_price 真正的最低成交价
   * @param {*} true_lowest_bargain_price_date 存真正最低成交价的日期
   */
  async lowestBargainPrice(goods_id, lowest_bargain_price, true_lowest_bargain_price = null, true_lowest_bargain_price_date = null) {
    // where语句
    const options = {
      where: {
        goods_id,
      },
    };
    // 需要更新的字段
    let row = null;
    if (true_lowest_bargain_price && true_lowest_bargain_price_date) { // 需要更新系统捕获的最低成交价
      row = {
        lowest_bargain_price,
        true_lowest_bargain_price,
        true_lowest_bargain_price_date,
      };
    } else { // 不需要更新系统捕获的最低成交价
      row = {
        lowest_bargain_price,
      };
    }

    const res = await this.app.mysql.update('goods', row, options);
    return { res };
  }
  /**
   * 分页查询商品
   * @param {*} pageSize 页面大小
   * @param {*} offset 偏移量
   */
  async selectPagingGoods(pageSize, offset) {
    // "users" 为test数据库数据表名
    const res = await this.app.mysql.select('goods', {
      limit: pageSize, // 返回数据量
      offset, // 数据偏移量
    });
    return { res };
  }
  /**
   * 根据id查询商品信息
   * @param {*} goods_id 商品的id
   */
  async selectGoodsById(goods_id) {
    const res = await this.app.mysql.select('goods', {
      where: {
        goods_id,
      },
    });
    return { res };
  }
  /**
   * 查询全部商品
   */
  async selectAllGoods() {
    const res = await this.app.mysql.select('goods');
    return { res };
  }
}

module.exports = goods;
