const { ERROR_AUTH } = require('../utils/constans');

class NotFoundAuth extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_AUTH;
    this.name = 'NotFoundAuth';
  }
}

module.exports = NotFoundAuth;
