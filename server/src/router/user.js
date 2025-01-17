const { userLogin, userRegister } = require("../controllers/user");
const express = require('express');
const router = express.Router();

router.post('/login', userLogin)
router.post('/register', userRegister)

module.exports = router