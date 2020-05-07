'use strict';

const Service = require('egg').Service;

class user extends Service {
  // 根据用户phone 获取用户信息
  async selectUserByPhone(phone) {
    const res = await this.app.mysql.select('user', {
      where: {
        phone
      },
    });
    return res;
  }
}

module.exports = user;
