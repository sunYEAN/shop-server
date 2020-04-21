const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const goodId = this.get('good_id');
    const query = {};
    if (goodId) query.goods_id = goodId;
    const gallery = await this.model('gallery').where(query).find();
    this.success(gallery);
  }
};
