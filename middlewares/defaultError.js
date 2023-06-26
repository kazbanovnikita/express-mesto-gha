const { ERROR_DEFAULT } = require('../utils/constans');

module.exports = (err, req, res, next) => {
  console.log(err.message);
  const { statusCode = ERROR_DEFAULT, message } = err;

  res.status(statusCode)
    .send(
      {
        message: statusCode === ERROR_DEFAULT
          ? 'Ошибка на сервере' : message,
      },
    );
  next();
};
