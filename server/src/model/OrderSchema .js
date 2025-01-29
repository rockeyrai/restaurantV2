const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Orders Schema (for customer orders, linking to the menu items and table in MySQL)
const OrderSchema = new Schema({
  user_id: { type: Number, required: true }, // Change ObjectId to Number
  table_id: { type: Number },  // MySQL table ID (from Tables table)
  items: [{
    menu_item_id: { type: Number, required: true },
    quantity: { 
      type: Number, 
      required: true, 
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an integer",
      },
      min: 1
    }
  }],  
  total_cost: { type: Number, required: true },
  status: { type: String, enum: ['in_progress', 'completed', 'cancelled'], default: 'in_progress' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

// Export the model
module.exports = Order;
