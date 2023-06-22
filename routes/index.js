const router = require('express').Router();
const NotFoundError = require('../erorrs/erorrs');
const { login, createUser } = require('../controllers/users');
const { validateUserAuth, validateUserCreate } = require('../utils/validate');
const auth = require('../middlewares/auth');

router.post('/signin', validateUserAuth, login);

router.post('/signup', validateUserCreate, createUser);

router.use(auth);

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('/*', (req, res, next) => {
  next(new NotFoundError('Что-то где-то пошло как-то не так'));
});

module.exports = router;
