'use strict';

const Service = require('egg').Service;

class user extends Service {
  // 根据用户id 获取用户信息
  async selectUserById(id) {
    const res = await this.app.mysql.select('user', {
      where: {
        id,
      },
    });
    return { res };
  }
}

module.exports = user;
