/**
 * 规格
 */

module.exports = class extends think.Model {

  /**
   * 获取连接后的表格
   * @returns {Promise<void>}
   */


  // 获取单个商品的规格
  async getGoodSpecificationList(goodsId) {
    const query = {};
    if (goodsId) {
      query['goods_id'] = goodsId;
    }
    const specificationRes = await this.model('goods_specification')
      .alias('gs')
      .field('gs.*, s.name')
      .join({
        table: 'specification',
        join: 'inner',
        as: 's',
        on: ['specification_id', 'id']
      })
      .select();

    const specificationList = [];
    const hasSpecificationList = {};
    // 按规格名称分组
    for (let i = 0; i < specificationRes.length; i++) {
      const specItem = specificationRes[i];
      if (!hasSpecificationList[specItem.specification_id]) {
        specificationList.push({
          specification_id: specItem.specification_id,
          name: specItem.name,
          valueList: [specItem]
        });
        hasSpecificationList[specItem.specification_id] = specItem;
      } else {
        for (let j = 0; j < specificationList.length; j++) {
          if (specificationList[j].specification_id === specItem.specification_id) {
            specificationList[j].valueList.push(specItem);
            break;
          }
        }
      }
    }
    return specificationList;
  }

  /**
   * 获取规格列表
   * @returns {Promise<void>}
   */
  async getSpecificationList(specification_id) {
    let query = {};

    if (specification_id && specification_id != 0) {
      query['specification_id'] = specification_id
    }

    return await this.model('goods_specification')
        .alias('gs')
        .field('gs.*, s.name')
        .join({
          table: 'specification',
          join: 'inner',
          as: 's',
          on: ['specification_id', 'id']
        })
        .where(query)
        .select();
  }
};
