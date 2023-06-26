/* eslint-disable import/no-extraneous-dependencies */
const bcrypt = require('bcryptjs');
const jsonWedToken = require('jsonwebtoken');
const User = require('../models/user');
const { ERROR_CODE_UNIQUE, JWT_SECRET, STATUS_OK } = require('../utils/constans');

const NotFoundError = require('../erorrs/notFoundError');
const InvalidDataError = require('../erorrs/invalidDataErorr');
const NotUniqueData = require('../erorrs/notUniqueDataError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(STATUS_OK).send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.status(STATUS_OK).send(user))
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send({ user }))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hashedPassword) => {
    User.create({
      name, about, avatar, email, password: hashedPassword,
    })
      .then((user) => res.status(STATUS_OK).send(user))
      .catch((err) => {
        if (err.code === ERROR_CODE_UNIQUE) {
          next(new NotUniqueData('Такая почта уже зарегестрированна '));
        } else if (err.name === 'ValidationError') {
          next(new InvalidDataError('Переданы некорректные данные'));
        } else {
          next(err);
        }
      });
  });
};

const updateUserProfile = (req, res, next) => {
  const { name, about, email } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(
    _id,
    { name, about, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const updateUserAvatar = (req, res, next) => {
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
        next(new InvalidDataError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByIdentity(email, password)
    .then((user) => {
      const jwt = jsonWedToken.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.cookie('jwt', jwt, { maxAge: 3600000 * 24 * 7, httpOnly: true })
        .send({ message: 'Авторизация прошла успешно' });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
  getCurrentUser,
};
