module.exports = class extends think.Model {
  /**
   * 根据快递公司编码获取名称
   * @param shipperCode
   * @param wxapp_id
   * @returns {Promise.<*>}
   */
  async getShipperNameByCode(shipperCode, wxapp_id) {
    return this.where({ code: shipperCode, wxapp_id }).getField('name', true);
  }

  /**
   * 根据 id 获取快递公司信息
   * @param shipperId
   * @param wxapp_id
   * @returns {Promise.<*>}
   */
  async getShipperById(shipperId, wxapp_id) {
    return this.where({ id: shipperId, wxapp_id }).find();
  }
};
