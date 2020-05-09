module.exports = class extends think.Model {
  /**
   * 判断用户是否收藏过该对象
   * @param user_id
   * @param type_id
   * @param value_id
   * @param wxapp_id
   * @returns {Promise.<boolean>}
   */
  async isUserHasCollect(user_id, type_id, value_id, wxapp_id) {
    return await this.where({type_id, value_id, user_id, wxapp_id}).limit(1).count('id');
  }
};
