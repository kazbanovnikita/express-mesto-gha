const router = require('express').Router();
const { validateCardID, validateCard } = require('../utils/validate');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  disLikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', validateCard, createCard);

router.delete('/:cardId', validateCardID, deleteCard);

router.delete('/:cardId/likes', validateCardID, disLikeCard);

router.put('/:cardId/likes', validateCardID, likeCard);

module.exports = router;
