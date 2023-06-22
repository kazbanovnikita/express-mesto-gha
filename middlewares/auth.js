// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const NotFoundAuthError = require('../erorrs/notFoundAuthError');
const { JWT_SECRET } = require('../utils/constans');

const handleAuthError = (req, res, next) => next(new NotFoundAuthError('Пожалуйста, аторизируйтесь'));

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(req, res, next);
  }

  req.user = payload;

  return next();
};

module.exports = auth;
