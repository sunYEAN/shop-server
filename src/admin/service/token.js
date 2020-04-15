const jwt = require('jsonwebtoken');
const secret = 'SLDLKKDS323ssdd@#@@gf';

module.exports = class extends think.Service {
  /**
   * 根据header中的X-Nideshop-Token值获取用户id
   */
  async getUserId(token) {
    if (!token) {
      return 0;
    }

    const result = await this.parseToken(token);
    if (think.isEmpty(result) || result.user_id <= 0) {
      return 0;
    }

    return result.user_id;
  }

  async createToken(userInfo) {
    const token = jwt.sign(userInfo, secret);
    return token;
  }

  async parseToken(token) {
    if (token) {
      try {
        return jwt.verify(token, secret);
      } catch (err) {
        return null;
      }
    }
    return null;
  }

  async verifyToken(token) {
    const result = await this.parseToken(token);
    if (think.isEmpty(result)) {
      return false;
    }

    return true;
  }
};
