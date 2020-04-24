const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const goodId = this.get('good_id');
    const query = {};
    if (goodId) query.goods_id = goodId;
    const gallery = await this.model('gallery').where(query).find();
    this.success(gallery);
  }

  async storeAction() {
    const params = this.post();
    let model = this.get('model');

    if (params.id) {
      let id = params.id;
      delete params.id;
      model.where({id}).update(params);
    } else model('gallery').add(params);

    this.success(params);
  }
};
