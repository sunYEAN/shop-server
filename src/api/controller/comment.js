const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * 评论类型说明：
   * 0 商品
   * 1 专题
   */

  /**
   * 发表评论
   * @returns {Promise.<*|PreventPromise|void|Promise>}
   */
  async postAction() {
    const type_id = this.post('typeId');
    const value_id = this.post('valueId');
    const wxapp_id = this.header('wxapp_id');
    const content = this.post('content');
    const buffer = Buffer.from(content);
    const insertId = await this.model('comment').add({
      type_id,
      value_id,
      wxapp_id,
      content: buffer.toString('base64'),
      add_time: this.getTime(),
      user_id: this.getLoginUserId()
    });

    if (insertId) {
      return this.success('评论添加成功');
    } else {
      return this.fail('评论保存失败');
    }
  }

  async countAction() {
    const type_id = this.get('typeId');
    const value_id = this.get('valueId');
    const wxapp_id = this.header('wxapp_id');

    const allCount = await this.model('comment').where({type_id, value_id, wxapp_id}).count('id');

    const hasPicCount = await this.model('comment').alias('comment')
      .join({
        table: 'comment_picture',
        join: 'right',
        alias: 'comment_picture',
        on: ['id', 'comment_id']
      }).where({
        'comment.type_id': type_id,
        'comment.value_id': value_id,
        'comment.wxapp_id': wxapp_id,
      }).count('comment.id');

    return this.success({
      allCount: allCount,
      hasPicCount: hasPicCount
    });
  }

  async listAction() {
    const type_id = this.get('typeId');
    const wxapp_id = this.header('wxapp_id');
    const value_id = this.get('valueId');
    const showType = this.get('showType'); // 选择评论的类型 0 全部， 1 只显示图片

    const page = this.get('page');
    const size = this.get('size');

    let comments = [];
    if (showType !== 1) {
      comments = await this.model('comment').where({
        type_id,
        value_id,
        wxapp_id
      }).page(page, size).countSelect();
    } else {
      comments = await this.model('comment').alias('comment')
        .field(['comment.*'])
        .join({
          table: 'comment_picture',
          join: 'right',
          alias: 'comment_picture',
          on: ['id', 'comment_id']
        }).page(page, size).where({
          'comment.type_id': type_id,
          'comment.value_id': value_id,
          'comment.wxapp_id': wxapp_id,
        }).countSelect();
    }

    const commentList = [];
    for (const commentItem of comments.data) {
      const comment = {};
      comment.content = Buffer.from(commentItem.content, 'base64').toString();
      comment.type_id = commentItem.type_id;
      comment.value_id = commentItem.value_id;
      comment.id = commentItem.id;
      comment.add_time = think.datetime(new Date(commentItem.add_time * 1000));
      comment.user_info = await this.model('user').field(['username', 'avatar', 'nickname']).where({id: commentItem.user_id, wxapp_id}).find();
      comment.pic_list = await this.model('comment_picture').where({comment_id: commentItem.id, wxapp_id}).select();
      commentList.push(comment);
    }
    comments.data = commentList;
    return this.success(comments);
  }
};
