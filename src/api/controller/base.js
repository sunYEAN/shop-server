module.exports = class extends think.Controller {
    getWxAppId () {
        const wxapp_id = this.header('wxapp_id') || '';
        if (!wxapp_id) return this.fail('请检查header中是否存在参数wxapp_id');
        return wxapp_id;
    }

    async getWxApp (wxapp_id) {
        const app = await this.cache(wxapp_id); // 当前缓存中有没有这个微信商铺的信息
        if (think.isEmpty(app)) { // 空的，去数据库查询
            const wxapp = await this.model('wxapp').where({wxapp_id}).find();
            console.log(think.isEmpty(wxapp));
            if (think.isEmpty(wxapp)) return this.fail('该小程序wxapp_id不存在');
            await this.cache(wxapp_id, JSON.stringify(wxapp));
        }
        const w = await this.cache(wxapp_id);
        return JSON.parse(w);
    }
    async __before() {
        // 根据token值获取用户id



        // 获取微信小程序id 对应的小程序数据
        let wxapp_id = this.header('wxapp_id');
        if (!wxapp_id) return this.fail('请在header中传入参数wxapp_id');

        const app = await this.cache(wxapp_id); // 当前缓存中有没有这个微信商铺的信息
        if (think.isEmpty(app)) { // 空的，去数据库查询
            const wxapp = await this.model('wxapp').where({wxapp_id}).find();
            if (think.isEmpty(wxapp)) return this.fail('该小程序wxapp_id不存在');
            await this.cache(wxapp_id, JSON.stringify(wxapp));
        }
        let w = await this.cache(wxapp_id);
        w = JSON.parse(w);

        // 获取微信小程序的详情
        this.ctx.state[wxapp_id] = w;

        this.ctx.state.token = this.ctx.header['x-nideshop-token'] || '';

        const tokenService = think.service('token', 'api');

        this.ctx.state.userId = await tokenService.getUserId(this.ctx.state.token);

        const publicController = this.config('publicController');
        const publicAction = this.config('publicAction');

        // 如果为非公开，则验证用户是否登录
        const controllerAction = this.ctx.controller + '/' + this.ctx.action;
        if (!publicController.includes(this.ctx.controller) && !publicAction.includes(controllerAction)) {
            if (this.ctx.state.userId <= 0) {
                return this.fail(401, '请先登录');
            }
        }
    }

    /**
     * 获取时间戳
     * @returns {Number}
     */
    getTime() {
        return parseInt(Date.now() / 1000);
    }

    /**
     * 获取当前登录用户的id
     * @returns {*}
     */
    getLoginUserId() {
        return this.ctx.state.userId;
    }
};
