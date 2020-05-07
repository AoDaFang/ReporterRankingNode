'use strict';

const Service = require('egg').Service;

class reporter extends Service {
  // 查询记者列表
  async selectReporterList() {
    const res = await this.app.mysql.select('reporter');
    return res ;
  }
  // 添加记者信息
  async insertReporter(reporter_name, phone_num) {
    const res = await this.app.mysql.insert('reporter', { reporter_name, phone_num});
    return res ;
  }




  async insertWeaponPrice(goods_id, price, date, assetid, paintwear) {
  // "users" 为test数据库数据表名
    // const res = await this.app.mysql.query('insert into min_price(goods_id, price, date) values(?,?,?)', date);
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    console.log('paintwear' + paintwear);
    const res = this.app.mysql.insert('min_price', { goods_id, price, date, assetid, paintwear });
    return { res };
  }
  // 查询某个商品的最新价格
  async selectLastItemById(goods_id) {
    const res = await this.app.mysql.select('min_price', {
      where: { goods_id }, // WHERE 条件
      orders: [[ 'date', 'desc' ]], // 排序方式
      limit: 1, // 返回数据量
      offset: 0, // 数据偏移量
    });
    return { res };
  }
}

module.exports = reporter;
