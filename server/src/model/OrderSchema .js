const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Orders Schema (for customer orders, linking to the menu items)
const OrderSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  items: [{ 
      menu_item_id: { type: Schema.Types.ObjectId, ref: 'Menu', required: true },
      quantity: { type: Number, required: true }
  }],
  total_cost: { type: Number, required: true },
  status: { type: String, enum: ['in_progress', 'completed', 'cancelled'], default: 'in_progress' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});


const Order = mongoose.model('Order', OrderSchema);

// Export the models
module.exports = Order