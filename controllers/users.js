const User = require('../models/user');
const {
  ERROR_INVALID_DATA,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
} = require('../erorrs/erorrs');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(ERROR_DEFAULT).send({
      message: 'Internal server error',
      err: err.message,
      stack: err.stack,
    }));
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({
          message: 'User not Found',
        });
      } else {
        res.status(ERROR_DEFAULT).send({
          message: 'Internal server error',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => res.status(500).send({
      message: 'Internal server error',
      err: err.message,
      stack: err.stak,
    }));
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
      } else if (err.name === 'CastError') {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Пользователь по указанному id не найден' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: err.message });
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
      } else if (err.name === 'CastError') {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Пользователь по указанному id не найден' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: err.message });
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
