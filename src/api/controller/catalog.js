const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * 获取分类栏目数据
   * @returns {Promise.<Promise|void|PreventPromise>}
   */
  async indexAction() {
    const categoryId = this.get('id');

    const model = this.model('category');

    // 获取顶级分类
    const data = await model.limit(10).where({parent_id: 0, is_delete: 0}).select();

    let currentCategory = null;

    // 如果传入了ID
    if (categoryId) {
      currentCategory = await model.where({'id': categoryId}).find();
    }

    if (think.isEmpty(currentCategory)) {
      currentCategory = data[0];
    }

    // 获取子分类数据
    if (currentCategory && currentCategory.id) {
      currentCategory.subCategoryList = await model.where({parent_id: currentCategory.id, is_delete: 0}).select();
    }

    return this.success({
      categoryList: data,
      currentCategory: currentCategory
    });
  }

  async currentAction() {
    const categoryId = this.get('id');
    const model = this.model('category');

    let currentCategory = null;
    if (categoryId) {
      currentCategory = await model.where({'id': categoryId}).find();
    }
    // 获取子分类数据
    if (currentCategory && currentCategory.id) {
      currentCategory.subCategoryList = await model.where({'parent_id': currentCategory.id, is_delete: 0}).select();
    }

    return this.success({
      currentCategory: currentCategory
    });
  }
};
