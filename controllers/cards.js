const Card = require('../models/card');
const {
  ERROR_INVALID_DATA,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
} = require('../erorrs/erorrs');

const getCards = (req, res) => {
  Card.find({})
    .populate(['name', 'link'])
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const createCard = (req, res) => {
  const card = req.body;
  card.owner = req.user._id;
  Card.create(card)
    .then((cardFromDb) => res.status(201).send(cardFromDb))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_INVALID_DATA).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: err.message });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .orFail(new Error('NotFound'))
    .then((deletedCard) => res.send(deletedCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_INVALID_DATA).send({ message: 'Переданы некорректные данные для удаления карточки' });
      } else if (err.message === 'NotFound') {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Карточка с указанным id не найдена' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: err.message });
      }
    });
};

const likeCard = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } },
    { new: true },
  )
    .orFail(new Error('NotCardID'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_INVALID_DATA)
          .send({
            message: 'Некорректные данные для постановки лайка',
          });
      } else if (err.message === 'NotCardID') {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Передан не существующий id карточки' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: err.message });
      }
    });
};

const disLikeCard = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true })
    .orFail(new Error('NotFound'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_INVALID_DATA).send({
          message: 'Некорректные данные для постановки лайка',
        });
      } else if (err.message === 'NotFound') {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Передан не существующий id карточки' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: err.message });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  disLikeCard,
};
