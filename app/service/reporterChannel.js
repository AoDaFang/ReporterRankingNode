'use strict';

const Service = require('egg').Service;

class reporter extends Service {
  // 查询新闻列表
  async getReporterChannelList() {
    const res = await this.app.mysql.select('reporter_channel');
    return res ;
  }
  // 添加新闻
  async insertReporterChannel(reporter_id, channel_id, news_name) {
    const res = await this.app.mysql.insert('reporter_channel', { reporter_id, channel_id, news_name});
    return res;
  }
}

module.exports = reporter;
