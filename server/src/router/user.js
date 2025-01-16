const { userLogin } = require("../controllers/user");
const express = require('express');
const router = express.Router();

router.post('/register', userLogin)


module.exports = router