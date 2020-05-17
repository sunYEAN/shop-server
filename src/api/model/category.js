module.exports = class extends think.Model {
  async getChildCategoryId(parent_id, wxapp_id) {
    return await this.where({parent_id, is_delete: 0, wxapp_id}).getField('id', 10000);
  }

  async getCategoryWhereIn(categoryId) {
    const childIds = await this.getChildCategoryId(categoryId);
    childIds.push(categoryId);
    return childIds;
  }
};
