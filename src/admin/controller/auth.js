const Base = require('./base.js');

module.exports = class extends Base {
  async loginAction() {
    const username = this.post('username');
    const password = this.post('password');

    const admin = await this.model('admin').where({ username: username }).find();
    if (think.isEmpty(admin)) {
      return this.fail(401, '用户不存在');
    }

    console.log(think.md5(password + '' + admin.password_salt))

    if (think.md5(password + '' + admin.password_salt) !== admin.password) {
      return this.fail(400, '用户名或密码不正确');
    }

    // 更新登录信息
    await this.model('admin').where({ id: admin.id }).update({
      last_login_time: parseInt(Date.now() / 1000),
      last_login_ip: this.ctx.ip
    });

    const TokenSerivce = this.service('token', 'admin');
    const sessionKey = await TokenSerivce.createToken({
      user_id: admin.id
    });

    if (think.isEmpty(sessionKey)) {
      return this.fail('登录失败');
    }

    const userInfo = {
      id: admin.id,
      username: admin.username,
      avatar: admin.avatar,
      admin_role_id: admin.admin_role_id
    };

    return this.success({ token: sessionKey, userInfo: userInfo });
  }
  async adminInfoAction() {
    const admin_id = this.getLoginAdminId();
    const data = await this.model('admin')
      .alias('a')
      .field([
        'id',
        'avatar',
        'username',
        'last_login_ip',
        'last_login_time',
        'admin_role_id',
        'nideshop_wxapp.app_id',
        'nideshop_wxapp.app_name',
        'nideshop_wxapp.apikey',
        'nideshop_wxapp.mchid',
        'nideshop_wxapp.wxapp_id',
      ])
      .join({
        on: ['wxapp_id', 'wxapp_id'],
        join: 'right',
        table: 'wxapp',
      })
      .where({'id': admin_id})
      .find();
    this.success(data);
  }
  async logoutAction() {
    return this.success();
  }
};
