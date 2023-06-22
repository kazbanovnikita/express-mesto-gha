const router = require('express').Router();
const {
  getUsers, getUserById, updateUserProfile, updateUserAvatar, getCurrentUser,
} = require('../controllers/users');

const { validateUserData, validateUserID, validateUserAvatar } = require('../utils/validate');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', validateUserID, getUserById);

router.patch('/me', validateUserData, updateUserProfile);

router.patch('/me/avatar', validateUserAvatar, updateUserAvatar);

module.exports = router;
