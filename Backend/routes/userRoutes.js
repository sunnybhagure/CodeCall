const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const { registerUser, loginUser } = require('../controller/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;