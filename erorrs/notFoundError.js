const ERROR_NOT_FOUND = require('../utils/constans');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_NOT_FOUND;
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
