/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const Card = require('../models/card');
const NotAccessError = require('../erorrs/notAccessError');
const NotFoundError = require('../erorrs/notFoundError');
const InvalidDataErorr = require('../erorrs/invalidDataErorr');

const { STATUS_OK } = require('../utils/constans');

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['name', 'link'])
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const card = req.body;
  card.owner = req.user._id;
  Card.create(card)
    .then((cardFromDb) => res.status(STATUS_OK).send(cardFromDb))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataErorr('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findById(cardId)
    .orFail(new NotFoundError('Id карточки не сущесвует'))
    .then((card) => {
      if (card.owner.toString() !== _id) {
        return Promise.reject(new NotAccessError('Нельзя удалять чужие карточки'));
      }
      return Card.deleteOne(card)
        .then(() => res.send({ message: 'карточка удалена' }));
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const { _id } = req.user;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } },
    { new: true },
  )
    .orFail(new NotFoundError('Карточки не существует'))
    .then((card) => res.send(card))
    .catch(next);
};

const disLikeCard = (req, res, next) => {
  const { _id } = req.user;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true })
    .orFail(new NotFoundError('Карточки не существует'))
    .then((card) => res.send(card))
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  disLikeCard,
};
