const Base = require('./base.js');
const fs = require('fs');

function createDirectory (path) {
  if (!path) return console.error('传入path路径');
  const root = think.ROOT_PATH;
  path = path.replace(/(^\/|\/$)/g, '');

  const temp = path.split('/');

  temp.reduce((prev, next) => {
    const p = prev + next + '/';
    let path = `${root}\\${p}`;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    return p;
  }, '/');

  // while (temp.length) {
  //   let p = temp.shift();
  //   let path = `${root}\\${p}`;
  //   if (!fs.existsSync(path)) {
  //     fs.mkdirSync(path);
  //   }
  // }
}

module.exports = class extends Base {
  async imageAction() {
    const imageFile = this.file('image');
    if (think.isEmpty(imageFile)) {
      return this.fail('保存失败');
    }
    const static_path = '/www';
    const upload_path = '/static/upload/images/';
    const dir_path = static_path + upload_path;
    const file_name = think.uuid(32) + '.jpg';

    const is = fs.createReadStream(imageFile.path);

    // 目录不存在，则创建
    if (!fs.existsSync(dir_path)) {
      createDirectory(dir_path);
    }

    const os = fs.createWriteStream(think.ROOT_PATH + dir_path + file_name);
    is.pipe(os);

    return this.success({
      url: 'http://127.0.0.1:8360' + upload_path + file_name
    });
  }
  // async brandPicAction() {
  //   const brandFile = this.file('brand_pic');
  //   if (think.isEmpty(brandFile)) {
  //     return this.fail('保存失败');
  //   }
  //   const that = this;
  //   const filename = '/static/upload/brand/' + think.uuid(32) + '.jpg';
  //   const is = fs.createReadStream(brandFile.path);
  //   const os = fs.createWriteStream(think.ROOT_PATH + '/www' + filename);
  //   is.pipe(os);
  //
  //   return that.success({
  //     name: 'brand_pic',
  //     fileUrl: 'http://127.0.0.1:8360' + filename
  //   });
  // }
  //
  // async brandNewPicAction() {
  //   const brandFile = this.file('brand_new_pic');
  //   if (think.isEmpty(brandFile)) {
  //     return this.fail('保存失败');
  //   }
  //   const that = this;
  //   const filename = '/static/upload/brand/' + think.uuid(32) + '.jpg';
  //
  //   const is = fs.createReadStream(brandFile.path);
  //   const os = fs.createWriteStream(think.ROOT_PATH + '/www' + filename);
  //   is.pipe(os);
  //
  //   return that.success({
  //     name: 'brand_new_pic',
  //     fileUrl: 'http://127.0.0.1:8360' + filename
  //   });
  // }

  async categoryWapBannerPicAction() {
    const imageFile = this.file('wap_banner_pic');
    if (think.isEmpty(imageFile)) {
      return this.fail('保存失败');
    }
    const that = this;
    const filename = '/static/upload/category/' + think.uuid(32) + '.jpg';

    const is = fs.createReadStream(imageFile.path);
    const os = fs.createWriteStream(think.ROOT_PATH + '/www' + filename);
    is.pipe(os);

    return that.success({
      name: 'wap_banner_url',
      fileUrl: 'http://127.0.0.1:8360' + filename
    });
  }

  async topicThumbAction() {
    const imageFile = this.file('scene_pic_url');
    if (think.isEmpty(imageFile)) {
      return this.fail('保存失败');
    }
    const that = this;
    const filename = '/static/upload/topic/' + think.uuid(32) + '.jpg';

    const is = fs.createReadStream(imageFile.path);
    const os = fs.createWriteStream(think.ROOT_PATH + '/www' + filename);
    is.pipe(os);

    return that.success({
      name: 'scene_pic_url',
      fileUrl: 'http://127.0.0.1:8360' + filename
    });
  }
};
