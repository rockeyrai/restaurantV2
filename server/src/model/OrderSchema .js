const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Orders Schema (for customer orders, linking to the menu items and table in MySQL)
const OrderSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  table_id: { type: Number, required: true },  // MySQL table ID (from Tables table)
  items: [{
    menu_item_id: { type: Number, required: true },  // MySQL menu_item_id (from Menu table)
    quantity: { type: Number, required: true }
  }],
  total_cost: { type: Number, required: true },
  status: { type: String, enum: ['in_progress', 'completed', 'cancelled'], default: 'in_progress' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

// Export the model
module.exports = Order;
