const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getUsers, getUserById } = require('../controllers/userController');

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.get('/', getUsers);
router.get('/:id', getUserById);

module.exports = router;
