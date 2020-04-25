const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const goodId = this.get('good_id');
    const query = {};
    if (goodId) query.goods_id = goodId;
    const gallery = await this.model('goods_gallery').where(query).find();
    this.success(gallery);
  }

  async storeAction() {
    const params = this.post();
    let model = this.model('goods_gallery');

    if (params.id) {
      let id = params.id;
      delete params.id;
      model.where({id}).update(params);
    } else model.add(params);

    this.success(params);
  }
};
