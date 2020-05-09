module.exports = class extends think.Model {
  async addFootprint(user_id, goods_id, wxapp_id) {
    // 用户已经登录才可以添加到足迹
    if (user_id > 0 && goods_id > 0) {
      await this.add({
        user_id,
        wxapp_id,
        goods_id,
        add_time: parseInt(Date.now() / 1000)
      });
    }
  }
};
