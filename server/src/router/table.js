const express = require('express');
const { checkTable, reserveTable } = require('../controllers/table');
const sessionMiddleware = require('../middleware/sessionMiddleware');
const router = express.Router();

router.get('/table', checkTable)
router.post('/reserve',sessionMiddleware, reserveTable)

module.exports = router