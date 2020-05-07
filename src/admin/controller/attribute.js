const Base = require('./base.js');

module.exports = class extends Base {

  /**
   * 获取参数分类分页数据
   * @returns {Promise<any | never>}
   */
  async attributeAction() {
    const {page, size, id} = this.get();
    const model = this.model('attribute');

    // console.log(page, size);

    // 搜索分类名称对应的id
    const searchQuery = {
      is_delete: 0
    };
    if (id) { // 传入了参数id
      searchQuery['attribute_category_id'] = id;
    }
    const data = await model
      .where(searchQuery)
      .field([
        'nideshop_attribute.enabled as attr_enabled',
        'nideshop_attribute.id',
        'nideshop_attribute.name',
        'nideshop_attribute.input_type',
        'nideshop_attribute.values',
        'nideshop_attribute.sort_order',
        'nideshop_attribute_category.id as attribute_category_id',
        'nideshop_attribute_category.name as attribute_category_name',
        'nideshop_attribute_category.enabled as cate_enabled',
      ])
      .join('nideshop_attribute_category ON nideshop_attribute_category.id=nideshop_attribute.attribute_category_id')
      .order(['nideshop_attribute.id DESC'])
      .page(page, size)
      .countSelect();

    return this.success(data);
  }

  /**
   * 新增分类
   * @returns {Promise<void>}
   */
  async categoryAction() {
    let model = this.model('attribute_category');
    const params = await model
      .field([
        'id',
        'name',
        'enabled as cate_enabled',
      ])
      .order(['id DESC'])
      .select();
    this.success(params);
  }

  /**
   * 新增或者更新分类
   * @returns {Promise<void>}
   */
  async storeCategoryAction() {
    let params = this.post();
    let id = params.id;
    let model = this.model('attribute_category');
    let res;

    if (id) {
      delete params.id;
      res = await model.where({id}).update(params);
    } else {
      res = await model.add(params);
    }

    this.success(res);
  }

  async storeAction() {
    let params = this.post(),
      model = this.model('attribute'),
      id = params.id,
      res;

    if (id) {
      delete params.id;
      res = await model.where({id}).update(params);
    } else {
      res = await model.add(params);
    }
    this.success(res);
  }

  async deleteAttributeAction() {
    const params = this.post();
    if (!params.id) return this.fail('请传入attribute的id');
    const res = await this.model('attribute')
      .where({
        id: params.id
      })
      .update({
        is_delete: 1
      });
    this.success(res);
  }
};
