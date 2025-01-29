const { getMenu, orderFood } = require("../controllers/menu")
const express = require('express');
const sessionMiddleware = require("../middleware/sessionMiddleware");
const router = express.Router();

router.get("/menu",getMenu) 
router.post("/order",orderFood)

module.exports = router