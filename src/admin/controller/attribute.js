const Base = require('./base.js');

module.exports = class extends Base {
    async attributeAction() {
        const {page, size, id} = this.get();
        const model = this.model('attribute');

        // console.log(page, size);

        // 搜索分类名称对应的id
        const searchQuery = {
            "nideshop_attribute.is_delete": 0
        };
        if (id) { // 传入了参数id
            searchQuery['attribute_category_id'] = id;
        }
        const data = await model
            .where(searchQuery)
            .field([
                'nideshop_attribute.enabled as attr_enabled',
                'nideshop_attribute.id',
                'nideshop_attribute.name',
                'nideshop_attribute.input_type',
                'nideshop_attribute.values',
                'nideshop_attribute.sort_order',
                'nideshop_attribute_category.id as attribute_category_id',
                'nideshop_attribute_category.name as attribute_category_name',
                'nideshop_attribute_category.enabled as cate_enabled',
            ])
            .join('nideshop_attribute_category ON nideshop_attribute_category.id=nideshop_attribute.attribute_category_id')
            .order(['nideshop_attribute.id DESC'])
            .page(page, size)
            .countSelect();

        return this.success(data);
    }

    async categoryAction() {
        let model = this.model('attribute_category');
        const params = await model
            .field([
                'id',
                'name',
                'enabled as cate_enabled',
            ])
            .where({
                is_delete: 0
            })
            .order(['id DESC'])
            .select();
        this.success(params);
    }

    async storeAction() {
        let params = this.post(),
            _model = params.model, // attribute | category
            id = params.id,
            temp,
            res;

        switch (_model) {
            case "category":
                temp = 'attribute_category';break;
            case "attribute":
                temp = 'attribute';break;
            default :
                return this.fail('请传入要正确的的model');
        }
        let model = this.model(temp);

        if (id) {
            delete params.id;
            res = await model.where({id}).update(params);
        } else {
            res = await model.add(params);
        }
        this.success(res);
    }


    async removeAction() {
        // attribute | category
        let {id, model} = this.post(),
            temp;
        switch (model) {
            case "category":
                temp = 'attribute_category';break;
            case "attribute":
                temp = 'attribute';break;
            default :
                return this.fail('请传入要正确的的model');
        }
        const res = await this.model(temp)
            .where({id})
            .update({is_delete: 1});

        this.success(res)
    }
};
