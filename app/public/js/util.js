
'use strict';
const nodemailer = require('nodemailer'); // 引入邮箱发送
module.exports = {
  /**
   * 发送邮件
   * @param {*} subject 主题
   * @param {*} text 邮件内容
   * @param {*} to 接受者，默认管理员邮箱
   */
  sendMail(subject, text = '', to = 'fmw3264@163.com') {
    const transporter = nodemailer.createTransport({
      service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
      port: 465, // SMTP 端口
      secureConnection: true, // 使用了 SSL
      auth: {
        user: '2743971824@qq.com',
        // 这里密码不是qq密码，是你设置的smtp授权码
        pass: 'sjjcwteidgcbdeca',
      },
    });
    const mailOptions = {
      from: '<2743971824@qq.com>', // sender address
      to, // list of receivers
      subject, // Subject line
      // 发送text或者html格式
      text, // plain text body
      // html: '<b>Hello world?</b>' // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });
  },
  /**
   * 封装promiseAll为一个promise
   * @param {promise} promiseArr promise数组
   */
  promiseAll(promiseArr) {
    return new Promise((resolve, reject) => {
      Promise.all(promiseArr).then(res => { resolve(res); }).catch(e => { reject(e); });
    });
  },
  /**
   * 更改日期格式的方法
   * dealDateFomat(date, "yyyy-MM-dd hh:mm:SS")
   * @param {*} dateObj 日期对象
   * @param {*} format 格式
   */
  dealDateFomat(dateObj, format) {
    const date = {
      'M+': dateObj.getMonth() + 1,
      'd+': dateObj.getDate(),
      'h+': dateObj.getHours(),
      'm+': dateObj.getMinutes(),
      's+': dateObj.getSeconds(),
      'q+': Math.floor((dateObj.getMonth() + 3) / 3),
      'S+': dateObj.getMilliseconds(),
    };
    if (/(y+)/i.test(format)) {
      format = format.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (const k in date) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length === 1 ?
          date[k] : ('00' + date[k]).substr(('' + date[k]).length));
      }
    }
    return format;
  },
};
