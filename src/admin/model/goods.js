module.exports = class extends think.Model {
  // 获取商品列表
  get relation() {
    return {
      category: {
        type: think.Model.BELONG_TO,
        model: 'category',
        name: 'cate_info',
        key: 'category_id',
        fKey: 'id'
      }
    };
  }
};
