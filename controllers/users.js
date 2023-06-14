const User = require('../models/user');
const {
  ERROR_INVALID_DATA,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
} = require('../erorrs/erorrs');

const STATUS_OK = 200;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(STATUS_OK).send(users))
    .catch(() => res.status(ERROR_DEFAULT).send(
      { message: 'Произошла ошибка на сервере' },
    ));
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(new Error('NotFound'))
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_INVALID_DATA).send({ message: 'Переданы некорректные данные для запроса пользователя' });
      } else if (err.message === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({
          message: 'Пользователь по указонному id не найден',
        });
      } else {
        res.status(ERROR_DEFAULT)
          .send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_INVALID_DATA)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(
    _id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_INVALID_DATA)
          .send({
            message: 'Переданы некорректные данные пользователя',
          });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(
    _id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_INVALID_DATA)
          .send({
            message: 'Переданы некорректные данные пользователя',
          });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
