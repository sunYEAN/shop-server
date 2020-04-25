const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {
    const page = this.get('page') || 1;
    const size = this.get('size') || 10;
    const name = this.get('name') || '';
    const cate = this.get('cate') || '';
    const onSale = parseInt(this.get('onSale')) || 0; // 1在售、2下架
    const model = this.model('goods');
    // 搜索分类名称对应的id
    const searchQuery = {
      is_delete: 0
    };
    if (name) { // 传入了商品名称
      searchQuery['name'] = ['like', `%${name}%`];
    }
    if (cate) {
      searchQuery['category_id'] = cate;
    }
    if (onSale) {
      searchQuery['is_on_sale'] = onSale === 2 ? 0 : 1;
    }
    const data = await model
      .fieldReverse(['goods_desc'])
      .where(searchQuery)
      .order(['id DESC'])
      .page(page, size)
      .countSelect();

    return this.success(data);
  }

  async infoAction() {
    const id = this.get('id');
    const model = this.model('goods');
    const data = await model
        .fieldReverse(['attribute_category', 'category_id'])
        .where({id: id}).find();
    const gallery = await this.model('goods_gallery').where({goods_id: id}).order({sort_order: 'asc'}).select();
    const attributes = await this
        .model('goods_attribute')
        .field([
          'nideshop_goods_attribute.id',
          'nideshop_goods_attribute.value',
          'nideshop_attribute.name'
        ])
        .join('nideshop_attribute ON nideshop_goods_attribute.attribute_id=nideshop_attribute.id')
        .order({'nideshop_goods_attribute.id': 'asc'})
        .where({'nideshop_goods_attribute.goods_id': id})
        .select();

    return this.success({
      ...data,
      gallery,
      attributes
    });
  }

  async storeAction() {
    if (!this.isPost) {
      return false;
    }

    const values = this.post();
    const id = this.post('id');

    const model = this.model('goods');
    values.is_on_sale = values.is_on_sale ? 1 : 0;
    values.is_new = values.is_new ? 1 : 0;
    values.is_hot = values.is_hot ? 1 : 0;
    if (id) {
      await model.where({id: id}).update(values);
    } else {
      console.log(values)
      await model.add(values);
    }
    return this.success(values);
  }

  /**
   * 删除商品
   * @returns {Promise<void>}
   */
  async deleteAction () {
    const id = this.post('id');
    await this.model('goods').where({id: id}).update({is_delete: 1});
    // TODO 删除图片

    return this.success();
  }

  /**
   * 销毁商品
   * @returns {Promise<any>}
   */
  async destoryAction() {
    const id = this.post('id');
    await this.model('goods').where({id: id}).limit(1).delete();
    // TODO 删除图片

    return this.success();
  }
};
