const { mysqlPool } = require("../database/MySql");
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
    const { user_id } = req.params;
    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Fetch orders for the given user_id
    const orders = await Order.find({ user_id: Number(user_id) });

    // Extract unique menu_item_ids from the orders
    const menuItemIds = [...new Set(orders.flatMap(order => order.items.map(item => item.menu_item_id)))];

    // Fetch menu details from MySQL
    const [menuItems] = await mysqlPool.query(
      "SELECT menu_item_id, name, description, price FROM Menu WHERE menu_item_id IN (?)",
      [menuItemIds]
    );

    // Map menu items by menu_item_id for easy lookup
    const menuItemMap = Object.fromEntries(menuItems.map(item => [item.menu_item_id, item]));

    // Add food details to the order data
    const ordersWithDetails = orders.map(order => ({
      ...order._doc,
      items: order.items.map(item => ({
        ...item._doc,
        food: menuItemMap[item.menu_item_id] || null, // Add food details
      })),
    }));

    res.json(ordersWithDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {deleteOrder,patchOrder,getAllOrder,getOrdersByUserId}