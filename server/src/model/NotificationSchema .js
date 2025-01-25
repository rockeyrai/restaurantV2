const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Notification Schema (for tracking user notifications)
const NotificationSchema = new Schema({
  user_id: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['sent', 'read', 'failed'], default: 'sent' },
  created_at: { type: Date, default: Date.now },
  type: { type: String, enum: ['reservation', 'order', 'reminder'], required: true } // Add notification type
});


const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;