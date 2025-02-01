const express = require('express');
const sessionMiddleware = require("../middleware/sessionMiddleware");
const { addOrder, deleteOrder, patchOrder, getAllOrder, getOrdersByUserId } = require('../controllers/order');
const router = express.Router();

router.delete("/orders/:id",deleteOrder)
router.patch("/orders/:id",patchOrder)
router.get("/orders",getAllOrder) //for admin only
router.get('/orders/user/:user_id', getOrdersByUserId);

module.exports = router