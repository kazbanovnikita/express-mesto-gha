const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  disLikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', createCard);

router.delete('/cards/:cardId', deleteCard);

router.delete('/cards/:cardId/likes', disLikeCard);

router.put('/cards/:cardId/likes', likeCard);

module.exports = router;
