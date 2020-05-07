'use strict';

const Service = require('egg').Service;

class channel extends Service {
  // 查询渠道列表
  async getChannelList() {
    const res = await this.app.mysql.select('channel');
    return res;
  }
}

module.exports = channel;
