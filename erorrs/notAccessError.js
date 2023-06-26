const { ERROR_ACCESS } = require('../utils/constans');

class NotAccessError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_ACCESS;
    this.name = 'NotUniqueData';
  }
}

module.exports = NotAccessError;
