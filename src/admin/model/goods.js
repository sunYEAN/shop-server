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

  /**
   * 获取商品的规格信息
   * @param goodsId
   */
  async getGoodSpecification(goodsId) {

  }
};
