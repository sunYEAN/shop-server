const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    let goods = this.model('goods'),
      category = this.model('category');
    const banner = await this.model('ad').where({ad_position_id: 1}).select();
    const channel = await this.model('channel').order('sort_order asc').select();
    const brandList = await this.model('brand').where({is_new: 1}).order('new_sort_order asc').limit(4).select();
    const topicList = await this.model('topic').limit(3).select();

    // 获取最新的商品
    const newGoods = await goods
      .field('id, name, list_pic_url, retail_price')
      .where({is_new: 1, is_delete: 0})
      .limit(4)
      .select();

    // 获取最热门的商品
    const hotGoods = await goods
      .field('id ,name, list_pic_url, retail_price, goods_brief')
      .where({is_hot: 1, is_delete: 0})
      .limit(4)
      .select();

    // 获取顶级分类列表
    const supCategoryList = await category
      .where({parent_id: 0, name: ['<>', '推荐'], is_delete: 0, is_show: 1})
      .order('sort_order asc')
      .select();

    // 分类列表
    let newCategoryList = [];
    for (const sup of supCategoryList) {
      const childCategoryIds = await category.where({parent_id: sup.id}).getField('id', 100);
      if (childCategoryIds.length) {
        const categoryGoods = await goods
          .field('id, name, list_pic_url, retail_price')
          .where({category_id: ['IN', childCategoryIds]})
          .limit(8)
          .select();
        if (categoryGoods.length) {
          newCategoryList.push({
            id: sup.id,
            name: sup.name,
            goodsList: categoryGoods
          });
        }
      }
    }



    return this.success({
      banner: banner,
      channel: channel,
      newGoodsList: newGoods,
      hotGoodsList: hotGoods,
      brandList: brandList,
      topicList: topicList,
      categoryList: newCategoryList,
    });
  }
};
