const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const wxapp_id = this.header('wxapp_id');
    const banner = await this.model('ad').where({ad_position_id: 1, wxapp_id}).select();
    const channel = await this.model('channel').where({wxapp_id}).order({sort_order: 'asc'}).select();
    const newGoods = await this.model('goods').field(['id', 'name', 'list_pic_url', 'retail_price']).where({is_new: 1, wxapp_id}).limit(4).select();
    const hotGoods = await this.model('goods').field(['id', 'name', 'list_pic_url', 'retail_price', 'goods_brief']).where({is_hot: 1, wxapp_id}).limit(3).select();
    const brandList = await this.model('brand').where({is_new: 1, wxapp_id}).order({new_sort_order: 'asc'}).limit(4).select();
    const topicList = await this.model('topic').where({wxapp_id}).limit(3).select();

    const categoryList = await this.model('category').where({parent_id: 0, name: ['<>', '推荐'], wxapp_id}).select();
    const newCategoryList = [];
    for (const categoryItem of categoryList) {
      const childCategoryIds = await this.model('category').where({parent_id: categoryItem.id, wxapp_id}).getField('id', 100);
      const categoryGoods = await this.model('goods').field(['id', 'name', 'list_pic_url', 'retail_price']).where({wxapp_id, category_id: ['IN', childCategoryIds]}).limit(7).select();
      newCategoryList.push({
        id: categoryItem.id,
        name: categoryItem.name,
        goodsList: categoryGoods
      });
    }

    return this.success({
      banner: banner,
      channel: channel,
      newGoodsList: newGoods,
      hotGoodsList: hotGoods,
      brandList: brandList,
      topicList: topicList,
      categoryList: newCategoryList
    });
  }
};
