/**
 * 规格
 */

const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * 获取规格列表
   * @returns {Promise<void>}
   */
  async indexAction () {
    const params = this.get();
    const {specification_id} = params;
    const data = await this.model('specification').getSpecificationList(specification_id);
    return this.success(data);
  }

  async specificationsAction () {
    const data = await this.model('specification').order('id desc').select();
    return this.success(data);
  }

};
