module.exports = class extends think.Controller {
    async storeAction() {
        const form = this.post();
        const model = this.model('goods_gallery');
        let res;
        console.log(form)
        if (form.id) {
            // 修改
        } else {
            res = await model.add(form);
        }
        this.success(res);
    }

    async sortAction () {
        const {id, newSort, } = this.post('gallery');

        const model = this.model('goods_gallery');


        this.success('成功');
    }
};
