module.exports = class extends think.Model {

  /**
   * 清空已购买的商品
   * @returns {Promise.<*>}
   */
  async clearBuyGoods(user_id, wxapp_id) {
    return await this.model('cart').where({user_id, session_id: 1, checked: 1, wxapp_id}).delete();
  }
};
