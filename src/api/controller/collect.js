const Base = require('./base.js');

module.exports = class extends Base {
  async listAction() {
    const type_id = this.get('typeId');
    const user_id = this.getLoginUserId();
    const wxapp_id = this.header('wxapp_id');

    const list = await this.model('collect')
      .field(['c.*', 'g.name', 'g.list_pic_url', 'g.goods_brief', 'g.retail_price'])
      .alias('c')
      .join({
        table: 'goods',
        join: 'left',
        as: 'g',
        on: ['c.value_id', 'g.id']
      })
      .where({
        user_id,
        type_id,
        wxapp_id
      })
      .countSelect();

    return this.success(list);
  }

  async addordeleteAction() {
    const type_id = this.post('typeId');
    const value_id = this.post('valueId');
    const user_id = this.getLoginUserId();
    const wxapp_id = this.header('wxapp_id');

    const collect = await this.model('collect').where({
      user_id,
      type_id,
      wxapp_id,
      value_id,
    }).find();
    let collectRes = null;
    let handleType = 'add';
    if (think.isEmpty(collect)) {
      // 添加收藏
      collectRes = await this.model('collect').add({
        type_id,
        user_id,
        value_id,
        wxapp_id,
        add_time: parseInt(new Date().getTime() / 1000)
      });
    } else {
      // 取消收藏
      collectRes = await this.model('collect').where({
        id: collect.id,
        wxapp_id
      }).delete();
      handleType = 'delete';
    }

    if (collectRes > 0) {
      return this.success({type: handleType});
    }

    return this.fail('操作失败');
  }
};
