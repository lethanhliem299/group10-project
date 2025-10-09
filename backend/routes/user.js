// routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Lấy danh sách user
router.get('/users', userController.getUsers);

// Thêm user mới
router.post('/users', userController.createUser);

module.exports = router;
