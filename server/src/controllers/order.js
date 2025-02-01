const Order = require("../model/OrderSchema ");

  const getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE an order
  const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PATCH update order status
  const patchOrder = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updated_at: Date.now() },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getOrdersByUserId = async (req, res) => {
  try {
    const { user_id } = req.params; // Extract user_id from the request parameters
    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Find orders where the user_id matches
    const orders = await Order.find({ user_id: Number(user_id) });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {deleteOrder,patchOrder,getAllOrder,getOrdersByUserId}