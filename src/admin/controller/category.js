const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {
    const model = this.model('category');
    const data = await model.where({is_delete: 0}).order(['sort_order ASC']).select();
    const topCategory = data.filter((item) => {
      return item.parent_id === 0;
    });
    const categoryList = [];
    topCategory.map((item) => {
      item.level = 1;
      categoryList.push(item);
      data.map((child) => {
        if (child.parent_id === item.id) {
          child.level = 2;
          categoryList.push(child);
        }
      });
    });
    return this.success(categoryList);
  }

  async topCategoryAction() {
    const model = this.model('category');
    const data = await model.where({parent_id: 0}).order(['id ASC']).select();

    return this.success(data);
  }

  async infoAction() {
    const id = this.get('id');
    const model = this.model('category');
    const data = await model.where({id: id}).find();

    return this.success(data);
  }

  async storeAction() {
    if (!this.isPost) {
      return false;
    }

    const params = this.post();
    const { id, parent_id } = params;

    if (!parent_id) params.level = 'L1';
    else params.level = 'L2';

    const model = this.model('category');
    params.is_show = params.is_show ? 1 : 0;
    if (id) {
      await model.where({id}).update(params);
    } else {
      delete params.id;
      await model.add(params);
    }
    return this.success(params);
  }

  async deleteAction() {
    const id = this.post('id');
    await this.model('category').where({id}).limit(1).update({
      is_delete: 1
    });
    // TODO 删除图片

    return this.success();
  }
};
